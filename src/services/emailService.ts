/**
 * Email Service
 * Handles email sending via SendGrid or AWS SES
 * Supports templates, tracking, and campaign management
 */

import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

export type EmailProvider = "sendgrid" | "aws-ses";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  templateId?: string;
  templateData?: Record<string, string>;
  campaignId?: string;
  leadId?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: EmailProvider;
}

export interface CampaignEmailOptions {
  leads: Lead[];
  subject: string;
  template: string;
  campaignId: string;
  scheduleAt?: Date;
  batchSize?: number;
  delayBetweenEmails?: number;
}

class EmailService {
  private provider: EmailProvider;
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    // Determine provider from environment
    this.provider = this.detectProvider();
    this.apiKey = this.getApiKey();
    this.fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || "noreply@opportunityfinder.ca";
    this.fromName = process.env.NEXT_PUBLIC_FROM_NAME || "Opportunity Finder";
  }

  /**
   * Detect which email provider to use
   */
  private detectProvider(): EmailProvider {
    if (process.env.NEXT_PUBLIC_SENDGRID_API_KEY) {
      return "sendgrid";
    }
    if (process.env.NEXT_PUBLIC_AWS_SES_ACCESS_KEY) {
      return "aws-ses";
    }
    // Default to SendGrid (easier setup)
    return "sendgrid";
  }

  /**
   * Get API key for the provider
   */
  private getApiKey(): string {
    if (this.provider === "sendgrid") {
      return process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "";
    }
    return process.env.NEXT_PUBLIC_AWS_SES_ACCESS_KEY || "";
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Email service not configured. Please add API keys to environment variables.",
        provider: this.provider
      };
    }

    try {
      if (this.provider === "sendgrid") {
        return await this.sendViaSendGrid(options);
      } else {
        return await this.sendViaAwsSes(options);
      }
    } catch (error) {
      console.error("Email send error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: this.provider
      };
    }
  }

  /**
   * Send email via SendGrid
   */
  private async sendViaSendGrid(options: EmailOptions): Promise<EmailResult> {
    const trackingSettings = {
      click_tracking: { enable: options.trackClicks ?? true },
      open_tracking: { enable: options.trackOpens ?? true }
    };

    const payload = {
      personalizations: [{
        to: [{ email: options.to }],
        subject: options.subject,
        ...(options.templateData && { dynamic_template_data: options.templateData })
      }],
      from: {
        email: options.from || this.fromEmail,
        name: this.fromName
      },
      ...(options.replyTo && { reply_to: { email: options.replyTo } }),
      ...(options.templateId && { template_id: options.templateId }),
      ...(!options.templateId && {
        content: [{
          type: "text/html",
          value: options.html
        }, ...(options.text ? [{
          type: "text/plain",
          value: options.text
        }] : [])]
      }),
      tracking_settings: trackingSettings,
      custom_args: {
        ...(options.campaignId && { campaign_id: options.campaignId }),
        ...(options.leadId && { lead_id: options.leadId })
      }
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.message || `SendGrid error: ${response.status}`);
    }

    // SendGrid returns 202 with X-Message-Id header
    const messageId = response.headers.get("X-Message-Id") || undefined;

    // Log email to database
    if (options.campaignId && options.leadId) {
      await this.logEmail({
        campaignId: options.campaignId,
        leadId: options.leadId,
        messageId,
        status: "sent",
        provider: "sendgrid"
      });
    }

    return {
      success: true,
      messageId,
      provider: "sendgrid"
    };
  }

  /**
   * Send email via AWS SES
   */
  private async sendViaAwsSes(options: EmailOptions): Promise<EmailResult> {
    // AWS SES implementation would go here
    // This requires AWS SDK and proper IAM credentials
    // For now, return a placeholder
    return {
      success: false,
      error: "AWS SES integration pending - use SendGrid instead",
      provider: "aws-ses"
    };
  }

  /**
   * Send bulk campaign emails
   */
  async sendCampaignEmails(options: CampaignEmailOptions): Promise<{
    total: number;
    sent: number;
    failed: number;
    results: EmailResult[];
  }> {
    const { leads, subject, template, campaignId, batchSize = 10, delayBetweenEmails = 1000 } = options;
    
    const results: EmailResult[] = [];
    let sent = 0;
    let failed = 0;

    // Process in batches to avoid rate limits
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (lead) => {
        // Personalize email with lead data
        const personalizedHtml = this.personalizeTemplate(template, lead);
        const personalizedSubject = this.personalizeText(subject, lead);

        const result = await this.sendEmail({
          to: lead.email,
          subject: personalizedSubject,
          html: personalizedHtml,
          campaignId,
          leadId: lead.id,
          trackOpens: true,
          trackClicks: true
        });

        if (result.success) {
          sent++;
        } else {
          failed++;
        }

        results.push(result);
        return result;
      });

      await Promise.all(batchPromises);

      // Delay between batches
      if (i + batchSize < leads.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
      }
    }

    // Update campaign stats
    await this.updateCampaignStats(campaignId, sent, failed);

    return {
      total: leads.length,
      sent,
      failed,
      results
    };
  }

  /**
   * Personalize email template with lead data
   */
  private personalizeTemplate(template: string, lead: Lead): string {
    let personalized = template;
    
    const variables: Record<string, string> = {
      "{{BusinessName}}": lead.businessName,
      "{{ContactName}}": lead.contactName || "there",
      "{{City}}": lead.city,
      "{{Industry}}": lead.industry,
      "{{Website}}": lead.website || "",
      "{{Phone}}": lead.phone || "",
      "{{Rating}}": lead.rating?.toString() || "N/A"
    };

    Object.entries(variables).forEach(([key, value]) => {
      personalized = personalized.replace(new RegExp(key, "g"), value);
    });

    return personalized;
  }

  /**
   * Personalize text with lead data
   */
  private personalizeText(text: string, lead: Lead): string {
    return this.personalizeTemplate(text, lead);
  }

  /**
   * Log email to database
   */
  private async logEmail(data: {
    campaignId: string;
    leadId: string;
    messageId?: string;
    status: string;
    provider: string;
  }) {
    try {
      const { error } = await supabase
        .from("emails")
        .insert({
          campaign_id: data.campaignId,
          lead_id: data.leadId,
          message_id: data.messageId,
          status: data.status,
          provider: data.provider,
          sent_at: new Date().toISOString()
        });

      if (error) {
        console.error("Failed to log email:", error);
      }
    } catch (error) {
      console.error("Error logging email:", error);
    }
  }

  /**
   * Update campaign statistics
   */
  private async updateCampaignStats(campaignId: string, sent: number, failed: number) {
    try {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("sent_count")
        .eq("id", campaignId)
        .single();

      const currentSent = campaign?.sent_count || 0;

      const { error } = await supabase
        .from("campaigns")
        .update({
          sent_count: currentSent + sent,
          status: "active",
          sent_at: new Date().toISOString()
        })
        .eq("id", campaignId);

      if (error) {
        console.error("Failed to update campaign stats:", error);
      }
    } catch (error) {
      console.error("Error updating campaign stats:", error);
    }
  }

  /**
   * Track email open event
   */
  async trackEmailOpen(messageId: string, campaignId: string) {
    try {
      // Update email record
      await supabase
        .from("emails")
        .update({
          opened_at: new Date().toISOString(),
          status: "opened"
        })
        .eq("message_id", messageId);

      // Update campaign stats
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("opened_count")
        .eq("id", campaignId)
        .single();

      const currentOpened = campaign?.opened_count || 0;

      await supabase
        .from("campaigns")
        .update({
          opened_count: currentOpened + 1
        })
        .eq("id", campaignId);
    } catch (error) {
      console.error("Error tracking email open:", error);
    }
  }

  /**
   * Track email click event
   */
  async trackEmailClick(messageId: string, campaignId: string, url: string) {
    try {
      // Update email record
      await supabase
        .from("emails")
        .update({
          clicked_at: new Date().toISOString(),
          status: "clicked"
        })
        .eq("message_id", messageId);

      // Update campaign stats
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("clicked_count")
        .eq("id", campaignId)
        .single();

      const currentClicked = campaign?.clicked_count || 0;

      await supabase
        .from("campaigns")
        .update({
          clicked_count: currentClicked + 1
        })
        .eq("id", campaignId);

      // Log click event
      await supabase
        .from("email_events")
        .insert({
          email_id: messageId,
          event_type: "click",
          url,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error("Error tracking email click:", error);
    }
  }

  /**
   * Get email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    // This would fetch from database or SendGrid template API
    // For now, return built-in templates
    return [
      {
        id: "welcome",
        name: "Welcome Email",
        subject: "Welcome to {{BusinessName}}",
        htmlContent: "<h1>Welcome!</h1><p>Hello {{ContactName}},</p>",
        textContent: "Welcome! Hello {{ContactName}},",
        variables: ["BusinessName", "ContactName"]
      },
      {
        id: "proposal",
        name: "Business Proposal",
        subject: "Partnership Opportunity for {{BusinessName}}",
        htmlContent: "<h1>Partnership Opportunity</h1><p>Dear {{ContactName}},</p>",
        textContent: "Partnership Opportunity - Dear {{ContactName}},",
        variables: ["BusinessName", "ContactName", "City", "Industry"]
      }
    ];
  }
}

export const emailService = new EmailService();