/**
 * Profile Service
 * Handles user profile and settings operations
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User, UserSettings, ActivityLog } from "@/types/user";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type UserSettingsRow = Database["public"]["Tables"]["user_settings"]["Row"];
type UserSettingsUpdate = Database["public"]["Tables"]["user_settings"]["Update"];
type ActivityLogRow = Database["public"]["Tables"]["activity_logs"]["Row"];

export class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ data: User | null; error: any }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return { data: null, error };
      }

      const user: User = {
        id: data.id,
        email: authUser.email || "",
        firstName: data.full_name?.split(" ")[0] || "",
        lastName: data.full_name?.split(" ").slice(1).join(" ") || "",
        avatarUrl: data.avatar_url || undefined,
        role: "admin",
        timezone: "America/Moncton",
        language: "en",
        emailNotifications: true,
        browserNotifications: true,
        weeklyReports: true,
        createdAt: data.created_at,
        lastLogin: new Date().toISOString(),
        subscription: {
          plan: "free",
          status: "active",
          billingCycle: "monthly"
        },
        stats: {
          totalLeads: 0,
          emailsSent: 0,
          conversions: 0,
          revenue: 0
        },
        preferences: {
          defaultView: "table",
          itemsPerPage: 25,
          darkMode: false,
          compactMode: false
        }
      };

      return { data: user, error: null };
    } catch (error) {
      console.error("Exception in getProfile:", error);
      return { data: null, error };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<{ data: User | null; error: any }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const profileUpdate: ProfileUpdate = {
        full_name: updates.firstName && updates.lastName 
          ? `${updates.firstName} ${updates.lastName}` 
          : undefined,
        avatar_url: updates.avatarUrl
      };

      // Remove undefined values
      Object.keys(profileUpdate).forEach(key => 
        profileUpdate[key as keyof ProfileUpdate] === undefined && delete profileUpdate[key as keyof ProfileUpdate]
      );

      const { data, error } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", authUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return { data: null, error };
      }

      const user: User = {
        id: data.id,
        email: authUser.email || "",
        firstName: data.full_name?.split(" ")[0] || "",
        lastName: data.full_name?.split(" ").slice(1).join(" ") || "",
        avatarUrl: data.avatar_url || undefined,
        role: "admin",
        timezone: "America/Moncton",
        language: "en",
        emailNotifications: true,
        browserNotifications: true,
        weeklyReports: true,
        createdAt: data.created_at,
        lastLogin: new Date().toISOString(),
        subscription: {
          plan: "free",
          status: "active",
          billingCycle: "monthly"
        },
        stats: {
          totalLeads: 0,
          emailsSent: 0,
          conversions: 0,
          revenue: 0
        },
        preferences: {
          defaultView: "table",
          itemsPerPage: 25,
          darkMode: false,
          compactMode: false
        }
      };

      return { data: user, error: null };
    } catch (error) {
      console.error("Exception in updateProfile:", error);
      return { data: null, error };
    }
  }

  /**
   * Get user settings
   */
  async getSettings(): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // If no settings exist, return defaults
        if (error.code === "PGRST116") {
          return {
            data: {
              userId: user.id,
              emailNotifications: true,
              pushNotifications: false,
              marketingEmails: false,
              activityAlerts: true,
              weeklyDigest: true,
              theme: "light",
              timezone: "America/Moncton",
              language: "en",
              defaultExportFormat: "csv"
            },
            error: null
          };
        }
        console.error("Error fetching settings:", error);
        return { data: null, error };
      }

      const settings: UserSettings = {
        userId: data.user_id,
        emailNotifications: data.email_notifications,
        pushNotifications: false,
        marketingEmails: data.marketing_emails,
        activityAlerts: data.activity_alerts,
        weeklyDigest: data.weekly_digest,
        theme: data.theme as "light" | "dark" | "auto",
        timezone: data.timezone,
        language: data.language,
        defaultExportFormat: data.default_export_format as "csv" | "excel" | "pdf"
      };

      return { data: settings, error: null };
    } catch (error) {
      console.error("Exception in getSettings:", error);
      return { data: null, error };
    }
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const settingsUpdate: UserSettingsUpdate = {
        email_notifications: settings.emailNotifications,
        marketing_emails: settings.marketingEmails,
        activity_alerts: settings.activityAlerts,
        weekly_digest: settings.weeklyDigest,
        theme: settings.theme,
        timezone: settings.timezone,
        language: settings.language,
        default_export_format: settings.defaultExportFormat
      };

      // Remove undefined values
      Object.keys(settingsUpdate).forEach(key => 
        settingsUpdate[key as keyof UserSettingsUpdate] === undefined && delete settingsUpdate[key as keyof UserSettingsUpdate]
      );

      const { data, error } = await supabase
        .from("user_settings")
        .upsert({ user_id: user.id, ...settingsUpdate })
        .select()
        .single();

      if (error) {
        console.error("Error updating settings:", error);
        return { data: null, error };
      }

      const updatedSettings: UserSettings = {
        userId: data.user_id,
        emailNotifications: data.email_notifications,
        pushNotifications: false,
        marketingEmails: data.marketing_emails,
        activityAlerts: data.activity_alerts,
        weeklyDigest: data.weekly_digest,
        theme: data.theme as "light" | "dark" | "auto",
        timezone: data.timezone,
        language: data.language,
        defaultExportFormat: data.default_export_format as "csv" | "excel" | "pdf"
      };

      return { data: updatedSettings, error: null };
    } catch (error) {
      console.error("Exception in updateSettings:", error);
      return { data: null, error };
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(limit: number = 50): Promise<{ data: ActivityLog[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching activity logs:", error);
        return { data: null, error };
      }

      const logs: ActivityLog[] = (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        resource: row.resource,
        resourceId: row.resource_id || undefined,
        details: row.details || undefined,
        metadata: (row.metadata as Record<string, any>) || undefined,
        ipAddress: row.ip_address || undefined,
        userAgent: row.user_agent || undefined,
        timestamp: row.created_at // Using created_at as timestamp
      }));

      return { data: logs, error: null };
    } catch (error) {
      console.error("Exception in getActivityLogs:", error);
      return { data: null, error };
    }
  }

  /**
   * Log an activity
   */
  async logActivity(
    action: string,
    resource: string,
    resourceId?: string,
    details?: string
  ): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: new Error("User not authenticated") };
      }

      const { error } = await supabase
        .from("activity_logs")
        .insert({
          user_id: user.id,
          action,
          resource,
          resource_id: resourceId,
          details,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error("Error logging activity:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Exception in logActivity:", error);
      return { error };
    }
  }
}

export const profileService = new ProfileService();