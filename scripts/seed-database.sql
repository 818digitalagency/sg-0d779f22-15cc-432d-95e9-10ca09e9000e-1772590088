-- Seed Data for Opportunity Finder
-- Run this script to populate the database with sample data

-- Clear existing data (careful in production!)
TRUNCATE TABLE leads, campaigns, emails, proposals, activity_logs, user_settings, export_history CASCADE;

-- Sample Leads for New Brunswick
INSERT INTO leads (
  user_id,
  business_name,
  contact_name,
  email,
  phone,
  website,
  address,
  city,
  province,
  postal_code,
  business_description,
  business_age,
  industry,
  rating,
  review_count,
  lead_score,
  website_quality_score,
  social_media,
  status,
  tags
) VALUES
-- Moncton
(
  (SELECT id FROM auth.users LIMIT 1),
  'Maritime Tech Solutions',
  'Sarah Johnson',
  'sarah@maritimetech.ca',
  '506-555-0123',
  'https://maritimetech.ca',
  '123 Main Street',
  'Moncton',
  'NB',
  'E1C 1A1',
  'Leading IT consulting firm specializing in cloud solutions and cybersecurity',
  5,
  'Technology',
  4.8,
  127,
  92,
  88,
  '{"linkedin": "https://linkedin.com/company/maritimetech", "twitter": "@maritimetech"}',
  'Not Contacted',
  ARRAY['High Priority', 'Tech']
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Atlantic Accounting Services',
  'Michael Chen',
  'michael@atlanticaccounting.ca',
  '506-555-0234',
  'https://atlanticaccounting.ca',
  '456 Queen Street',
  'Moncton',
  'NB',
  'E1C 2B2',
  'Full-service accounting firm serving SMBs across Atlantic Canada',
  12,
  'Accounting',
  4.6,
  89,
  85,
  75,
  '{"linkedin": "https://linkedin.com/company/atlanticaccounting"}',
  'Not Contacted',
  ARRAY['Professional Services']
),
-- Saint John
(
  (SELECT id FROM auth.users LIMIT 1),
  'Bay of Fundy Realty',
  'Jennifer Smith',
  'jennifer@bayfundyrealty.ca',
  '506-555-0345',
  'https://bayfundyrealty.ca',
  '789 King Street',
  'Saint John',
  'NB',
  'E2L 3C3',
  'Premier real estate agency specializing in waterfront properties',
  8,
  'Real Estate',
  4.9,
  203,
  95,
  92,
  '{"facebook": "https://facebook.com/bayfundyrealty", "instagram": "@bayfundyrealty"}',
  'Contacted',
  ARRAY['High Priority', 'Real Estate']
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Port City Legal',
  'David Thompson',
  'david@portcitylegal.ca',
  '506-555-0456',
  'https://portcitylegal.ca',
  '321 Charlotte Street',
  'Saint John',
  'NB',
  'E2L 4D4',
  'Corporate law firm with expertise in maritime and international trade law',
  15,
  'Legal Services',
  4.7,
  156,
  88,
  85,
  '{"linkedin": "https://linkedin.com/company/portcitylegal"}',
  'Responded',
  ARRAY['Professional Services', 'Legal']
),
-- Fredericton
(
  (SELECT id FROM auth.users LIMIT 1),
  'Capital Construction Group',
  'Robert Martin',
  'robert@capitalconstruction.ca',
  '506-555-0567',
  'https://capitalconstruction.ca',
  '555 York Street',
  'Fredericton',
  'NB',
  'E3B 5E5',
  'Commercial and residential construction with 20+ years of excellence',
  20,
  'Construction',
  4.5,
  178,
  82,
  70,
  '{"facebook": "https://facebook.com/capitalconstruction"}',
  'Qualified',
  ARRAY['Construction']
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'River Valley Medical Clinic',
  'Dr. Emily Wilson',
  'contact@rivervalleymedical.ca',
  '506-555-0678',
  'https://rivervalleymedical.ca',
  '777 Regent Street',
  'Fredericton',
  'NB',
  'E3B 6F6',
  'Modern family medical practice with walk-in and appointment services',
  6,
  'Healthcare',
  4.8,
  294,
  90,
  82,
  '{"facebook": "https://facebook.com/rivervalleymedical"}',
  'Not Contacted',
  ARRAY['Healthcare', 'High Priority']
),
-- Dieppe
(
  (SELECT id FROM auth.users LIMIT 1),
  'Acadian Manufacturing',
  'Pierre Leblanc',
  'pierre@acadianmfg.ca',
  '506-555-0789',
  'https://acadianmfg.ca',
  '888 Paul Street',
  'Dieppe',
  'NB',
  'E1A 7G7',
  'Precision manufacturing and industrial supplies for Atlantic Canada',
  10,
  'Manufacturing',
  4.4,
  67,
  78,
  65,
  '{"linkedin": "https://linkedin.com/company/acadianmfg"}',
  'Not Contacted',
  ARRAY['Manufacturing']
),
-- Bathurst
(
  (SELECT id FROM auth.users LIMIT 1),
  'Northern Lights Restaurant Group',
  'Marie Cormier',
  'marie@northernlightsrest.ca',
  '506-555-0890',
  'https://northernlightsrest.ca',
  '999 Main Street',
  'Bathurst',
  'NB',
  'E2A 8H8',
  'Family-owned restaurant group operating three successful locations',
  18,
  'Food & Beverage',
  4.6,
  412,
  86,
  78,
  '{"facebook": "https://facebook.com/northernlightsrest", "instagram": "@northernlightsrest"}',
  'Contacted',
  ARRAY['Food & Beverage', 'Hospitality']
),
-- Miramichi
(
  (SELECT id FROM auth.users LIMIT 1),
  'Miramichi Auto Care',
  'John MacDonald',
  'john@miramichiautoca re.ca',
  '506-555-0901',
  'https://miramichiautocare.ca',
  '111 Water Street',
  'Miramichi',
  'NB',
  'E1V 9I9',
  'Full-service automotive repair and maintenance center',
  14,
  'Automotive',
  4.7,
  234,
  84,
  72,
  '{"facebook": "https://facebook.com/miramichiautocare"}',
  'Not Contacted',
  ARRAY['Automotive']
),
-- Edmundston
(
  (SELECT id FROM auth.users LIMIT 1),
  'Trans-Border Logistics',
  'François Bouchard',
  'francois@transborderlog.ca',
  '506-555-1012',
  'https://transborderlog.ca',
  '222 Victoria Street',
  'Edmundston',
  'NB',
  'E3V 0J0',
  'International freight and logistics services specializing in US-Canada trade',
  9,
  'Transportation & Logistics',
  4.5,
  89,
  80,
  76,
  '{"linkedin": "https://linkedin.com/company/transborderlog"}',
  'Not Contacted',
  ARRAY['Logistics', 'International']
);

