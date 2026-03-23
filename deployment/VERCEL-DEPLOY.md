# Vercel Deployment Steps

## ✅ Prerequisites Done:
- [x] Code pushed to GitHub
- [x] Backend deployed to Render
- [x] Frontend config updated with backend URL

## 🚀 Deploy to Vercel (2 Options)

### Option 1: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select `bchethan/ngo-blockchain-platform`

3. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables:**
   Click "Add Environment Variable":
   ```
   Name: VITE_API_URL
   Value: https://ngo-blockchain-platform.onrender.com/api
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://ngo-blockchain-platform.vercel.app`

---

### Option 2: Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `ngo-blockchain-platform`
- Directory? `./` (current)
- Override settings? **N**

---

## 🧪 Test Your Deployment

Once deployed, visit your Vercel URL and:

1. Click "🎭 Connect (Demo)"
2. Go to "Register NGO"
3. Fill form and submit
4. Go to "Donate"
5. Select NGO and donate
6. ✅ Success!

---

## 🔧 If Backend is Sleeping

Render free tier sleeps after 15min inactivity. To wake it:

1. Visit: https://ngo-blockchain-platform.onrender.com/api/health
2. Wait 30-60 seconds for it to wake up
3. Refresh your frontend

---

## 📝 Your Live URLs

- **Frontend**: `https://ngo-blockchain-platform.vercel.app` (after deployment)
- **Backend**: `https://ngo-blockchain-platform.onrender.com`
- **GitHub**: `https://github.com/bchethan/ngo-blockchain-platform`

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] Backend deployed to Render
- [x] MongoDB Atlas configured
- [x] Frontend config updated
- [ ] Frontend deployed to Vercel
- [ ] Full app tested

---

**Next Step: Deploy to Vercel using Option 1 (Dashboard) - it's the easiest!**
