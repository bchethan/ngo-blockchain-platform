# 🚀 Free Deployment - Quick Start

Your NGO platform is ready to deploy for **$0/month**!

## 📦 What You'll Deploy

- ✅ **Frontend**: React + Vite → Vercel (Free)
- ✅ **Backend**: Node.js + Express → Render (Free)  
- ✅ **Database**: MongoDB → Atlas (Free 512MB)
- ✅ **Total Cost**: $0/month

---

## ⚡ Quick Deploy (5 Steps)

### 1️⃣ Setup MongoDB Atlas (5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Copy connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/ngo-blockchain?retryWrites=true&w=majority
```

---

### 2️⃣ Deploy Backend to Render (10 minutes)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `npm start`
5. Add environment variables:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-32-char-string>
   NODE_ENV=production
   ```
6. Deploy!

**Your Backend URL**: `https://your-app.onrender.com`

---

### 3️⃣ Update Frontend Config (1 minute)

Edit `frontend/.env.production`:
```env
VITE_API_URL=https://your-app.onrender.com/api
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

---

### 4️⃣ Deploy Frontend to Vercel (5 minutes)

**Option A: CLI**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Option B: Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Root Directory: `frontend`
4. Add env var: `VITE_API_URL=https://your-app.onrender.com/api`
5. Deploy!

**Your Frontend URL**: `https://your-app.vercel.app`

---

### 5️⃣ Test Your Live App! (2 minutes)

1. Visit your Vercel URL
2. Click "🎭 Connect (Demo)"
3. Register an NGO
4. Make a donation
5. ✅ **Success!**

---

## 📚 Detailed Guides

- **[FREE-DEPLOYMENT-GUIDE.md](./FREE-DEPLOYMENT-GUIDE.md)** - Complete step-by-step guide
- **[QUICK-DEPLOY.md](./QUICK-DEPLOY.md)** - Command reference
- **[ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md)** - Environment setup

---

## 🔧 Troubleshooting

### Backend not connecting to database
- Check MongoDB connection string
- Verify network access (0.0.0.0/0)
- Check Render logs

### Frontend can't reach backend
- Update CORS in `backend/src/server.js`
- Verify `VITE_API_URL` in Vercel
- Check browser console for errors

### Render service sleeping
- Normal for free tier
- First request takes ~30s after 15min inactivity
- Upgrade to $7/month to prevent sleeping

---

## 💡 Pro Tips

1. **Use Render's auto-deploy**: Pushes to `main` branch auto-deploy
2. **Preview deployments**: Vercel creates preview for each PR
3. **Monitor logs**: Check Render/Vercel dashboards for errors
4. **Custom domain**: Add free custom domain on Vercel

---

## 🎓 Perfect For

- ✅ Academic projects
- ✅ Portfolio demonstrations  
- ✅ Hackathons
- ✅ Proof of concepts
- ✅ Learning deployments

---

## 🚨 Important Notes

- **Render Free Tier**: Service sleeps after 15min inactivity
- **MongoDB Free Tier**: 512MB storage limit
- **Vercel Free Tier**: 100GB bandwidth/month
- **Demo Mode**: No real blockchain, perfect for testing!

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user and network access configured
- [ ] Backend deployed to Render
- [ ] Environment variables set on Render
- [ ] Backend health check passes
- [ ] Frontend `.env.production` updated
- [ ] Frontend deployed to Vercel
- [ ] Full app tested end-to-end

---

**🎉 Congratulations! Your NGO platform is now live and free!**

Share your live URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`
