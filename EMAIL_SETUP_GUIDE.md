# 📧 Email Service Setup Guide

## Overview

Opportunity Finder supports two email service providers for sending campaigns:

1. **SendGrid** (Recommended) - Easy setup, generous free tier
2. **AWS SES** (Advanced) - Enterprise-grade, requires AWS account

---

## 🚀 SendGrid Setup (Recommended)

### **Step 1: Create SendGrid Account**

1. Visit [sendgrid.com](https://sendgrid.com) and sign up for a free account
2. Free tier includes: **100 emails/day** (3,000/month)
3. Verify your email address

### **Step 2: Generate API Key**

1. Log into SendGrid dashboard
2. Navigate to **Settings → API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Opportunity Finder")
5. Select **Full Access** permissions
6. Click **Create & View**
7. **COPY THE KEY IMMEDIATELY** (you won't see it again!)

### **Step 3: Verify Sender Identity**

1. Navigate to **Settings → Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - From Email: `noreply@yourdomain.com`
   - From Name: `Opportunity Finder`
   - Reply To: Your email
4. Check your email and click verification link

### **Step 4: Add to Environment Variables**

Add these to your `.env.local` file:

```bash
# SendGrid Configuration
NEXT_PUBLIC_SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_FROM_NAME=Opportunity Finder
```

### **Step 5: Restart Dev Server**

```bash
npm run dev
# or
pm2 restart all
```

### **Step 6: Test Configuration**

1. Visit `/dashboard/settings/email` in your app
2. Enter your email address
3. Click **Send Test**
4. Check your inbox (check spam folder too!)

---

## 🔧 AWS SES Setup (Advanced)

### **Prerequisites**

- AWS Account with billing enabled
- AWS CLI installed (optional)
- IAM user with SES permissions

### **Step 1: Request Production Access**

1. AWS SES starts in **Sandbox Mode** (limited to verified addresses)
2. To send to any email: Request production access in AWS console
3. Navigate to **Amazon SES → Account dashboard**
4. Click **Request production access**
5. Fill out the form (expect 24-48 hour review)

### **Step 2: Verify Domain or Email**

**Option A: Domain Verification (Recommended)**
1. Navigate to **Verified identities → Create identity**
2. Select **Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Copy DNS records and add to your DNS provider
5. Wait for verification (can take up to 72 hours)

**Option B: Email Verification (Quick Test)**
1. Navigate to **Verified identities → Create identity**
2. Select **Email address**
3. Enter email address
4. Check email and click verification link

### **Step 3: Create IAM User**

1. Navigate to **IAM → Users → Add users**
2. Username: `opportunity-finder-ses`
3. Attach policy: `AmazonSESFullAccess`
4. Create user
5. Generate access keys (save securely!)

### **Step 4: Configure Environment**

Add these to your `.env.local` file:

```bash
# AWS SES Configuration
NEXT_PUBLIC_AWS_SES_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
NEXT_PUBLIC_AWS_SES_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
NEXT_PUBLIC_AWS_SES_REGION=us-east-1
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_FROM_NAME=Opportunity Finder
```

### **Step 5: Restart and Test**

Same as SendGrid steps 5-6 above.

---

## 🎯 Email Best Practices

### **Deliverability**

1. **Use a custom domain** - Not gmail.com or yahoo.com
2. **Set up SPF record** - Prevents spoofing
3. **Set up DKIM** - SendGrid/SES provide this automatically
4. **Set up DMARC** - Optional but recommended
5. **Warm up your domain** - Start with small volumes, increase gradually

### **Content Guidelines**

1. **Avoid spam triggers**:
   - Don't use ALL CAPS IN SUBJECT
   - Avoid excessive exclamation marks!!!
   - Don't use words like "FREE", "GUARANTEED", "ACT NOW"
2. **Personalize emails** - Use `{{BusinessName}}`, `{{ContactName}}`
3. **Include unsubscribe link** - Required by CASL/CAN-SPAM
4. **Test before sending** - Use the test email feature

### **CASL Compliance (Canada)**

Since Opportunity Finder targets Canadian businesses, ensure:

1. ✅ **Obtain consent** before sending
2. ✅ **Identify yourself** clearly in emails
3. ✅ **Include contact information** in footer
4. ✅ **Provide unsubscribe mechanism** in every email
5. ✅ **Honor unsubscribe requests** within 10 business days

---

## 📊 Email Limits

### **SendGrid Free Tier**
- **Daily**: 100 emails
- **Monthly**: 3,000 emails
- **Rate**: Unlimited sends per hour

### **SendGrid Paid Plans**
- **Essentials**: $19.95/month - 50,000 emails
- **Pro**: $89.95/month - 100,000 emails
- **Scale**: Custom pricing

### **AWS SES Pricing**
- **Sending**: $0.10 per 1,000 emails
- **Receiving**: $0.10 per 1,000 emails
- **First 62,000 emails/month**: FREE (if sent from EC2)

---

## 🐛 Troubleshooting

### **"Email service not configured" error**

**Solution**: Check environment variables are set correctly
```bash
# Verify variables are loaded
echo $NEXT_PUBLIC_SENDGRID_API_KEY
```

### **"401 Unauthorized" from SendGrid**

**Possible causes**:
1. Invalid API key
2. API key deleted/revoked
3. API key permissions insufficient

**Solution**: Generate new API key with Full Access

### **Test email not received**

**Check these**:
1. Spam/junk folder
2. Email address typos
3. Sender identity verified in SendGrid/SES
4. Domain/email verified in AWS SES (if in sandbox mode)

### **High bounce rate**

**Solutions**:
1. Validate email addresses before sending
2. Remove invalid addresses from list
3. Use double opt-in for subscriptions
4. Monitor bounce notifications

---

## ✅ Quick Verification Checklist

Before sending campaigns, verify:

- [ ] API keys added to `.env.local`
- [ ] From email verified (SendGrid) or domain verified (AWS SES)
- [ ] Dev server restarted after adding keys
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Emails include unsubscribe link
- [ ] Sender identity matches company info
- [ ] CASL compliance footer included

---

## 📚 Additional Resources

- [SendGrid Documentation](https://docs.sendgrid.com)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [CASL Compliance Guide](https://crtc.gc.ca/eng/com500/faq500.htm)
- [Email Deliverability Best Practices](https://sendgrid.com/blog/email-deliverability-best-practices/)

---

**Need help?** Check the troubleshooting section or contact support.

**Ready to send?** Visit `/dashboard/campaigns` to create your first campaign! 🚀