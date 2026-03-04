// Engagement Status matches database CHECK constraint
export type EngagementStatus = 
  | "new" 
  | "contacted" 
  | "qualified" 
  | "proposal_sent" 
  | "negotiation" 
  | "won" 
  | "lost";

export interface SocialMediaLinks {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  postalCode?: string;
  province?: string;
  category?: string;
  industry: string;
  businessAge?: number;
  rating?: number;
  reviewCount?: number;
  website?: string;
  businessDescription?: string;
  socialMedia?: SocialMediaLinks;
  dataSource?: string;
  leadScore: number;
  websiteQualityScore?: number;
  engagementStatus: EngagementStatus;
  status: string;
  tags: string[];
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search?: string;
  categories?: string[];
  cities?: string[];
  minRating?: number;
  minLeadScore?: number;
  engagementStatuses?: EngagementStatus[];
  tags?: string[];
}

export const CATEGORIES = [
  "Real Estate",
  "Manufacturing",
  "IT & Technology",
  "Accounting",
  "Law Firm",
  "Healthcare",
  "Retail",
  "Construction",
  "Hospitality",
  "Education",
  "Professional Services",
  "Financial Services",
  "Marketing & Advertising",
  "Transportation",
  "Other"
];

// Export as BUSINESS_CATEGORIES for backward compatibility
export const BUSINESS_CATEGORIES = CATEGORIES;

export const NB_CITIES = [
  "Moncton",
  "Saint John",
  "Fredericton",
  "Bathurst",
  "Dieppe",
  "Miramichi",
  "Edmundston",
  "Riverview",
  "Quispamsis",
  "Rothesay",
  "Campbellton",
  "Shediac",
  "Oromocto",
  "Grand Falls",
  "Woodstock",
  "Caraquet",
  "Sussex",
  "Tracadie",
  "Grand Bay-Westfield",
  "Sackville"
];

export type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  description?: string;
  status: CampaignStatus;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  conversionRate: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}