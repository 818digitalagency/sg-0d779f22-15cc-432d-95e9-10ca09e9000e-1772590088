-- Seed Database with Sample Data
-- Run this in Supabase SQL Editor to populate your database with test data

-- ====================
...
SELECT pg_sleep(1);
SELECT 'Database seeded successfully!' as status;
SELECT 'Total records created:' as info, COUNT(*) as count FROM leads;