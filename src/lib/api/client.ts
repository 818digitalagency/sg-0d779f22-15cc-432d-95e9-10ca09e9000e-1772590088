/**
 * API Client
 * Centralized API communication layer
 */

import type { Lead } from "@/types/lead";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface LeadFilters {
  search?: string;
  category?: string;
  city?: string;
  status?: string;
  minScore?: number;
  maxScore?: number;
  page?: number;
  pageSize?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Network error",
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Lead Management
  async getLeads(filters: LeadFilters = {}): Promise<ApiResponse<PaginatedResponse<Lead>>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    return this.request<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
  }

  async getLead(id: string): Promise<ApiResponse<Lead>> {
    return this.request<Lead>(`/leads/${id}`);
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return this.request<Lead>(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/leads/${id}`, {
      method: "DELETE",
    });
  }

  async exportLeads(filters: LeadFilters = {}, format: "csv" | "excel" = "csv"): Promise<Blob | null> {
    try {
      const params = new URLSearchParams({ format, ...filters as any });
      const response = await fetch(`${this.baseUrl}/leads/export?${params.toString()}`);
      
      if (!response.ok) throw new Error("Export failed");
      
      return await response.blob();
    } catch (error) {
      console.error("Export error:", error);
      return null;
    }
  }

  // Email Campaigns
  async sendProposal(leadId: string, proposalData: {
    subject: string;
    content: string;
    template?: string;
    scheduledAt?: string;
  }): Promise<ApiResponse<{ campaignId: string }>> {
    return this.request<{ campaignId: string }>(`/campaigns/send`, {
      method: "POST",
      body: JSON.stringify({ leadId, ...proposalData }),
    });
  }

  async sendBulkProposals(leadIds: string[], proposalData: {
    subject: string;
    content: string;
    template?: string;
  }): Promise<ApiResponse<{ campaignId: string; sent: number }>> {
    return this.request<{ campaignId: string; sent: number }>(`/campaigns/bulk-send`, {
      method: "POST",
      body: JSON.stringify({ leadIds, ...proposalData }),
    });
  }

  async getCampaigns(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/campaigns");
  }

  async getCampaignStats(campaignId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/campaigns/${campaignId}/stats`);
  }

  // Analytics
  async getAnalytics(period: "7d" | "30d" | "90d" = "30d"): Promise<ApiResponse<any>> {
    return this.request<any>(`/analytics?period=${period}`);
  }

  // AI Features
  async generateProposal(leadId: string, options: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/ai/generate-proposal`, {
      method: "POST",
      body: JSON.stringify({ leadId, options }),
    });
  }

  async scoreLead(leadId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/ai/score-lead/${leadId}`);
  }

  async scoreAllLeads(): Promise<ApiResponse<{ processed: number }>> {
    return this.request<{ processed: number }>(`/ai/score-all-leads`, {
      method: "POST",
    });
  }

  // Data Collection
  async triggerScrape(sources: string[] = []): Promise<ApiResponse<{ jobId: string }>> {
    return this.request<{ jobId: string }>(`/scraper/trigger`, {
      method: "POST",
      body: JSON.stringify({ sources }),
    });
  }

  async getScrapeStatus(jobId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/scraper/status/${jobId}`);
  }

  async getScrapeLogs(limit: number = 50): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/scraper/logs?limit=${limit}`);
  }
}

export const apiClient = new ApiClient();