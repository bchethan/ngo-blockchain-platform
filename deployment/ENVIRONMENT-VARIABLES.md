# Environment Variables Configuration

## Backend (.env)

Create a `.env` file in the `backend` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ngo-blockchain?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Blockchain (Mock - not used in demo mode)
RPC_URL=http://127.0.0.1:8545
```

### How to Get MongoDB URI:

1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add database name: `/ngo-blockchain` before the `?`

Example:
```
mongodb+srv://ngo-admin:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/ngo-blockchain?retryWrites=true&w=majority
```

### JWT Secret Generation:

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend (.env.production)

Create a `.env.production` file in the `frontend` directory with:

```env
# API Configuration
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render backend URL.

---

## Deployment Platform Environment Variables

### Render (Backend)

Add these in Render Dashboard → Environment:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | Required |
| `NODE_ENV` | `production` | Required |
| `MONGO_URI` | Your MongoDB connection string | **Secret** |
| `JWT_SECRET` | Your generated secret | **Secret** |
| `RPC_URL` | `http://127.0.0.1:8545` | Not used in demo mode |

### Vercel (Frontend)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-app.onrender.com/api` | Production |

---

## Security Best Practices

1. **Never commit `.env` files to Git**
   - Already in `.gitignore`
   
2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Random and unpredictable
   
3. **Rotate secrets regularly**
   - Change JWT_SECRET every 3-6 months
   
4. **Restrict MongoDB access**
   - For production, limit to specific IPs
   - Currently set to 0.0.0.0/0 for demo
   
5. **Use environment-specific configs**
   - Different secrets for dev/staging/production

---

## Verification

### Check Backend Environment

```bash
# SSH into Render or check logs
echo $PORT
echo $NODE_ENV
# Never echo secrets in logs!
```

### Check Frontend Environment

```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL)
```

---

## Troubleshooting

### "Cannot connect to database"
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access
- Ensure password doesn't have special characters

### "CORS error"
- Update backend CORS to include frontend URL
- Redeploy backend after changes

### "Environment variable not found"
- Vercel: Redeploy after adding variables
- Render: Restart service after adding variables
