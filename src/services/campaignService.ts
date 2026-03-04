/**
 * Campaign Service
 * Handles all campaign-related database operations
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Campaign, CampaignStatus } from "@/types/lead";

type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"];

export class CampaignService {
  /**
   * Fetch all campaigns
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

      const campaigns = (data || []).map(this.transformCampaignRow);
      return { data: campaigns, error: null };
    } catch (error) {
      console.error("Exception in getCampaigns:", error);
      return { data: null, error };
    }
  }

  /**
   * Get campaign by ID
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
        subject: campaign.subject || "",
        description: campaign.description,
        status: (campaign.status as CampaignStatus) || "draft",
        conversion_rate: campaign.conversionRate || 0,
        scheduled_at: campaign.scheduledAt,
        sent_at: campaign.sentAt,
        recipients: campaign.recipients || 0,
        sent_count: campaign.sent || 0,
        opened_count: campaign.opened || 0,
        clicked_count: campaign.clicked || 0,
        replied_count: campaign.replied || 0
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
        subject: updates.subject,
        description: updates.description,
        status: updates.status as CampaignStatus,
        conversion_rate: updates.conversionRate,
        scheduled_at: updates.scheduledAt,
        sent_at: updates.sentAt,
        recipients: updates.recipients,
        sent_count: updates.sent,
        opened_count: updates.opened,
        clicked_count: updates.clicked,
        replied_count: updates.replied,
        updated_at: new Date().toISOString()
      };

      // Remove undefined keys
      Object.keys(campaignUpdate).forEach(key => 
        (campaignUpdate as any)[key] === undefined && delete (campaignUpdate as any)[key]
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
        .select("status, sent_count, opened_count, clicked_count, conversion_rate");

      if (error) {
        console.error("Error fetching campaign stats:", error);
        return { data: null, error };
      }

      const totalCampaigns = campaigns?.length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;
      const totalSent = campaigns?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
      const totalOpened = campaigns?.reduce((sum, c) => sum + (c.opened_count || 0), 0) || 0;
      const totalClicked = campaigns?.reduce((sum, c) => sum + (c.clicked_count || 0), 0) || 0;
      const totalConversion = campaigns?.reduce((sum, c) => sum + (Number(c.conversion_rate) || 0), 0) || 0;

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
      name: row.name,
      subject: row.subject || "",
      description: row.description || undefined,
      status: (row.status as CampaignStatus) || "draft",
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
}

export const campaignService = new CampaignService();