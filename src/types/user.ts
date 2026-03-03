export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "sales_user" | "viewer";
  avatar?: string;
  phone?: string;
  company?: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklyReports: boolean;
  createdAt: string;
  lastLogin: string;
  subscription: {
    plan: "free" | "pro" | "enterprise";
    status: "active" | "cancelled" | "expired";
    billingCycle: "monthly" | "annual";
    nextBillingDate?: string;
  };
  stats: {
    totalLeads: number;
    emailsSent: number;
    conversions: number;
    revenue: number;
  };
  preferences: {
    defaultView: "table" | "cards" | "map";
    itemsPerPage: number;
    darkMode: boolean;
    compactMode: boolean;
  };
}

export interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    slack: boolean;
    newLeads: boolean;
    campaignUpdates: boolean;
    weeklyReports: boolean;
    systemAlerts: boolean;
  };
  privacy: {
    profileVisibility: "public" | "team" | "private";
    showEmail: boolean;
    showPhone: boolean;
    activityTracking: boolean;
  };
  integrations: {
    googleCalendar: boolean;
    slack: boolean;
    zapier: boolean;
    hubspot: boolean;
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}