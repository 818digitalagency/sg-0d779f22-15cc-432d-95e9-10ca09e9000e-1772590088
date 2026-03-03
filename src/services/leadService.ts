/**
 * Lead Service
 * Handles all lead-related database operations
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Lead } from "@/types/lead";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export class LeadService {
  /**
   * Get all leads for the current user
   */
  async getLeads(filters?: {
    search?: string;
    industry?: string;
    city?: string;
    status?: string;
    minScore?: number;
    maxScore?: number;
  }): Promise<{ data: Lead[] | null; error: any }> {
    try {
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`business_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.industry) {
        query = query.eq("industry", filters.industry);
      }

      if (filters?.city) {
        query = query.eq("city", filters.city);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.minScore !== undefined) {
        query = query.gte("lead_score", filters.minScore);
      }

      if (filters?.maxScore !== undefined) {
        query = query.lte("lead_score", filters.maxScore);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching leads:", error);
        return { data: null, error };
      }

      // Transform database rows to Lead type
      const leads: Lead[] = (data || []).map(this.transformLeadRow);

      return { data: leads, error: null };
    } catch (error) {
      console.error("Exception in getLeads:", error);
      return { data: null, error };
    }
  }

  /**
   * Get a single lead by ID
   */
  async getLead(id: string): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching lead:", error);
        return { data: null, error };
      }

      return { data: this.transformLeadRow(data), error: null };
    } catch (error) {
      console.error("Exception in getLead:", error);
      return { data: null, error };
    }
  }

  /**
   * Create a new lead
   */
  async createLead(lead: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const leadInsert: LeadInsert = {
        user_id: user.id,
        business_name: lead.businessName || "",
        contact_name: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        address: lead.address,
        city: lead.city || "",
        postal_code: lead.postalCode,
        province: lead.province || "NB",
        industry: lead.industry || "",
        business_description: lead.businessDescription,
        business_age: lead.businessAge,
        rating: lead.rating,
        review_count: lead.reviewCount,
        social_media: lead.socialMedia,
        data_source: lead.dataSource,
        lead_score: lead.leadScore || 0,
        website_quality_score: lead.websiteQualityScore,
        status: lead.status || "not_contacted",
        tags: lead.tags || [],
        last_contact_date: lead.lastContactDate
      };

      const { data, error } = await supabase
        .from("leads")
        .insert(leadInsert)
        .select()
        .single();

      if (error) {
        console.error("Error creating lead:", error);
        return { data: null, error };
      }

      return { data: this.transformLeadRow(data), error: null };
    } catch (error) {
      console.error("Exception in createLead:", error);
      return { data: null, error };
    }
  }

  /**
   * Update a lead
   */
  async updateLead(id: string, updates: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      const leadUpdate: LeadUpdate = {
        business_name: updates.businessName,
        contact_name: updates.contactName,
        email: updates.email,
        phone: updates.phone,
        website: updates.website,
        address: updates.address,
        city: updates.city,
        postal_code: updates.postalCode,
        province: updates.province,
        industry: updates.industry,
        business_description: updates.businessDescription,
        business_age: updates.businessAge,
        rating: updates.rating,
        review_count: updates.reviewCount,
        social_media: updates.socialMedia,
        data_source: updates.dataSource,
        lead_score: updates.leadScore,
        website_quality_score: updates.websiteQualityScore,
        status: updates.status,
        tags: updates.tags,
        last_contact_date: updates.lastContactDate
      };

      // Remove undefined values
      Object.keys(leadUpdate).forEach(key => 
        leadUpdate[key as keyof LeadUpdate] === undefined && delete leadUpdate[key as keyof LeadUpdate]
      );

      const { data, error } = await supabase
        .from("leads")
        .update(leadUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating lead:", error);
        return { data: null, error };
      }

      return { data: this.transformLeadRow(data), error: null };
    } catch (error) {
      console.error("Exception in updateLead:", error);
      return { data: null, error };
    }
  }

  /**
   * Delete a lead
   */
  async deleteLead(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting lead:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Exception in deleteLead:", error);
      return { error };
    }
  }

  /**
   * Bulk delete leads
   */
  async bulkDeleteLeads(ids: string[]): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .in("id", ids);

      if (error) {
        console.error("Error bulk deleting leads:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Exception in bulkDeleteLeads:", error);
      return { error };
    }
  }

  /**
   * Get lead statistics
   */
  async getLeadStats(): Promise<{ 
    data: { 
      total: number; 
      byIndustry: Record<string, number>; 
      byCity: Record<string, number>;
      byStatus: Record<string, number>;
      avgScore: number;
    } | null; 
    error: any 
  }> {
    try {
      const { data: leads, error } = await supabase
        .from("leads")
        .select("industry, city, status, lead_score");

      if (error) {
        console.error("Error fetching lead stats:", error);
        return { data: null, error };
      }

      const byIndustry: Record<string, number> = {};
      const byCity: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      let totalScore = 0;

      (leads || []).forEach(lead => {
        if (lead.industry) {
          byIndustry[lead.industry] = (byIndustry[lead.industry] || 0) + 1;
        }
        if (lead.city) {
          byCity[lead.city] = (byCity[lead.city] || 0) + 1;
        }
        if (lead.status) {
          byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
        }
        totalScore += lead.lead_score || 0;
      });

      return {
        data: {
          total: leads?.length || 0,
          byIndustry,
          byCity,
          byStatus,
          avgScore: leads?.length ? totalScore / leads.length : 0
        },
        error: null
      };
    } catch (error) {
      console.error("Exception in getLeadStats:", error);
      return { data: null, error };
    }
  }

  /**
   * Transform database row to Lead type
   */
  private transformLeadRow(row: LeadRow): Lead {
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
      province: row.province,
      industry: row.industry,
      businessDescription: row.business_description || undefined,
      businessAge: row.business_age || undefined,
      rating: row.rating || undefined,
      reviewCount: row.review_count || undefined,
      socialMedia: row.social_media || undefined,
      dataSource: row.data_source || undefined,
      leadScore: row.lead_score,
      websiteQualityScore: row.website_quality_score || undefined,
      status: row.status,
      tags: row.tags || [],
      lastContactDate: row.last_contact_date || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const leadService = new LeadService();