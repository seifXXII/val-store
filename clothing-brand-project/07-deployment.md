# Deployment Strategy

## 🎯 Deployment Environments

### 1. Development (Local)

**Purpose**: Local development and testing

**Setup**:

- Run locally on `localhost`
- Use Docker Compose for database
- Hot reload enabled
- Debug mode on

**URLs**:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Database: `localhost:5432`

---

### 2. Staging

**Purpose**: Pre-production testing and QA

**Setup**:

- Mirrors production configuration
- Test with real payment gateway (test mode)
- Load test data
- Team testing environment

**URLs**:

- Frontend: `https://staging.yourbrand.com`
- Backend API: `https://api-staging.yourbrand.com`

---

### 3. Production

**Purpose**: Live customer-facing application

**Setup**:

- Optimized builds
- Production database
- Real payment processing
- Monitoring and alerts
- Auto-scaling enabled

**URLs**:

- Frontend: `https://www.yourbrand.com`
- Backend API: `https://api.yourbrand.com`

---

## 🚀 Deployment Process

### Initial Setup

#### 1. Domain & DNS Setup

```bash
# Purchase domain from Namecheap, GoDaddy, etc.
# Configure DNS records:

# For Vercel (Frontend)
A     @        76.76.21.21
CNAME www      cname.vercel-dns.com

# For Backend API
A     api      [your-server-ip]
```

#### 2. SSL Certificates

- **Automatic**: Vercel provides auto SSL
- **Backend**: Use Let's Encrypt or Cloudflare SSL

#### 3. Environment Variables

**Frontend (.env.production)**:

```env
NEXT_PUBLIC_API_URL=https://api.yourbrand.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

**Backend (.env.production)**:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://user:pass@host:6379

JWT_ACCESS_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx

AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=yourbrand-products

FRONTEND_URL=https://www.yourbrand.com
```

---

## 📦 Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `apps/web` directory (if monorepo)

### Step 2: Configure Build Settings

```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Root Directory (if monorepo)
apps/web
```

### Step 3: Environment Variables

Add all production environment variables in Vercel dashboard

### Step 4: Custom Domain

1. Go to Project Settings → Domains
2. Add `www.yourbrand.com`
3. Add `yourbrand.com` (redirect to www)
4. Configure DNS as instructed

### Step 5: Deploy

- **Auto-deploy**: Push to `main` branch
- **Preview deployments**: Every PR gets a unique URL

---

## 🔧 Backend Deployment (Railway)

### Step 1: Create Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"

### Step 2: Add Services

#### PostgreSQL Database

1. Click "+ New"
2. Select "Database" → "PostgreSQL"
3. Note the connection string

#### Redis

1. Click "+ New"
2. Select "Database" → "Redis"
3. Note the connection string

#### Backend API

1. Click "+ New"
2. Select "GitHub Repo"
3. Choose your repository
4. Configure:
   - **Root Directory**: `apps/api` (if monorepo)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`

### Step 3: Environment Variables

Add all backend environment variables

### Step 4: Custom Domain

1. Go to Settings → Networking
2. Add custom domain: `api.yourbrand.com`
3. Configure DNS with provided CNAME

### Step 5: Database Migrations

```bash
# Connect to Railway CLI
railway login
railway link

# Run migrations
railway run npx prisma migrate deploy
```

---

## 🐳 Alternative: Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
```

### Docker Compose (Full Stack)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: clothingbrand
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./apps/api
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/clothingbrand
      REDIS_URL: redis://redis:6379
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./apps/web
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys on push"

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: echo "Railway auto-deploys on push"
```

---

## 📊 Monitoring Setup

### 1. Error Tracking (Sentry)

**Install**:

```bash
npm install @sentry/nextjs @sentry/node
```

**Configure Frontend** (`sentry.client.config.js`):

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Configure Backend**:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Uptime Monitoring

**UptimeRobot** (Free):

1. Add monitors for:
   - `https://www.yourbrand.com`
   - `https://api.yourbrand.com/health`
