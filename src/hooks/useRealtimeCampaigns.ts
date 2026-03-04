/**
 * Real-time Campaigns Hook
 * Subscribes to live campaign updates from Supabase
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Campaign } from "@/types/lead";
import type { Database } from "@/integrations/supabase/types";

type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];

interface UseRealtimeCampaignsOptions {
  enabled?: boolean;
  onInsert?: (campaign: Campaign) => void;
  onUpdate?: (campaign: Campaign) => void;
  onDelete?: (id: string) => void;
}

export function useRealtimeCampaigns(options: UseRealtimeCampaignsOptions = {}) {
  const { enabled = true, onInsert, onUpdate, onDelete } = options;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("campaigns-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "campaigns"
        },
        (payload) => {
          const newCampaign = transformCampaignRow(payload.new as CampaignRow);
          console.log("Real-time INSERT:", newCampaign);
          onInsert?.(newCampaign);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "campaigns"
        },
        (payload) => {
          const updatedCampaign = transformCampaignRow(payload.new as CampaignRow);
          console.log("Real-time UPDATE:", updatedCampaign);
          onUpdate?.(updatedCampaign);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "campaigns"
        },
        (payload) => {
          const deletedId = (payload.old as CampaignRow).id;
          console.log("Real-time DELETE:", deletedId);
          onDelete?.(deletedId);
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      console.log("Unsubscribing from campaigns-changes channel");
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [enabled, onInsert, onUpdate, onDelete]);

  return { isConnected };
}

/**
 * Transform database row to Campaign type
 */
function transformCampaignRow(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject || "",
    description: row.description || undefined,
    status: (row.status as Campaign["status"]) || "draft",
    recipients: row.recipients || 0,
    sent: row.sent_count || 0,
    opened: row.opened_count || 0,
    clicked: row.clicked_count || 0,
    replied: row.replied_count || 0,
    conversionRate: Number(row.conversion_rate) || 0,
    scheduledAt: row.scheduled_at || undefined,
    sentAt: row.sent_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}