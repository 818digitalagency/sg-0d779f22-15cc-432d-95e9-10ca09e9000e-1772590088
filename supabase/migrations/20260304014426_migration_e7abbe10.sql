-- Add message_id to emails table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'emails' AND column_name = 'message_id') THEN
    ALTER TABLE emails ADD COLUMN message_id TEXT;
    CREATE INDEX idx_emails_message_id ON emails(message_id);
  END IF;
  
  -- Add provider column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'emails' AND column_name = 'provider') THEN
    ALTER TABLE emails ADD COLUMN provider TEXT NOT NULL DEFAULT 'sendgrid';
  END IF;
END $$;

-- Create email_events table
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  email_id TEXT, -- Can store message_id or tracking_id
  email_table_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- open, click, bounce, spam_report
  url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for email_events
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Policies for email_events
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_events' AND policyname = 'Users can view their own email events') THEN
    CREATE POLICY "Users can view their own email events" ON email_events FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_events' AND policyname = 'Users can insert their own email events') THEN
    CREATE POLICY "Users can insert their own email events" ON email_events FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add indexes for email_events
CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON email_events(email_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email_table_id ON email_events(email_table_id);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at);