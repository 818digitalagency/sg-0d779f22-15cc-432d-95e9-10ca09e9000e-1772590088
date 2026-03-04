# 🧪 Comprehensive Testing Guide

## 📧 **EMAIL CAMPAIGNS TESTING**

### **Prerequisites**
1. SendGrid or AWS SES account configured
2. API keys added to `.env.local`
3. Sender email verified

### **Test 1: Email Service Configuration**

**Step 1: Verify Configuration**
```bash
# Check environment variables are set
echo $NEXT_PUBLIC_SENDGRID_API_KEY
echo $NEXT_PUBLIC_FROM_EMAIL
echo $NEXT_PUBLIC_FROM_NAME
```

**Step 2: Test Email Service**
1. Navigate to `/dashboard/settings/email`
2. Enter your email address
3. Click "Send Test"
4. Expected: Success message + email received

**Troubleshooting:**
- ❌ "Email service not configured" → Check API keys
- ❌ "401 Unauthorized" → Regenerate SendGrid API key
- ❌ Email not received → Check spam folder, verify sender

---

### **Test 2: Campaign Creation**

**Step 1: Create Test Campaign**
1. Navigate to `/dashboard/campaigns`
2. Click "New Campaign"
3. Fill in details:
   - Name: "Test Campaign"
   - Subject: "Hello {{BusinessName}}"
   - Template: Include variables `{{ContactName}}`, `{{City}}`
4. Save campaign

**Step 2: Select Leads**
1. Navigate to `/dashboard/leads`
2. Select 5-10 test leads
3. Ensure leads have valid email addresses

**Step 3: Send Campaign**
1. Return to `/dashboard/campaigns`
2. Find your test campaign
3. Click "Send Campaign"
4. Confirm send
5. Expected: Success notification

**Verification:**
```sql
-- Check emails table
SELECT 
  to_email,
  subject,
  status,
  sent_at
FROM emails
WHERE campaign_id = 'your_campaign_id'
ORDER BY sent_at DESC;
```

---

### **Test 3: Email Tracking**

**Step 1: Send Test Email**
1. Send campaign (from Test 2)
2. Check inbox for received email

**Step 2: Track Open**
1. Open the email
2. Wait 5 seconds
3. Check dashboard: Open count should increase

**Step 3: Track Click**
1. Click any link in the email
2. Check dashboard: Click count should increase

**Verification:**
```sql
-- Check email events
SELECT 
  event_type,
  COUNT(*) as event_count
FROM email_events
WHERE email_table_id IN (
  SELECT id FROM emails WHERE campaign_id = 'your_campaign_id'
)
GROUP BY event_type;
```

**Expected Results:**
- `sent` events: Same as number of emails sent
- `opened` events: Increases when emails are opened
- `clicked` events: Increases when links are clicked

---

### **Test 4: Campaign Performance**

**Metrics to Verify:**
- ✅ Total Sent: Matches number of leads
- ✅ Open Rate: Updates in real-time
- ✅ Click Rate: Updates in real-time
- ✅ Reply Rate: Updates when replies detected

**Real-Time Update Test:**
```sql
-- Simulate email open
INSERT INTO email_events (
  email_table_id,
  event_type,
  created_at
) VALUES (
  (SELECT id FROM emails LIMIT 1),
  'opened',
  NOW()
);

-- Dashboard should update instantly!
```

---

## 🗺️ **GOOGLE MAPS TESTING**

### **Prerequisites**
1. Google Cloud project created
2. Maps JavaScript API enabled
3. Places API enabled
4. API key added to `.env.local`
5. API key restrictions configured

### **Test 1: Map Loading**

**Step 1: Navigate to Map**
1. Go to `/dashboard/map`
2. Expected: Map loads within 3 seconds
3. Expected: New Brunswick centered

**Troubleshooting:**
- ⚠️ "Google Maps API key not configured" → Add to `.env.local`
- ⚠️ "RefererNotAllowedMapError" → Check API restrictions
- ⚠️ "ApiNotActivatedMapError" → Enable Maps JavaScript API

**Step 2: Verify Map Controls**
1. Pan the map (drag)
2. Zoom in/out (scroll or +/- buttons)
3. Expected: Smooth interactions

---

### **Test 2: Lead Markers**

