# Free Deployment Guide - NGO Blockchain Platform

## 🎯 Overview

This guide will help you deploy your NGO donation platform completely free using:
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: MongoDB Atlas (Free tier - 512MB)

**Total Cost**: $0/month ✅

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- MongoDB Atlas account (sign up at mongodb.com/cloud/atlas)

---

## Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier
5. Choose a cloud provider (AWS recommended)
6. Select a region close to you
7. Name your cluster: `ngo-platform-cluster`
8. Click **"Create"**

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `ngo-admin`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://ngo-admin:<password>@ngo-platform-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before `?`: `/ngo-blockchain`
   ```
   mongodb+srv://ngo-admin:YOUR_PASSWORD@ngo-platform-cluster.xxxxx.mongodb.net/ngo-blockchain?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for backend deployment.

---

## Step 2: Prepare Code for Deployment

### 2.1 Update Backend for Production

The backend is already configured, but verify these files exist:

✅ `backend/package.json` - Has all dependencies
✅ `backend/src/server.js` - Entry point
✅ `backend/.env.example` - Environment template

### 2.2 Update Frontend for Production

Create production build configuration:

**File: `frontend/.env.production`** (already created for you)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

You'll update this after deploying the backend.

---

## Step 3: Deploy Backend to Render

### 3.1 Push Code to GitHub

```bash
# In your project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3.2 Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ngo-platform-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

### 3.3 Set Environment Variables

In Render, go to **Environment** tab and add:

```
PORT=5000
MONGO_URI=mongodb+srv://ngo-admin:YOUR_PASSWORD@ngo-platform-cluster.xxxxx.mongodb.net/ngo-blockchain?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RPC_URL=http://127.0.0.1:8545
NODE_ENV=production
```

**Important**: Replace `MONGO_URI` with your actual MongoDB connection string!

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://ngo-platform-backend.onrender.com
   ```

### 3.5 Test Backend

Visit: `https://ngo-platform-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "NGO Platform API is running"
}
```

✅ **Backend is live!**

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment

Update `frontend/.env.production`:
```env
VITE_API_URL=https://ngo-platform-backend.onrender.com/api
```

Commit this change:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

### 4.2 Deploy to Vercel

**Option A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? `ngo-platform`
- Directory? `./` (current directory)
- Override settings? **N**

**Option B: Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://ngo-platform-backend.onrender.com/api
   ```

6. Click **"Deploy"**

### 4.3 Get Your Live URL

After deployment, you'll get a URL like:
```
https://ngo-platform.vercel.app
```

✅ **Frontend is live!**

---

## Step 5: Configure CORS

Update backend CORS to allow your Vercel domain:

**File: `backend/src/server.js`**

The CORS is already configured to accept all origins in development. For production, you might want to restrict it:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://ngo-platform.vercel.app',
    'https://ngo-platform-*.vercel.app' // For preview deployments
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Commit and push:
```bash
git add backend/src/server.js
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy.

---

## Step 6: Verify Deployment

### 6.1 Test Backend Endpoints

```bash
# Health check
curl https://ngo-platform-backend.onrender.com/api/health

# Get verified NGOs (should return dummy NGOs)
curl https://ngo-platform-backend.onrender.com/api/admin/ngos/verified
```

### 6.2 Test Frontend

1. Visit: `https://ngo-platform.vercel.app`
2. Click **"🎭 Connect (Demo)"**
3. Go to **"Register NGO"**
4. Fill form and submit
5. Go to **"Donate"**
6. Select NGO and donate

✅ Everything should work!

---

## 🎉 Your Live URLs

- **Frontend**: `https://ngo-platform.vercel.app`
- **Backend**: `https://ngo-platform-backend.onrender.com`
- **Database**: MongoDB Atlas (managed)

---

## 🔧 Troubleshooting

### Frontend can't connect to backend

**Issue**: CORS errors or network failures

**Solution**:
1. Check `frontend/.env.production` has correct backend URL
2. Verify CORS settings in `backend/src/server.js`
3. Redeploy frontend: `vercel --prod`

### Backend not starting

**Issue**: Render deployment fails

**Solution**:
1. Check Render logs
2. Verify `MONGO_URI` is correct
3. Ensure all environment variables are set
4. Check `backend/package.json` has `"start": "node src/server.js"`

### Database connection fails

**Issue**: MongoDB connection timeout

**Solution**:
1. Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
2. Check connection string format
3. Ensure password doesn't have special characters (URL encode if needed)

### Render free tier sleeps

**Issue**: Backend takes 30s to wake up

**Solution**:
- This is normal for Render free tier
- First request after inactivity will be slow
- Consider upgrading to paid tier for production

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Free | $0 | 100GB bandwidth/month |
| **Render** | Free | $0 | 750 hours/month, sleeps after 15min inactivity |
| **MongoDB Atlas** | M0 | $0 | 512MB storage, shared cluster |
| **Total** | | **$0/month** | ✅ |

---

## 🚀 Next Steps

### For Better Performance:

1. **Upgrade Render** ($7/month) - No sleep, better performance
2. **Custom Domain** - Add your own domain to Vercel (free)
3. **MongoDB M10** ($9/month) - Dedicated cluster, better performance

### For Production:

1. Add authentication
2. Implement rate limiting
3. Add logging and monitoring
4. Set up CI/CD pipelines
5. Add SSL certificates (automatic on Vercel/Render)

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string saved
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Environment variables set on Render
- [ ] Backend health check passes
- [ ] Frontend `.env.production` updated
- [ ] Frontend deployed to Vercel
- [ ] CORS configured
- [ ] Full app tested end-to-end

---

## 🎓 Academic Use Notes

This deployment is perfect for:
- ✅ Academic projects
- ✅ Portfolio demonstrations
- ✅ Proof of concept
- ✅ Learning blockchain concepts
- ✅ Hackathons

**Not suitable for**:
- ❌ Production with real money
- ❌ High-traffic applications
- ❌ Sensitive data storage

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Congratulations! Your NGO platform is now live and accessible worldwide! 🎉**
