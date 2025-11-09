# Production Deployment Guide

This guide provides comprehensive instructions for deploying the IDURAR Automotive Workshop ERP/CRM system to a production environment.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Security Hardening](#security-hardening)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Deployment Steps](#deployment-steps)

## Pre-Deployment Checklist

### Backend Checklist

- [ ] All environment variables configured in `.env`
- [ ] Database indexes created (run `npm run setup:indexes` or restart server)
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting enabled on all routes
- [ ] Input validation and sanitization implemented
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] CORS configured for production domains
- [ ] Secret keys rotated from defaults
- [ ] API documentation updated

### Frontend Checklist

- [ ] Production build created (`npm run build`)
- [ ] API endpoints updated to production URLs
- [ ] Analytics tracking configured (if applicable)
- [ ] Error boundary components implemented
- [ ] Service worker configured (if using PWA)
- [ ] Static assets optimized and minified
- [ ] CDN configured for static assets (optional)

### Infrastructure Checklist

- [ ] Server provisioned with adequate resources
  - Minimum: 2 CPU cores, 4GB RAM
  - Recommended: 4 CPU cores, 8GB RAM
- [ ] MongoDB cluster/replica set configured
- [ ] Reverse proxy (Nginx/Apache) configured
- [ ] Firewall rules configured
- [ ] SSL/TLS certificates installed
- [ ] Automated backups scheduled
- [ ] Monitoring tools installed
- [ ] Log rotation configured

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Application
NODE_ENV=production
PORT=8888

# Database
DATABASE=mongodb://localhost:27017/idurar-erp-crm
# For MongoDB Atlas or remote server:
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/idurar-erp-crm

# JWT & Authentication
JWT_SECRET=your-strong-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=7d

# Security
BCRYPT_SALT=10
SESSION_SECRET=your-strong-session-secret-change-this

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email Configuration (for notifications)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@yourdomain.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend` directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_BACKEND_SERVER=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
```

## Database Setup

### MongoDB Indexes

All required indexes are automatically created when the server starts. The following indexes have been added for optimal performance:

#### Invoice Indexes
- `{ removed: 1, status: 1 }`
- `{ removed: 1, date: 1 }`
- `{ removed: 1, created: 1 }`
- `{ client: 1, removed: 1 }`
- `{ number: 1, year: 1 }` (unique)
- `{ paymentStatus: 1, removed: 1 }`

#### Payment Indexes
- `{ removed: 1, date: 1 }`
- `{ removed: 1, created: 1 }`
- `{ invoice: 1, removed: 1 }`
- `{ client: 1, removed: 1 }`
- `{ paymentMode: 1, removed: 1 }`
- `{ number: 1 }` (unique)

#### ServiceRecord Indexes
- `{ number: 1, year: 1 }` (unique)
- `{ removed: 1, status: 1 }`
- `{ removed: 1, created: 1 }`
- `{ vehicle: 1, removed: 1 }`
- `{ customer: 1, removed: 1 }`

#### Part Indexes
- `{ partNumber: 1 }` (unique)
- `{ removed: 1, enabled: 1 }`
- `{ removed: 1, lowStockAlert: 1 }`
- `{ category: 1, removed: 1 }`

### Database Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/path/to/backups
mongodump --uri="mongodb://localhost:27017/idurar-erp-crm" --out="${BACKUP_DIR}/backup_${DATE}"
# Compress backup
tar -czf "${BACKUP_DIR}/backup_${DATE}.tar.gz" "${BACKUP_DIR}/backup_${DATE}"
rm -rf "${BACKUP_DIR}/backup_${DATE}"
# Keep only last 30 days of backups
find ${BACKUP_DIR} -name "backup_*.tar.gz" -mtime +30 -delete
```

Schedule with cron:
```cron
0 2 * * * /path/to/backup-script.sh
```

## Security Hardening

### 1. Rate Limiting

Rate limiting is implemented for all API endpoints:

- **General API**: 100 requests per minute
- **Analytics**: 20 requests per minute
- **Authentication**: 5 requests per 15 minutes

Configure in `backend/src/middlewares/rateLimiter.js`

### 2. Input Validation

All user inputs are sanitized and validated:

- XSS prevention through HTML escaping
- NoSQL injection prevention
- Date range validation
- ObjectId validation

### 3. HTTPS/SSL

**Always use HTTPS in production.** Configure Nginx as reverse proxy:

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny direct access to app ports
sudo ufw deny 8888/tcp
sudo ufw deny 27017/tcp

# Enable firewall
sudo ufw enable
```

### 5. MongoDB Security

```javascript
// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})

// Create app user
use idurar-erp-crm
db.createUser({
  user: "appUser",
  pwd: "strong-app-password",
  roles: [
    { role: "readWrite", db: "idurar-erp-crm" }
  ]
})
```

Enable authentication in `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
```

## Performance Optimization

### 1. Database Query Optimization

- All frequently queried fields have indexes
- Use `.lean()` for read-only queries
- Implement pagination for large result sets
- Use aggregation pipelines efficiently

### 2. Caching Strategy

Consider implementing Redis for caching:

```javascript
// Example: Cache analytics results
const Redis = require('redis');
const client = Redis.createClient();

// Cache analytics for 5 minutes
const cacheKey = `analytics:${startDate}:${endDate}`;
const cached = await client.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

// ... compute analytics ...

await client.setEx(cacheKey, 300, JSON.stringify(result));
```

### 3. Frontend Performance

- Enable gzip compression in Nginx
- Use CDN for static assets
- Implement code splitting
- Optimize images and assets
- Enable browser caching

```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 4. Process Management

Use PM2 for production process management:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name idurar-backend

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit
```

## Monitoring & Logging

### 1. Application Logging

Implement Winston or similar:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 2. Error Monitoring

Consider services like:
- Sentry (error tracking)
- New Relic (APM)
- DataDog (infrastructure monitoring)

### 3. Database Monitoring

```bash
# MongoDB monitoring
mongostat
mongotop

# Enable MongoDB profiling
db.setProfilingLevel(1, { slowms: 100 })
```

## Backup & Recovery

### Backup Strategy

1. **Daily automated backups** (database)
2. **Weekly full system backups**
3. **Retention**: 30 days for daily, 90 days for weekly
4. **Off-site storage**: AWS S3, Google Cloud Storage

### Recovery Testing

Test recovery procedures quarterly:

```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/idurar-erp-crm" /path/to/backup
```

## Deployment Steps

### 1. Backend Deployment

```bash
# Clone repository
git clone https://github.com/yourorg/idurar-erp-crm.git
cd idurar-erp-crm/backend

# Install dependencies
npm install --production

# Set environment variables
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start server.js --name idurar-backend
pm2 save
```

### 2. Frontend Deployment

```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to web server
# Copy dist/ contents to Nginx web root
sudo cp -r dist/* /var/www/html/
```

### 3. Nginx Configuration

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Post-Deployment

1. Verify all services are running
2. Test critical user flows
3. Monitor error logs
4. Verify database connections
5. Test backup/restore procedures

## Maintenance

### Regular Tasks

- **Daily**: Monitor error logs and system resources
- **Weekly**: Review database performance, check backups
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Load testing, disaster recovery drills

### Updates

```bash
# Backend updates
cd backend
git pull
npm install
pm2 restart idurar-backend

# Frontend updates
cd ../frontend
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

## Support

For production support and questions:
- Documentation: https://docs.yourdomain.com
- Support: support@yourdomain.com
- Emergency: emergency@yourdomain.com

---

**Last Updated**: 2025-01-09
**Version**: 1.0.0
