# 🗺️ Google Maps Setup Guide

## Overview

Opportunity Finder includes an interactive map feature to visualize leads geographically across New Brunswick. This requires a Google Maps API key.

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Create Google Cloud Project**

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Project name: `Opportunity Finder`
4. Click **Create**

### **Step 2: Enable Required APIs**

1. Navigate to **APIs & Services → Library**
2. Search and enable these APIs:
   - ✅ **Maps JavaScript API** (required)
   - ✅ **Places API** (required)
   - ✅ **Geocoding API** (optional, for address lookup)

### **Step 3: Create API Key**

1. Navigate to **APIs & Services → Credentials**
2. Click **Create Credentials → API Key**
3. Copy the API key (starts with `AIza...`)
4. Click **Restrict Key** (important for security!)

### **Step 4: Restrict API Key (Security)**

**Application Restrictions:**
1. Select **HTTP referrers (web sites)**
2. Add these referrers:
   ```
   localhost:*/*
   *.vercel.app/*
   yourdomain.com/*
   ```

**API Restrictions:**
1. Select **Restrict key**
2. Enable only:
   - Maps JavaScript API
   - Places API
   - Geocoding API (if needed)

3. Click **Save**

### **Step 5: Add to Environment**

Add to your `.env.local` file:

```bash
# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **Step 6: Restart Dev Server**

```bash
npm run dev
# or
pm2 restart all
```

### **Step 7: Test the Map**

1. Visit `/dashboard/map` in your app
2. You should see an interactive map of New Brunswick
3. Lead markers should appear on the map
4. Click markers to see lead details

---

## 💰 Pricing

### **Free Tier (Monthly)**
- **Maps JavaScript API**: $200 free credit = ~28,000 map loads
- **Places API**: $200 free credit = ~17,000 requests
- **Geocoding API**: $200 free credit = ~40,000 requests

### **Paid Usage**
Only charged after free tier exhausted:
- **Maps loads**: $7 per 1,000 loads
- **Places requests**: $17 per 1,000 requests (AutoComplete)
- **Geocoding**: $5 per 1,000 requests

### **Cost Optimization Tips**
1. Enable billing alerts at $50, $100, $150
2. Use map clustering to reduce API calls
3. Cache geocoding results in database
4. Implement request throttling
5. Use Static Maps API for thumbnails (cheaper)

---

## 🎨 Map Features

### **Available in Opportunity Finder**

✅ **Interactive pan and zoom**  
✅ **Lead markers** color-coded by score  
✅ **Info windows** with business details  
✅ **Clustering** for better performance  
✅ **Filtering** by city, industry, status  
✅ **Custom map styles**  
✅ **Geocoding** for address lookup  
✅ **Places search** for nearby businesses  

### **Marker Colors**

- 🟢 **Green**: High score (80-100)
- 🔵 **Blue**: Medium score (60-79)
- 🟠 **Orange**: Low-medium score (40-59)
- 🔴 **Red**: Low score (0-39)

---

## 🔧 Advanced Configuration

### **Custom Map Styles**

Edit `src/lib/maps/googleMaps.ts` to customize appearance:

```typescript
private getDefaultMapStyles(): google.maps.MapTypeStyle[] {
  return [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }]
    },
    // Add more styles...
  ];
}
```

Use [Google Maps Styling Wizard](https://mapstyle.withgoogle.com/) to generate styles.

### **Custom Markers**

Replace default markers with custom icons:

```typescript
const marker = new google.maps.Marker({
  icon: {
    url: "/markers/custom-pin.png",
    scaledSize: new google.maps.Size(32, 32)
  }
});
```

### **Heat Maps**

Enable heat map visualization:

```typescript
import { HeatmapLayer } from '@googlemaps/js-api-loader';

const heatmap = new google.maps.visualization.HeatmapLayer({
  data: heatmapData,
  map: map
});
```

---

## 🐛 Troubleshooting

### **Map not loading**

**Check**:
1. API key is correct in `.env.local`
2. Maps JavaScript API is enabled
3. Browser console for errors
4. API key restrictions allow your domain

**Common errors**:
```
RefererNotAllowedMapError
→ Add your domain to API restrictions

ApiNotActivatedMapError  
→ Enable Maps JavaScript API in console

InvalidKeyMapError
→ Check API key is correct
```

### **Markers not appearing**

**Possible causes**:
1. No leads in database
2. Leads missing coordinates
3. Map bounds not fitting markers
4. Filter settings hiding markers

**Solution**:
```typescript
// Force fit bounds to markers
googleMapsService.fitBoundsToMarkers();
```

### **Geocoding quota exceeded**

**Solutions**:
1. Cache geocoded addresses in database
2. Batch geocode during off-peak hours
3. Use approximate coordinates for cities
4. Upgrade to paid tier if needed

---

## 📊 Monitoring Usage

### **View API Usage**

1. Navigate to **Google Cloud Console**
2. Go to **APIs & Services → Dashboard**
3. Click on **Maps JavaScript API**
4. View usage graphs and quotas

### **Set Up Billing Alerts**

1. Navigate to **Billing → Budgets & alerts**
2. Click **Create Budget**
3. Set amount: `$50`, `$100`, `$150`
4. Add email notifications
5. Click **Finish**

### **Usage Optimization**

Monitor these metrics:
- Map loads per day
- Places API calls
- Geocoding requests
- Average cost per user

---

## ✅ Security Checklist

Before going to production:

- [ ] API key created
- [ ] Application restrictions set (HTTP referrers)
- [ ] API restrictions enabled (only required APIs)
- [ ] Production domain added to referrers
- [ ] Billing alerts configured
- [ ] Daily quotas set (optional)
- [ ] API key stored in environment variables (not in code)
- [ ] Map tested in production environment

---

## 🌍 New Brunswick Coordinates

Pre-configured cities with coordinates:

```typescript
export const NB_COORDINATES = {
  Moncton: { lat: 46.0878, lng: -64.7782 },
  "Saint John": { lat: 45.2733, lng: -66.0633 },
  Fredericton: { lat: 45.9636, lng: -66.6431 },
  Bathurst: { lat: 47.6186, lng: -65.6506 },
  Miramichi: { lat: 47.0282, lng: -65.5015 },
  Edmundston: { lat: 47.3737, lng: -68.3251 },
  Campbellton: { lat: 48.0056, lng: -66.6726 },
  Dieppe: { lat: 46.0997, lng: -64.7243 },
  Riverview: { lat: 46.0607, lng: -64.8072 },
  Quispamsis: { lat: 45.4320, lng: -65.9449 }
};
```

---

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing)
- [Styling Wizard](https://mapstyle.withgoogle.com/)

---

**Ready to explore?** Visit `/dashboard/map` to see your leads on the map! 🗺️