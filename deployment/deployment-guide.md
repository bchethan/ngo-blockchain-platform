# Deployment Guide - NGO Blockchain Platform

## Prerequisites

- Node.js v16+
- MongoDB instance
- MetaMask wallet
- Testnet ETH (for Sepolia deployment)

## Local Development Deployment

### 1. Start Local Blockchain

```bash
cd blockchain
npx hardhat node
```

Keep this terminal running. Note the accounts and private keys displayed.

### 2. Deploy Smart Contracts

In a new terminal:

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

Contract addresses will be saved to:
- `frontend/src/contract-addresses.json`
- `backend/src/config/contract-addresses.json`

### 3. Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Start Backend Server

```bash
cd backend
cp .env.example .env
# Edit .env if needed
npm install
npm start
```

Backend will run on `http://localhost:5000`

### 5. Start Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Configure MetaMask

1. Add local network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import test account using private key from Hardhat node output

## Testnet Deployment (Sepolia)

### 1. Get Testnet ETH

Get Sepolia ETH from faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### 2. Setup Alchemy/Infura

1. Create account on Alchemy or Infura
2. Create new app for Sepolia network
3. Copy API key/URL

### 3. Update Hardhat Config

Edit `blockchain/hardhat.config.js`:

```javascript
sepolia: {
  url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
  accounts: ["YOUR_PRIVATE_KEY"]
}
```

⚠️ **Never commit private keys to git!**

### 4. Deploy to Sepolia

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Update Backend Config

Edit `backend/.env`:

```
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 6. Deploy Backend

**Option A: Railway**

1. Create account on Railway.app
2. Create new project
3. Connect GitHub repository
4. Set environment variables
5. Deploy

**Option B: Heroku**

```bash
cd backend
heroku create ngo-blockchain-backend
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set RPC_URL=your_rpc_url
git push heroku main
```

### 7. Deploy Frontend

**Vercel Deployment:**

```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Update environment variables in Vercel dashboard:
- `VITE_API_URL`: Your backend URL

## MongoDB Atlas Setup (Production)

1. Create account on MongoDB Atlas
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for testing)
5. Get connection string
6. Update `MONGO_URI` in backend `.env`

## Verification Steps

### Local Deployment

1. ✅ Hardhat node running
2. ✅ Contracts deployed
3. ✅ MongoDB running
4. ✅ Backend server running (port 5000)
5. ✅ Frontend running (port 5173)
6. ✅ MetaMask connected to local network

### Testnet Deployment

1. ✅ Contracts deployed to Sepolia
2. ✅ Backend deployed and accessible
3. ✅ Frontend deployed and accessible
4. ✅ MongoDB Atlas connected
5. ✅ MetaMask connected to Sepolia
6. ✅ Contract addresses updated in frontend

## Testing the Deployment

### 1. Admin Flow

1. Connect with admin wallet (deployer address)
2. Navigate to `/admin`
3. Verify you can see NGO list

### 2. NGO Flow

1. Switch to different MetaMask account
2. Register NGO via smart contract interaction
3. Wait for admin verification
4. Check NGO dashboard

### 3. Donor Flow

1. Switch to donor account
2. Navigate to `/donor`
3. Select verified NGO
4. Make test donation
5. Verify transaction on Etherscan (for testnet)

## Troubleshooting

### Contract Deployment Issues

```bash
# Clear cache and recompile
npx hardhat clean
npx hardhat compile
```

### MetaMask Connection Issues

1. Reset MetaMask account
2. Clear browser cache
3. Re-import account

### Backend Connection Issues

- Check MongoDB connection string
- Verify RPC URL is correct
- Check CORS settings

### Frontend Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Never commit private keys
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins
- [ ] Use HTTPS in production
- [ ] Regularly update dependencies
- [ ] Audit smart contracts before mainnet

## Monitoring

### Blockchain

- Monitor contract on Etherscan
- Track gas usage
- Watch for failed transactions

### Backend

- Monitor API response times
- Check error logs
- Monitor MongoDB performance

### Frontend

- Check browser console for errors
- Monitor wallet connection status
- Verify contract addresses are correct

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Database Backups

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/ngo-blockchain"
```

## Support

For issues:
1. Check logs
2. Verify environment variables
3. Test contract interactions on Etherscan
4. Check network connectivity
