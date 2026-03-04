/**
 * Real-time Notifications Hook
 * Manages real-time notification subscriptions and state
 */

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RealtimeNotification {
  id: string;
  type: "lead_created" | "campaign_completed" | "email_opened" | "proposal_accepted" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

interface UseRealtimeNotificationsOptions {
  enabled?: boolean;
  maxNotifications?: number;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { enabled = true, maxNotifications = 50 } = options;
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Add new notification
  const addNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications((prev) => {
      const newNotifications = [notification, ...prev].slice(0, maxNotifications);
      return newNotifications;
    });
    setUnreadCount((prev) => prev + 1);
  }, [maxNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Subscribe to leads channel for new lead notifications
    const leadsChannel = supabase
      .channel("leads-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads"
        },
        (payload) => {
          const lead = payload.new as any;
          addNotification({
            id: `lead-${lead.id}-${Date.now()}`,
            type: "lead_created",
            title: "New Lead Added",
            message: `${lead.business_name} has been added to your leads`,
            timestamp: new Date().toISOString(),
            read: false,
            data: { leadId: lead.id, businessName: lead.business_name }
          });
        }
      )
      .subscribe((status) => {
        console.log("Leads notification subscription:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    // Subscribe to campaigns channel for campaign updates
    const campaignsChannel = supabase
      .channel("campaigns-notifications")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "campaigns",
          filter: "status=eq.completed"
        },
        (payload) => {
          const campaign = payload.new as any;
          addNotification({
            id: `campaign-${campaign.id}-${Date.now()}`,
            type: "campaign_completed",
            title: "Campaign Completed",
            message: `${campaign.name} has finished running`,
            timestamp: new Date().toISOString(),
            read: false,
            data: { 
              campaignId: campaign.id, 
              campaignName: campaign.name,
              emailsSent: campaign.emails_sent
            }
          });
        }
      )
      .subscribe();

    // Subscribe to emails channel for engagement notifications
    const emailsChannel = supabase
      .channel("emails-notifications")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "emails",
          filter: "opened_at=not.is.null"
        },
        (payload) => {
          const email = payload.new as any;
          if (!payload.old || (payload.old as any).opened_at === null) {
            addNotification({
              id: `email-${email.id}-${Date.now()}`,
              type: "email_opened",
              title: "Email Opened",
              message: `Your email was opened by a recipient`,
              timestamp: new Date().toISOString(),
              read: false,
              data: { 
                emailId: email.id,
                leadId: email.lead_id
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Unsubscribing from notification channels");
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(emailsChannel);
      setIsConnected(false);
    };
  }, [enabled, addNotification]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification
  };
}