-- Sample Campaigns
INSERT INTO campaigns (
  user_id,
  name,
  subject,
  description,
  status,
  scheduled_at,
  total_recipients,
  emails_sent,
  emails_opened,
  emails_clicked,
  emails_replied,
  conversion_rate
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Spring 2026 Tech Outreach',
  'Transform Your Business with Cloud Solutions',
  'Target technology companies for cloud migration services',
  'active',
  '2026-03-01 09:00:00',
  150,
  150,
  89,
  34,
  12,
  8.0
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Professional Services Q2',
  'Elevate Your Professional Practice',
  'Reach out to accounting and legal firms',
  'active',
  '2026-04-01 09:00:00',
  75,
  75,
  52,
  19,
  7,
  9.3
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Healthcare Digital Transformation',
  'Modern Patient Management Solutions',
  'Healthcare providers digital upgrade campaign',
  'scheduled',
  '2026-05-01 09:00:00',
  50,
  0,
  0,
  0,
  0,
  0.0
);

-- Sample User Settings
INSERT INTO user_settings (
  user_id,
  email_notifications,
  marketing_emails,
  activity_alerts,
  weekly_digest,
  theme,
  timezone,
  language,
  default_export_format
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  true,
  false,
  true,
  true,
  'light',
  'America/Moncton',
  'en',
  'csv'
)
ON CONFLICT (user_id) DO UPDATE SET
  email_notifications = EXCLUDED.email_notifications,
  marketing_emails = EXCLUDED.marketing_emails,
  activity_alerts = EXCLUDED.activity_alerts,
  weekly_digest = EXCLUDED.weekly_digest,
  theme = EXCLUDED.theme,
  timezone = EXCLUDED.timezone,
  language = EXCLUDED.language,
  default_export_format = EXCLUDED.default_export_format;

-- Sample Activity Logs
INSERT INTO activity_logs (
  user_id,
  action,
  resource,
  resource_id,
  details
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'created',
  'lead',
  (SELECT id FROM leads WHERE business_name = 'Maritime Tech Solutions'),
  'Added new lead: Maritime Tech Solutions'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'created',
  'campaign',
  (SELECT id FROM campaigns WHERE name = 'Spring 2026 Tech Outreach'),
  'Created campaign: Spring 2026 Tech Outreach'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'sent',
  'email',
  NULL,
  'Sent 150 emails for Spring 2026 Tech Outreach campaign'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'exported',
  'leads',
  NULL,
  'Exported 150 leads to CSV'
);

-- Verify data
SELECT 'Leads created: ' || COUNT(*) FROM leads;
SELECT 'Campaigns created: ' || COUNT(*) FROM campaigns;
SELECT 'User settings created: ' || COUNT(*) FROM user_settings;
SELECT 'Activity logs created: ' || COUNT(*) FROM activity_logs;