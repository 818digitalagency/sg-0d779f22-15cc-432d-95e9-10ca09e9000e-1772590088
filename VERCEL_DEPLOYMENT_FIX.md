# 🚀 Vercel Deployment Fix Guide

## ❌ **Error: Environment Variable References Missing Secret**

If you see this error:
```
Error: Environment Variable "NEXT_PUBLIC_APP_URL" references Secret "app_url", which does not exist.
```

This happens when Vercel configuration references secrets that haven't been created.

---

## ✅ **SOLUTION: Manual Environment Variable Setup**

### **Step 1: Remove Secret References**

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. **Delete any variables** that reference secrets (like `@app_url`)

---

### **Step 2: Add Environment Variables Correctly**

Add these environment variables **WITHOUT** the `@` prefix:

#### **Required Variables:**

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...your_key` | From Supabase dashboard |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXT_PUBLIC_APP_NAME` | `Opportunity Finder` | Your app name |

#### **Optional Variables (Email):**

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SENDGRID_API_KEY` | `SG.your_key` | SendGrid API key |
| `NEXT_PUBLIC_FROM_EMAIL` | `noreply@yourdomain.com` | Sender email |
| `NEXT_PUBLIC_FROM_NAME` | `Your Company` | Sender name |

#### **Optional Variables (Maps):**

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIza...your_key` | Google Maps API key |

---

### **Step 3: Set Environment Scope**

For each environment variable, select:
- ✅ **Production** (for production deployments)
- ✅ **Preview** (for preview deployments)
- ✅ **Development** (for local development)

Or just select **All** environments for simplicity.

---

### **Step 4: Redeploy**

After adding all environment variables:

```bash
# Option 1: Redeploy via CLI
vercel --prod

# Option 2: Trigger redeploy from Vercel dashboard
# Go to Deployments tab → Click "Redeploy" on latest deployment
```

---

## 🔧 **Alternative: Use Vercel CLI to Add Variables**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables (replace with your actual values)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_APP_URL production
# Enter your Vercel URL (e.g., https://your-app.vercel.app)

vercel env add NEXT_PUBLIC_APP_NAME production
# Enter "Opportunity Finder"

# Deploy
vercel --prod
```

---

## 📋 **Quick Setup Checklist**

### **Before Deploying:**

- [ ] Supabase project created
- [ ] Supabase URL and Anon Key copied
- [ ] Environment variables added to Vercel dashboard
- [ ] No `@secret` references in variables
- [ ] All required variables present

### **Required Environment Variables:**

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_APP_NAME`

### **Optional (but recommended):**

- [ ] `NEXT_PUBLIC_SENDGRID_API_KEY` (for email campaigns)
- [ ] `NEXT_PUBLIC_FROM_EMAIL` (sender email)
- [ ] `NEXT_PUBLIC_FROM_NAME` (sender name)
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for map view)

---

## 🎯 **Finding Your Values**

### **Supabase URL and Anon Key:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Vercel App URL:**

1. After first deployment, Vercel provides a URL like:
   - `https://your-app-name.vercel.app`
2. Use this as `NEXT_PUBLIC_APP_URL`
3. Or use your custom domain if configured

### **SendGrid API Key:**

1. Go to https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key**
3. Name: "Opportunity Finder"
4. Permissions: **Full Access** (or at least **Mail Send**)
5. Copy the key → `NEXT_PUBLIC_SENDGRID_API_KEY`

### **Google Maps API Key:**

1. Go to https://console.cloud.google.com/
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your API key
5. Copy the key → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 🔄 **Step-by-Step Deployment Process**

### **1. Initial Setup (First Time Only)**

```bash
# Clone or navigate to your project
cd opportunity-finder

# Install dependencies
npm install

# Build locally to verify
npm run build

# Login to Vercel
vercel login
```

### **2. Add Environment Variables**

**Via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add each variable (see table above)
4. Click **Save**

**Or via Vercel CLI:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste value when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Enter your Vercel URL

vercel env add NEXT_PUBLIC_APP_NAME
# Enter "Opportunity Finder"
```

### **3. Deploy**

```bash
# Deploy to production
vercel --prod

# Or using the alias
vercel --yes --prod
```

### **4. Verify Deployment**

1. Visit your Vercel URL
2. Check console for errors (F12 → Console)
3. Test login/registration
4. Verify Supabase connection
5. Test all features

---

## 🐛 **Common Deployment Issues**

### **Issue 1: "Build failed"**

**Solution:**
```bash
# Test build locally first
npm run build

# If it works locally, check Vercel build logs
# Usually caused by:
# - Missing environment variables
# - TypeScript errors
# - Import errors
```

### **Issue 2: "Supabase connection failed"**

**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active
- Verify RLS policies allow access

### **Issue 3: "Module not found"**

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### **Issue 4: "Environment variables not loading"**

**Solution:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Verify environment scope is set correctly

---

## ✅ **Verification Steps**

After successful deployment:

### **1. Test Basic Functionality:**
- [ ] Homepage loads
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard loads
- [ ] No console errors

### **2. Test Database Connection:**
- [ ] Can view leads
- [ ] Can create new lead
- [ ] Real-time updates work
- [ ] Data persists after page refresh

### **3. Test Optional Features:**
- [ ] Email test works (if configured)
- [ ] Map loads (if configured)
- [ ] Analytics display correctly
- [ ] Export functionality works

---

## 📞 **Still Having Issues?**

### **Check Build Logs:**
1. Go to Vercel Dashboard
2. Select your deployment
3. Click on **Building** or **Failed** status
4. Review detailed logs
5. Look for specific error messages

### **Common Error Patterns:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `References Secret "xxx"` | Secret doesn't exist | Remove `@` prefix from variable value |
| `Module not found` | Missing dependency | Run `npm install` and redeploy |
| `Build failed` | TypeScript/ESLint errors | Run `npm run build` locally to identify |
| `ECONNREFUSED` | Can't connect to Supabase | Check Supabase URL and key |

### **Get Help:**
- Review error in Vercel build logs
- Check browser console (F12) for client-side errors
- Verify all environment variables are set
- Try local build: `npm run build`

---

## 🎉 **Success!**

Once deployed successfully:

1. **Set Custom Domain** (optional):
   - Vercel Dashboard → Settings → Domains
   - Add your domain
   - Update DNS records as instructed
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

2. **Configure Supabase Redirect URLs**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to allowed redirect URLs
   - Format: `https://your-app.vercel.app/**`

3. **Test Everything**:
   - User registration/login
   - Real-time features
   - Email campaigns (if configured)
   - Map view (if configured)
   - Analytics dashboard

---

## 🚀 **Quick Deploy Commands**

```bash
# 1. Login to Vercel
vercel login

# 2. Add ALL required environment variables first
# (via dashboard or CLI as shown above)

# 3. Deploy
vercel --prod --yes

# 4. Done! Visit your Vercel URL
```

---

**✅ Your Opportunity Finder is now live on Vercel!**

**Next steps:**
- Configure custom domain (optional)
- Set up email service (optional)
- Enable Google Maps (optional)
- Start discovering opportunities! 🎯