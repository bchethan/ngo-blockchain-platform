# Quick Start Guide - NGO Blockchain Platform

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v16+)
- ✅ MongoDB installed and running
- ✅ MetaMask browser extension installed

## Step-by-Step Startup

### Terminal 1: Start Local Blockchain

```bash
cd c:\ngo-blockchain-platform\blockchain
npx hardhat node
```

**Keep this terminal running!** You'll see test accounts with private keys displayed.

---

### Terminal 2: Deploy Smart Contracts

Open a **new terminal** and run:

```bash
cd c:\ngo-blockchain-platform\blockchain
npx hardhat run scripts/deploy.js --network localhost
```

You should see output like:
```
Deploying contracts with the account: 0x...
NGORegistry deployed to: 0x...
DonationManager deployed to: 0x...
ExpenditureTracker deployed to: 0x...
```

---

### Terminal 3: Start Backend Server

Open a **new terminal** and run:

```bash
cd c:\ngo-blockchain-platform\backend
npm install
npm start
```

Backend will start on `http://localhost:5000`

---

### Terminal 4: Start Frontend

Open a **new terminal** and run:

```bash
cd c:\ngo-blockchain-platform\frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Configure MetaMask

1. **Add Local Network:**
   - Click MetaMask extension
   - Click network dropdown → "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name**: Hardhat Local
     - **RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `31337`
     - **Currency Symbol**: ETH
   - Click "Save"

2. **Import Test Account:**
   - Copy a private key from Terminal 1 (Hardhat node output)
   - In MetaMask: Click account icon → "Import Account"
   - Paste private key
   - Click "Import"

---

## Access the Application

Open your browser and go to: **http://localhost:5173**

### Test the System:

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Admin Dashboard** - Go to `http://localhost:5173/admin`
3. **NGO Dashboard** - Go to `http://localhost:5173/ngo`
4. **Donor Dashboard** - Go to `http://localhost:5173/donor`

---

## Troubleshooting

### MongoDB Not Running?

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### Port Already in Use?

If port 5000 or 5173 is busy, you can change them:
- Backend: Edit `backend/.env` → change `PORT=5000` to another port
- Frontend: Vite will automatically suggest another port

### Contracts Not Deploying?

Make sure Terminal 1 (Hardhat node) is still running!

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start blockchain | `cd blockchain && npx hardhat node` |
| Deploy contracts | `cd blockchain && npx hardhat run scripts/deploy.js --network localhost` |
| Start backend | `cd backend && npm start` |
| Start frontend | `cd frontend && npm run dev` |
| Run tests | `cd blockchain && npx hardhat test` |

---

## What's Running?

- 🔗 **Blockchain**: Local Hardhat node on port 8545
- 🖥️ **Backend API**: Express server on port 5000
- 🌐 **Frontend**: React app on port 5173
- 💾 **Database**: MongoDB on port 27017

---

## Next Steps

Once everything is running:

1. **Register an NGO** (use a different MetaMask account)
2. **Verify NGO** as admin (use the deployer account)
3. **Make a donation** as a donor
4. **Record expenditure** as NGO

Enjoy your blockchain-powered NGO platform! 🚀
