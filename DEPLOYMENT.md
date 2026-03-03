# Opportunity Finder - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Redis instance
- Email service account (SendGrid/AWS SES)
- Google Maps API key (optional)
- Domain name and SSL certificate

---

## 1. Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

### Required Environment Variables

```env
# Application
NEXT_PUBLIC_APP_NAME=Opportunity Finder
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/opportunity_finder

# Redis
REDIS_URL=redis://host:6379

# Email (Choose one)
SENDGRID_API_KEY=your_sendgrid_key
# OR
AWS_SES_ACCESS_KEY_ID=your_aws_key
AWS_SES_SECRET_ACCESS_KEY=your_aws_secret

# Authentication
JWT_SECRET=generate_secure_random_string
NEXTAUTH_SECRET=generate_secure_random_string
NEXTAUTH_URL=https://yourdomain.com

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Generate Secrets

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth secret
openssl rand -base64 32
```

---

## 2. Database Setup

### PostgreSQL Schema

```sql
-- Run the schema from ARCHITECTURE.md
-- Or use a migration tool like Prisma/TypeORM

-- Example migration command:
npx prisma migrate deploy
```

### Database Indexes

```sql
-- Performance optimization indexes
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_category ON leads(category);
CREATE INDEX idx_leads_score ON leads(lead_score DESC);
CREATE INDEX idx_leads_status ON leads(engagement_status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

## 3. Build Application

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Test production build locally
npm start
```

---

## 4. Deployment Options

### Option A: Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Framework: Next.js

### Option B: AWS EC2 + PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "opportunity-finder" -- start

# Setup PM2 startup
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Option C: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t opportunity-finder .
docker run -p 3000:3000 --env-file .env.local opportunity-finder
```

### Option D: Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opportunity-finder
spec:
  replicas: 3
  selector:
    matchLabels:
      app: opportunity-finder
  template:
    metadata:
      labels:
        app: opportunity-finder
    spec:
      containers:
      - name: app
        image: your-registry/opportunity-finder:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: app-secrets
```

---

## 5. Backend API Deployment

### NestJS Backend (Recommended)

```bash
# Clone backend repository
git clone https://github.com/your-org/opportunity-finder-api

# Install dependencies
cd opportunity-finder-api
npm install

# Build
npm run build

# Start with PM2
pm2 start dist/main.js --name "opportunity-finder-api"
```

### Django Backend (Alternative)

```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Start with Gunicorn
gunicorn opportunity_finder.wsgi:application --bind 0.0.0.0:8000
```

---

## 6. Redis Setup

### Local Redis

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Enable on boot
sudo systemctl enable redis-server
```

### Redis Cloud (Managed)

- [Redis Cloud](https://redis.com/cloud/)
- [AWS ElastiCache](https://aws.amazon.com/elasticache/)
- [Upstash](https://upstash.com/)

---

## 7. Email Service Configuration

### SendGrid

1. Create account at [SendGrid](https://sendgrid.com/)
2. Generate API key
3. Verify sender domain
4. Add to `.env.local`

### AWS SES

1. Setup AWS SES
2. Verify domain
3. Request production access
4. Configure IAM credentials
5. Add to `.env.local`

---

## 8. SSL/TLS Certificate

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

---

## 9. Nginx Configuration

```nginx
# /etc/nginx/sites-available/opportunity-finder
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/opportunity-finder /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 10. Monitoring & Logging

### Application Monitoring

**Sentry Setup:**

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Server Monitoring

```bash
# Install monitoring tools
npm install -g pm2-io

# Link PM2 to monitoring dashboard
pm2 link your-secret-key your-public-key
```

### Log Management

```bash
# PM2 logs
pm2 logs opportunity-finder

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 11. Performance Optimization

### CDN Setup (Cloudflare)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable caching rules
4. Configure page rules

### Image Optimization

```javascript
// next.config.mjs
images: {
  domains: ['your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

---

## 12. Backup Strategy

### Database Backups

```bash
# Automated PostgreSQL backup
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U postgres opportunity_finder > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### Cron Job

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-script.sh
```

---

## 13. Security Checklist

- [ ] Environment variables secured
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Database credentials rotated
- [ ] API keys secured
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Error messages sanitized
- [ ] File upload validation

---

## 14. Post-Deployment Verification

### Health Checks

```bash
# Frontend
curl https://yourdomain.com/

# Backend API
curl https://api.yourdomain.com/health

# Database connection
psql -h localhost -U postgres -d opportunity_finder -c "SELECT 1"

# Redis connection
redis-cli ping
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Load test
ab -n 1000 -c 10 https://yourdomain.com/
```

---

## 15. Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Rebuild
npm run build
pm2 restart opportunity-finder
```

### Monitoring Checklist

- [ ] Check error logs daily
- [ ] Monitor server resources (CPU, RAM, Disk)
- [ ] Review database performance
- [ ] Check backup completion
- [ ] Monitor email delivery rates
- [ ] Review security logs
- [ ] Check SSL certificate expiration
- [ ] Monitor API response times

---

## 16. Scaling Strategy

### Horizontal Scaling

```bash
# Add more PM2 instances
pm2 scale opportunity-finder +2

# Load balancing with Nginx
upstream backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}
```

### Database Scaling

- Read replicas for analytics
- Connection pooling (PgBouncer)
- Query optimization
- Caching with Redis

---

## 17. Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
pm2 logs opportunity-finder --lines 100

# Check port availability
sudo lsof -i :3000
```

**Database connection errors:**
```bash
# Test connection
psql -h localhost -U postgres -d opportunity_finder

# Check PostgreSQL status
sudo systemctl status postgresql
```

**High memory usage:**
```bash
# Monitor processes
pm2 monit

# Restart application
pm2 restart opportunity-finder
```

---

## 18. Support & Resources

- **Documentation**: `ARCHITECTURE.md`
- **API Docs**: `/api/docs` (when backend is deployed)
- **Support Email**: support@opportunityfinder.ca
- **GitHub Issues**: github.com/your-org/opportunity-finder/issues

---

**Last Updated**: March 3, 2026  
**Version**: 1.0.0  
**Maintainer**: DevOps Team