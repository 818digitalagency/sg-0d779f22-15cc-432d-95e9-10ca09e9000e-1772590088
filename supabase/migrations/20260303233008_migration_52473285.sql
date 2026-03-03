-- Add missing columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website_quality_score INTEGER;

-- Add missing columns to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS conversion_rate NUMERIC DEFAULT 0;

-- Add missing columns to user_settings table
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS activity_alerts BOOLEAN DEFAULT true;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS weekly_digest BOOLEAN DEFAULT true;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS default_export_format TEXT DEFAULT 'csv';

-- Add check constraint for default_export_format
ALTER TABLE user_settings ADD CONSTRAINT user_settings_default_export_format_check 
  CHECK (default_export_format IN ('csv', 'excel', 'pdf'));