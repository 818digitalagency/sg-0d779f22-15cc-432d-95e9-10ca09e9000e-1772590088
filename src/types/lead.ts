export interface Lead {
  id: string;
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  website?: string;
  businessDescription?: string;
  category: string;
  industry?: string;
  businessAge?: number;
  estimatedAge?: number;
  rating?: number;
  reviewCount?: number;
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  dataSource: string;
  leadScore: number;
  websiteQualityScore?: number;
  status: EngagementStatus;
  engagementStatus: EngagementStatus;
  tags: string[];
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type EngagementStatus = 
  | "Not Contacted"
  | "Proposal Sent"
  | "Opened"
  | "Replied"
  | "Follow-up Scheduled"
  | "Converted"
  | "Not Interested";

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