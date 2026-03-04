-- Real-Time Testing Script
-- Use these queries to test live data updates in the UI

-- ========================================
-- TEST 1: Lead Real-Time Updates
-- ========================================

-- Create a new lead (should appear instantly in UI)
INSERT INTO leads (
  user_id,
  business_name,
  email,
  phone,
  website,
  address,
  city,
  province,
  postal_code,
  category,
  business_age,
  google_rating,
  google_reviews,
  website_quality_score,
  lead_score,
  status,
  tags
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Real-Time Company',
  'realtime@test.com',
  '506-555-9999',
  'https://realtimetest.com',
  '999 Test Street',
  'Moncton',
  'New Brunswick',
  'E1C 0A1',
  'IT & Technology',
  2,
  4.8,
  156,
  85,
  92,
  'Not Contacted',
  ARRAY['real-time', 'test', 'tech']
);

-- Update lead status (should update instantly in UI)
UPDATE leads 
SET status = 'Contacted',
    last_contact_date = NOW()
WHERE business_name = 'Test Real-Time Company';

-- Update lead score (should update instantly in UI)
UPDATE leads 
SET lead_score = 95,
    website_quality_score = 90
WHERE business_name = 'Test Real-Time Company';

-- Delete test lead (should disappear instantly from UI)
DELETE FROM leads WHERE business_name = 'Test Real-Time Company';

-- ========================================
-- TEST 2: Campaign Real-Time Metrics
-- ========================================

-- Create a new campaign (should appear instantly in UI)
INSERT INTO campaigns (
  user_id,
  name,
  subject,
  description,
  status,
  recipients,
  sent_count,
  opened_count,
  clicked_count,
  replied_count,
  conversion_rate
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Real-Time Test Campaign',
  'Testing Live Updates',
  'This campaign tests real-time metric updates',
  'active',
  100,
  0,
  0,
  0,
  0,
  0.00
);

-- Simulate email being sent (metrics should update instantly)
UPDATE campaigns 
SET sent_count = 50,
    total_recipients = 100
WHERE name = 'Real-Time Test Campaign';

-- Simulate email opens (metrics should update instantly)
UPDATE campaigns 
SET opened_count = 25,
    conversion_rate = (25.0 / 50.0 * 100)
WHERE name = 'Real-Time Test Campaign';

-- Simulate clicks (metrics should update instantly)
UPDATE campaigns 
SET clicked_count = 12,
    conversion_rate = (12.0 / 50.0 * 100)
WHERE name = 'Real-Time Test Campaign';

-- Simulate replies (metrics should update instantly)
UPDATE campaigns 
SET replied_count = 5,
    conversion_rate = (5.0 / 50.0 * 100)
WHERE name = 'Real-Time Test Campaign';

-- Complete campaign (status should update instantly)
UPDATE campaigns 
SET status = 'completed',
    sent_at = NOW(),
    sent_count = 100,
    opened_count = 67,
    clicked_count = 34,
    replied_count = 12,
    conversion_rate = 12.00
WHERE name = 'Real-Time Test Campaign';

-- Delete test campaign
DELETE FROM campaigns WHERE name = 'Real-Time Test Campaign';

-- ========================================
-- TEST 3: Activity Logs Real-Time
-- ========================================

-- Create activity log (should appear instantly in profile)
INSERT INTO activity_logs (
  user_id,
  action,
  entity_type,
  entity_id,
  metadata
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'lead_created',
  'lead',
  '12345',
  jsonb_build_object(
    'business_name', 'Real-Time Test',
    'category', 'Technology'
  )
);

-- ========================================
-- TEST 4: Notifications Real-Time
-- ========================================

-- Create notification (should appear instantly in header)
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  read
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'success',
  'Real-Time Test',
  'This notification should appear instantly!',
  false
);

-- Mark notification as read (should update badge count instantly)
UPDATE notifications 
SET read = true 
WHERE title = 'Real-Time Test';

-- ========================================
-- TEST 5: Multi-Tab Sync Test
-- ========================================

-- Open dashboard in multiple tabs, then run:
UPDATE leads 
SET status = 'Qualified',
    lead_score = lead_score + 5
WHERE id = (SELECT id FROM leads ORDER BY created_at DESC LIMIT 1);
-- All tabs should update simultaneously

-- ========================================
-- TEST 6: Stress Test (Bulk Updates)
-- ========================================

-- Update multiple leads at once
UPDATE leads 
SET lead_score = lead_score + 1
WHERE category = 'IT & Technology';
-- All matching leads should update in real-time

-- ========================================
-- TEST 7: Connection Resilience
-- ========================================

-- 1. Disconnect internet while on dashboard
-- 2. Run these queries in Supabase SQL Editor
-- 3. Reconnect internet
-- 4. Changes should sync automatically

INSERT INTO leads (
  user_id,
  business_name,
  email,
  city,
  province,
  category,
  status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Offline Sync Test',
  'offline@test.com',
  'Fredericton',
  'New Brunswick',
  'Professional Services',
  'Not Contacted'
);

-- ========================================
-- CLEANUP: Remove All Test Data
-- ========================================

DELETE FROM leads WHERE business_name LIKE '%Test%' OR business_name LIKE '%Real-Time%';
DELETE FROM campaigns WHERE name LIKE '%Test%' OR name LIKE '%Real-Time%';
DELETE FROM activity_logs WHERE metadata->>'business_name' LIKE '%Test%';
DELETE FROM notifications WHERE title LIKE '%Test%';

-- ========================================
-- MONITORING QUERIES
-- ========================================

-- Check current real-time subscriptions
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT
  schemaname,
  tablename,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;