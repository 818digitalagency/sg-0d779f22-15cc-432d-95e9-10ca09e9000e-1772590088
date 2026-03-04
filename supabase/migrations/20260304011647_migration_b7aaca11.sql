-- Performance indexes are already created by migrations
-- This query just adds a few composite indexes for common query patterns

-- Composite index for leads filtering
CREATE INDEX IF NOT EXISTS idx_leads_user_status_score ON leads(user_id, status, lead_score DESC);

-- Composite index for campaigns analytics
CREATE INDEX IF NOT EXISTS idx_campaigns_user_status_sent ON campaigns(user_id, status, sent_at DESC);

-- Composite index for activity logs pagination
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON activity_logs(user_id, created_at DESC);

-- Composite index for export history
CREATE INDEX IF NOT EXISTS idx_export_history_user_status ON export_history(user_id, status, created_at DESC);

-- Update table statistics
ANALYZE leads;
ANALYZE campaigns;
ANALYZE emails;
ANALYZE activity_logs;
ANALYZE export_history;
ANALYZE user_settings;
ANALYZE proposals;
ANALYZE profiles;