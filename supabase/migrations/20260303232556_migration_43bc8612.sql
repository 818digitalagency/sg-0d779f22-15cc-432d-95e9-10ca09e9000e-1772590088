-- Add description to campaigns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS description TEXT;

-- Align activity_logs columns with service code
ALTER TABLE activity_logs RENAME COLUMN entity_type TO resource;
ALTER TABLE activity_logs RENAME COLUMN entity_id TO resource_id;
ALTER TABLE activity_logs RENAME COLUMN description TO details;