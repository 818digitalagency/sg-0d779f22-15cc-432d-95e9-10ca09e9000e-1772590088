/**
 * Campaign Service
 * Handles all campaign-related database operations
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"];

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: "draft" | "scheduled" | "active" | "paused" | "completed";
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsReplied: number;
  emailsBounced: number;
  conversionRate: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class CampaignService {
  /**
   * Get all campaigns for the current user
   */
  async getCampaigns(): Promise<{ data: Campaign[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        return { data: null, error };
      }

      const campaigns: Campaign[] = (data || []).map(this.transformCampaignRow);
      return { data: campaigns, error: null };
    } catch (error) {
      console.error("Exception in getCampaigns:", error);
      return { data: null, error };
    }
  }

  /**
   * Get a single campaign by ID
   */
  async getCampaign(id: string): Promise<{ data: Campaign | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching campaign:", error);
        return { data: null, error };
      }

      return { data: this.transformCampaignRow(data), error: null };
    } catch (error) {
      console.error("Exception in getCampaign:", error);
      return { data: null, error };
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(campaign: Partial<Campaign>): Promise<{ data: Campaign | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const campaignInsert: CampaignInsert = {
        user_id: user.id,
        name: campaign.name || "Untitled Campaign",
        description: campaign.description,
        subject: campaign.name || "Untitled Campaign",
        status: campaign.status || "draft",
        emails_sent: campaign.emailsSent || 0,
        emails_opened: campaign.emailsOpened || 0,
        emails_clicked: campaign.emailsClicked || 0,
        emails_replied: campaign.emailsReplied || 0,
        emails_bounced: campaign.emailsBounced || 0,
        emails_delivered: campaign.emailsSent || 0,
        conversion_rate: campaign.conversionRate || 0,
        scheduled_at: campaign.scheduledAt,
        total_recipients: 0
      };

      const { data, error } = await supabase
        .from("campaigns")
        .insert(campaignInsert)
        .select()
        .single();

      if (error) {
        console.error("Error creating campaign:", error);
        return { data: null, error };
      }

      return { data: this.transformCampaignRow(data), error: null };
    } catch (error) {
      console.error("Exception in createCampaign:", error);
      return { data: null, error };
    }
  }

  /**
   * Update a campaign
   */
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<{ data: Campaign | null; error: any }> {
    try {
      const campaignUpdate: CampaignUpdate = {
        name: updates.name,
        description: updates.description,
        status: updates.status,
        emails_sent: updates.emailsSent,
        emails_opened: updates.emailsOpened,
        emails_clicked: updates.emailsClicked,
        emails_replied: updates.emailsReplied,
        emails_bounced: updates.emailsBounced,
        emails_delivered: updates.emailsSent,
        conversion_rate: updates.conversionRate,
        scheduled_at: updates.scheduledAt,
        total_recipients: 0
      };

      // Remove undefined values
      Object.keys(campaignUpdate).forEach(key => 
        campaignUpdate[key as keyof CampaignUpdate] === undefined && delete campaignUpdate[key as keyof CampaignUpdate]
      );

      const { data, error } = await supabase
        .from("campaigns")
        .update(campaignUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating campaign:", error);
        return { data: null, error };
      }

      return { data: this.transformCampaignRow(data), error: null };
    } catch (error) {
      console.error("Exception in updateCampaign:", error);
      return { data: null, error };
    }
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting campaign:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Exception in deleteCampaign:", error);
      return { error };
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(): Promise<{ 
    data: { 
      totalCampaigns: number;
      activeCampaigns: number;
      totalSent: number;
      avgOpenRate: number;
      avgClickRate: number;
      avgConversionRate: number;
    } | null; 
    error: any 
  }> {
    try {
      const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select("status, emails_sent, emails_opened, emails_clicked, conversion_rate");

      if (error) {
        console.error("Error fetching campaign stats:", error);
        return { data: null, error };
      }

      const totalCampaigns = campaigns?.length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;
      const totalSent = campaigns?.reduce((sum, c) => sum + (c.emails_sent || 0), 0) || 0;
      const totalOpened = campaigns?.reduce((sum, c) => sum + (c.emails_opened || 0), 0) || 0;
      const totalClicked = campaigns?.reduce((sum, c) => sum + (c.emails_clicked || 0), 0) || 0;
      const totalConversion = campaigns?.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) || 0;

      return {
        data: {
          totalCampaigns,
          activeCampaigns,
          totalSent,
          avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
          avgClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
          avgConversionRate: totalCampaigns > 0 ? totalConversion / totalCampaigns : 0
        },
        error: null
      };
    } catch (error) {
      console.error("Exception in getCampaignStats:", error);
      return { data: null, error };
    }
  }

  /**
   * Transform database row to Campaign type
   */
  private transformCampaignRow(row: CampaignRow): Campaign {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description || undefined,
      status: row.status as "draft" | "scheduled" | "active" | "paused" | "completed",
      emailsSent: row.emails_sent,
      emailsOpened: row.emails_opened,
      emailsClicked: row.emails_clicked,
      emailsReplied: row.emails_replied,
      emailsBounced: row.emails_bounced,
      conversionRate: row.conversion_rate,
      scheduledAt: row.scheduled_at || undefined,
      startedAt: undefined,
      completedAt: undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const campaignService = new CampaignService();