**Step 1: Verify Markers Load**
1. Map should show markers for all leads
2. Markers should be clustered in cities
3. Expected: Color-coded by lead score

**Step 2: Click Marker**
1. Click any marker
2. Expected: Info window opens
3. Expected: Shows business details
4. Expected: Includes rating, score, contact info

**Step 3: Filter Markers**
1. Use industry filter → Markers update
2. Use city filter → Markers update
3. Use score filter → Markers update
4. Expected: Real-time filtering

---

### **Test 3: Real-Time Map Updates**

**Step 1: Add New Lead**
```sql
INSERT INTO leads (
  user_id,
  business_name,
  city,
  industry,
  lead_score,
  status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Map Test Company',
  'Moncton',
  'IT & Technology',
  88,
  'new'
);
```

**Expected:** New marker appears on map instantly!

**Step 2: Update Lead Location**
```sql
UPDATE leads 
SET city = 'Fredericton'
WHERE business_name = 'Map Test Company';
```

**Expected:** Marker moves to new location!

**Step 3: Delete Lead**
```sql
DELETE FROM leads 
WHERE business_name = 'Map Test Company';
```

**Expected:** Marker disappears!

---

### **Test 4: Map Performance**

**Load Test:**
1. Insert 1000 test leads
2. Navigate to map
3. Expected: Loads in < 5 seconds
4. Expected: Smooth panning/zooming
5. Expected: Markers cluster properly

**Memory Test:**
1. Leave map open for 5 minutes
2. Check browser memory usage
3. Expected: No memory leaks
4. Expected: Stable performance

---

## 📊 **ANALYTICS DASHBOARD TESTING**

### **Test 1: Data Loading**

**Step 1: Navigate to Analytics**
1. Go to `/dashboard/analytics`
2. Expected: Data loads within 2 seconds
3. Expected: All charts render correctly

**Step 2: Verify Metrics**
1. **Total Leads**: Should match lead count
2. **Conversion Rate**: Should be calculated correctly
3. **Emails Sent**: Should match campaign totals
4. **Open Rate**: Should reflect actual opens

**Verification:**
```sql
-- Verify total leads
SELECT COUNT(*) as total_leads FROM leads;

-- Verify conversion rate
SELECT 
  COUNT(*) FILTER (WHERE status = 'won') * 100.0 / COUNT(*) as conversion_rate
FROM leads;

-- Verify email stats
SELECT 
  SUM(sent_count) as total_sent,
  SUM(opened_count) as total_opened,
  SUM(opened_count) * 100.0 / NULLIF(SUM(sent_count), 0) as open_rate
FROM campaigns;
```

---

### **Test 2: Real-Time Updates**

**Step 1: Create Test Lead**
```sql
INSERT INTO leads (
  user_id,
  business_name,
  city,
  industry,
  lead_score,
  status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Analytics Test Lead',
  'Moncton',
  'IT & Technology',
  88,
  'new'
);
```

**Expected:** 
- Total Leads count increases
- Charts update automatically
- No page refresh needed

**Step 2: Update Lead Status**
```sql
UPDATE leads 
SET status = 'won'
WHERE business_name = 'Analytics Test Lead';
```

**Expected:**
- Conversion Rate increases
- Status distribution pie chart updates
- Lead funnel updates

---

### **Test 3: Chart Interactions**

**Bar Charts:**
1. Hover over bars → Tooltip appears
2. Expected: Shows exact values
3. Expected: Clean formatting

**Pie Charts:**
1. Hover over segments → Tooltip shows percentage
2. Expected: Legend updates
3. Expected: Colors are distinct

**Line Charts:**
1. Hover over points → Shows value
2. Expected: Smooth animations
3. Expected: Grid lines visible

---

### **Test 4: Date Range Filters**

**Test Different Ranges:**
1. Select "7 Days" → Charts update
2. Select "30 Days" → Charts update
3. Select "90 Days" → Charts update

**Verification:**
- Data filters correctly
- No errors in console
- Charts render smoothly

---

## 🔄 **REAL-TIME INTEGRATION TESTING**

### **Multi-Tab Test**

**Setup:**
1. Open Tab 1: `/dashboard/leads`
2. Open Tab 2: `/dashboard/analytics`
3. Open Tab 3: Supabase SQL Editor

