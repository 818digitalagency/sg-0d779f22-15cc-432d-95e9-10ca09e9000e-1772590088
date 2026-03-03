-- Add subject column to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS subject TEXT;