2. Set alert email/SMS
3. Check interval: 5 minutes

### 3. Analytics

**Google Analytics 4**:

```javascript
// In _app.tsx or layout.tsx
import Script from "next/script";

export default function App() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
```

---

## 🔐 Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use ORM)
- [ ] XSS protection
- [ ] CSRF tokens implemented
- [ ] Strong password requirements
- [ ] JWT secrets are strong and random

### Post-Deployment

- [ ] Security headers configured (Helmet.js)
- [ ] SSL certificate valid
- [ ] Database backups automated
- [ ] Error messages don't leak sensitive info
- [ ] Admin panel requires strong authentication
- [ ] Regular dependency updates
- [ ] Security audit logs enabled

---

## 💾 Backup Strategy

### Database Backups

**Automated Daily Backups**:

```bash
# Cron job (runs daily at 2 AM)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

**Railway Backups**:

- Automatic daily snapshots
- 7-day retention
- Manual snapshot before major changes

**Keep Backups**:

- Daily: Last 7 days
- Weekly: Last 4 weeks
- Monthly: Last 12 months

### File Storage Backups

- S3/R2 has built-in redundancy
- Enable versioning on bucket
- Lifecycle policy for old images

---

## 🚨 Rollback Plan

### Frontend Rollback (Vercel)

1. Go to Deployments
2. Find the last working deployment
3. Click "Promote to Production"

### Backend Rollback (Railway)

1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

### Database Rollback

```bash
# Restore from backup
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

---

## 📈 Scaling Strategy

### Vertical Scaling (First Step)

- Upgrade server resources
- Increase database connections
- Add more Redis memory

### Horizontal Scaling

1. **Load Balancer**: Distribute traffic across multiple API servers
2. **Database Read Replicas**: Separate read/write operations
3. **CDN**: Serve static assets globally
4. **Caching**: Redis for frequently accessed data

### Auto-Scaling

**Railway/Vercel**:

- Automatically scale based on traffic
- Configure min/max instances
- Set resource limits

---

## 🎯 Launch Checklist

### Pre-Launch (1 week before)

- [ ] All features tested on staging
- [ ] Performance testing completed
- [ ] Load testing done
- [ ] Security audit passed
- [ ] Backups configured and tested
- [ ] Monitoring tools setup
- [ ] Domain and SSL configured
- [ ] Payment gateway in production mode
- [ ] Email templates tested
- [ ] Error pages designed (404, 500)
- [ ] Google Analytics configured
- [ ] SEO meta tags added
- [ ] Sitemap generated
- [ ] Robots.txt configured

### Launch Day

- [ ] Final smoke test on production
- [ ] Database migrations run
- [ ] Static assets uploaded to CDN
- [ ] DNS propagation verified
- [ ] Test complete user journey
- [ ] Test payment flow with real card
- [ ] Verify email delivery
- [ ] Monitor error logs
- [ ] Check analytics tracking
- [ ] Team on standby for issues

### Post-Launch (First Week)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Fix critical bugs immediately
- [ ] Daily backup verification
- [ ] Review security logs
- [ ] Optimize slow queries
- [ ] Plan first update

---

## 📞 Support & Maintenance

### Daily Tasks

- Check error logs
- Monitor uptime
- Review customer complaints
- Process refunds/returns

### Weekly Tasks

- Security updates
- Performance review
- Backup verification
- Analytics review

### Monthly Tasks

- Dependency updates
- Security audit
- Performance optimization
- Feature planning

---

## 💡 Best Practices

1. **Always deploy to staging first**
2. **Test payment flow after every deployment**
3. **Keep staging and production in sync**
4. **Monitor immediately after deployment**
5. **Have rollback plan ready**
6. **Communicate during maintenance**
7. **Keep documentation updated**
8. **Regular security updates**
9. **Optimize database regularly**
10. **Backup before major changes**
