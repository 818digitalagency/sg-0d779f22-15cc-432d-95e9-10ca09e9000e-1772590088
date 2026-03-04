/**
 * Real-time Leads Hook
 * Subscribes to live lead updates from Supabase
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lead, EngagementStatus } from "@/types/lead";
import type { Database } from "@/integrations/supabase/types";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

interface UseRealtimeLeadsOptions {
  enabled?: boolean;
  onInsert?: (lead: Lead) => void;
  onUpdate?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
}

export function useRealtimeLeads(options: UseRealtimeLeadsOptions = {}) {
  const { enabled = true, onInsert, onUpdate, onDelete } = options;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads"
        },
        (payload) => {
          const newLead = transformLeadRow(payload.new as LeadRow);
          console.log("Real-time INSERT:", newLead);
          onInsert?.(newLead);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leads"
        },
        (payload) => {
          const updatedLead = transformLeadRow(payload.new as LeadRow);
          console.log("Real-time UPDATE:", updatedLead);
          onUpdate?.(updatedLead);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "leads"
        },
        (payload) => {
          const deletedId = (payload.old as LeadRow).id;
          console.log("Real-time DELETE:", deletedId);
          onDelete?.(deletedId);
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      console.log("Unsubscribing from leads-changes channel");
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [enabled, onInsert, onUpdate, onDelete]);

  return { isConnected };
}

/**
 * Transform database row to Lead type
 */
function transformLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name || undefined,
    email: row.email || undefined,
    phone: row.phone || undefined,
    website: row.website || undefined,
    address: row.address || undefined,
    city: row.city,
    postalCode: row.postal_code || undefined,
    province: row.province || "New Brunswick",
    industry: row.industry,
    businessDescription: row.business_description || undefined,
    businessAge: row.business_age || undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    reviewCount: row.review_count || 0,
    websiteQualityScore: row.website_quality_score || undefined,
    leadScore: row.lead_score || 0,
    socialMedia: (row.social_media as Record<string, string>) || undefined,
    engagementStatus: row.status as EngagementStatus,
    status: row.status as EngagementStatus,
    tags: row.tags || [],
    lastContactDate: row.last_contact_date || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}