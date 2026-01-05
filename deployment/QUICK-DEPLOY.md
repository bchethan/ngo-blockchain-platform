# Quick Deployment Commands

## Prerequisites
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

## Deploy Backend to Render
1. Push code to GitHub
2. Go to https://dashboard.render.com
3. New Web Service → Connect GitHub repo
4. Root Directory: `backend`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables (see FREE-DEPLOYMENT-GUIDE.md)

## Deploy Frontend to Vercel

### Method 1: CLI (Recommended)
```bash
cd frontend
vercel --prod
```

### Method 2: Dashboard
1. Go to https://vercel.com/dashboard
2. Import GitHub repository
3. Root Directory: `frontend`
4. Framework: Vite
5. Add environment variable: `VITE_API_URL`

## Update Frontend After Backend Deployment
```bash
# Update .env.production with your Render URL
echo "VITE_API_URL=https://your-app.onrender.com/api" > frontend/.env.production

# Redeploy
cd frontend
vercel --prod
```

## Verify Deployment
```bash
# Test backend
curl https://your-app.onrender.com/api/health

# Test frontend
# Visit https://your-app.vercel.app in browser
```

## Common Issues

### CORS Error
Update `backend/src/server.js` CORS settings:
```javascript
origin: ['https://your-app.vercel.app']
```

### Environment Variables Not Working
- Vercel: Redeploy after adding env vars
- Render: Check Environment tab, restart service

### Backend Sleeping (Render Free Tier)
- Normal behavior
- First request after 15min takes ~30s
- Upgrade to paid tier to prevent sleeping

## Monitoring

### Render Logs
```
Dashboard → Your Service → Logs
```

### Vercel Logs
```
Dashboard → Project → Deployments → Function Logs
```

## Rollback

### Vercel
```bash
vercel rollback
```

### Render
Dashboard → Deployments → Redeploy previous version
