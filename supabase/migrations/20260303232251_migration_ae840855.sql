-- Create export_history table
CREATE TABLE IF NOT EXISTS export_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('csv', 'excel', 'pdf')),
  record_count INTEGER NOT NULL,
  file_size BIGINT,
  file_url TEXT,
  filters JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_status ON export_history(status);
CREATE INDEX IF NOT EXISTS idx_export_history_created_at ON export_history(created_at);

-- Enable RLS
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own export history" ON export_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own export history" ON export_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own export history" ON export_history FOR UPDATE USING (auth.uid() = user_id);