**Test Scenario:**
```sql
-- In Tab 3 (SQL Editor), run:
INSERT INTO leads (
  user_id,
  business_name,
  city,
  industry,
  lead_score,
  status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Multi-Tab Test',
  'Moncton',
  'IT & Technology',
  88,
  'new'
);
```

**Expected Results:**
- ✅ Tab 1 (Leads): New lead appears in table
- ✅ Tab 2 (Analytics): Total leads count increases
- ✅ Both tabs: Update within 1 second
- ✅ No page refresh needed

---

### **Connection Recovery Test**

**Test Network Interruption:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Wait 5 seconds
4. Set throttling back to "Online"

**Expected:**
- ⚠️ Warning: "Connection lost" appears
- ✅ Automatic reconnection within 3 seconds
- ✅ Success: "Reconnected" message
- ✅ Data syncs automatically

---

## 🎯 **PERFORMANCE TESTING**

### **Load Test: 10,000 Leads**

**Setup:**
```sql
-- Generate 10,000 test leads
INSERT INTO leads (
  user_id,
  business_name,
  city,
  industry,
  lead_score,
  status
)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Test Company ' || generate_series,
  (ARRAY['Moncton', 'Fredericton', 'Saint John'])[floor(random() * 3 + 1)],
  (ARRAY['IT & Technology', 'Real Estate', 'Manufacturing'])[floor(random() * 3 + 1)],
  floor(random() * 100),
  'new'
FROM generate_series(1, 10000);
```

**Performance Targets:**
- ✅ Leads page: Load in < 3 seconds
- ✅ Map page: Load in < 5 seconds
- ✅ Analytics: Load in < 2 seconds
- ✅ Search: Results in < 500ms
- ✅ Filter: Apply in < 300ms

---

## ✅ **TEST RESULTS CHECKLIST**

### **Email Integration**
- [ ] SendGrid API key configured
- [ ] Test email sent successfully
- [ ] Campaign created and sent
- [ ] Open tracking working
- [ ] Click tracking working
- [ ] Real-time metrics updating

### **Google Maps**
- [ ] Map loads correctly
- [ ] Markers appear for all leads
- [ ] Info windows show details
- [ ] Filters update markers
- [ ] Real-time updates working
- [ ] Performance acceptable

### **Analytics Dashboard**
- [ ] All metrics loading
- [ ] Charts rendering correctly
- [ ] Real-time updates working
- [ ] Date filters working
- [ ] Data accuracy verified

### **Real-Time Features**
- [ ] Multi-tab sync working
- [ ] Connection recovery working
- [ ] Update latency < 1 second
- [ ] No memory leaks
- [ ] Error handling robust

---

## 🐛 **COMMON ISSUES & SOLUTIONS**

### **Email Not Sending**
```bash
# Check 1: Verify API key
echo $NEXT_PUBLIC_SENDGRID_API_KEY

# Check 2: Test connectivity
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer $NEXT_PUBLIC_SENDGRID_API_KEY" \
  -H "Content-Type: application/json"

# Check 3: Verify sender
# Go to SendGrid dashboard → Sender Authentication
```

### **Map Not Loading**
```javascript
// Check 1: API key present
console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

// Check 2: Check browser console for errors
// Common errors:
// - RefererNotAllowedMapError → Fix domain restrictions
// - ApiNotActivatedMapError → Enable APIs in Google Cloud Console
// - InvalidKeyMapError → Check API key is correct
```

### **Real-Time Not Working**
```sql
-- Check 1: Verify real-time is enabled in Supabase
SELECT * FROM pg_stat_replication;

-- Check 2: Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Check 3: Test with simple insert
INSERT INTO leads (user_id, business_name, city, industry, lead_score, status)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'Test', 'Moncton', 'IT & Technology', 88, 'new');
```

---

## 🎊 **SUCCESS CRITERIA**

Your implementation is production-ready when:

- ✅ All tests pass
- ✅ No console errors
- ✅ Performance targets met
- ✅ Real-time updates < 1s
- ✅ Error recovery working
- ✅ UI responsive and smooth
- ✅ Data accuracy verified
- ✅ Documentation complete

---

**🚀 Ready to launch! All systems operational!**

*For deployment instructions, see `PRODUCTION_READY.md`*