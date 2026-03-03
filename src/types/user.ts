export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "sales_user" | "viewer";
  avatarUrl?: string;
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
  userId: string;
  emailNotifications: boolean;
  smsNotifications?: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  activityAlerts: boolean;
  weeklyDigest: boolean;
  digestFrequency?: string;
  theme: "light" | "dark" | "auto";
  timezone: string;
  language: string;
  defaultExportFormat: "csv" | "excel" | "pdf";
  apiKey?: string;
  apiEnabled?: boolean;
  apiRateLimit?: number;
  twoFactorEnabled?: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}