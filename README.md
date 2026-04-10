# NGO Blockchain Platform

A secure, transparent, and tamper-proof NGO management system using blockchain technology.

## 🎯 Features

- **Transparent Donations**: All donations recorded immutably on blockchain
- **NGO Verification**: Admin-controlled verification system
- **Expenditure Tracking**: NGOs can record spending with receipts
- **Real-time Tracking**: Donors can track how their funds are used
- **MetaMask Integration**: Secure wallet-based authentication

## 🛠️ Technology Stack

### Blockchain Layer
- **Ethereum Testnet** (Sepolia/Ganache)
- **Solidity** ^0.8.28
- **Hardhat** - Development environment
- **Ethers.js** - Blockchain interaction

### Backend
- **Node.js** + **Express.js**
- **MongoDB** - Off-chain data storage
- **JWT** - Authentication
- **CORS** - Cross-origin support

### Frontend
- **React** + **Vite**
- **React Router** - Navigation
- **Axios** - API calls
- **Modern CSS** - Custom design system

## 📁 Project Structure

```
ngo-blockchain-platform/
├── blockchain/          # Smart contracts & deployment
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   └── test/           # Contract tests
├── backend/            # Express API server
│   └── src/
│       ├── config/     # DB & blockchain config
│       ├── models/     # MongoDB models
│       ├── controllers/# Business logic
│       ├── routes/     # API endpoints
│       └── middlewares/# Auth & error handling
└── frontend/           # React application
    └── src/
        ├── components/ # Reusable components
        ├── pages/      # Dashboard pages
        ├── services/   # API & blockchain services
        └── styles/     # CSS files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/bchethan/ngo-blockchain-platform
cd ngo-blockchain-platform
```

2. **Setup Blockchain Layer**
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
```

3. **Deploy Smart Contracts (Local)**
```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

4. **Setup Backend**
```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other configs
npm start
```

5. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Copy contract-addresses.json from blockchain/frontend/src/
npm run dev
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo-blockchain
JWT_SECRET=your-secret-key
RPC_URL=http://127.0.0.1:8545
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## 📖 Usage

### For Admins
1. Connect wallet with admin address
2. Navigate to `/admin`
3. View all NGOs and verify legitimate ones
4. Monitor all donations

### For NGOs
1. Register NGO via blockchain
2. Wait for admin verification
3. Navigate to `/ngo`
4. View donations received
5. Record expenditures with receipts

### For Donors
1. Connect MetaMask wallet
2. Navigate to `/donor`
3. Select verified NGO
4. Make donation
5. Track donation usage

## 🧪 Testing

### Smart Contract Tests
```bash
cd blockchain
npx hardhat test
```

### API Testing
Use Postman or similar tool to test backend endpoints:
- `GET /api/admin/ngos/verified` - Get verified NGOs
- `POST /api/ngo/register` - Register NGO
- `POST /api/donor/donate` - Record donation

## 📝 Smart Contracts

### NGORegistry.sol
- Register NGOs
- Admin verification
- Query NGO details

### DonationManager.sol
- Accept donations
- Transfer funds to NGOs
- Track donation history

### ExpenditureTracker.sol
- Record NGO spending
- Store receipt hashes (IPFS)
- Immutable expenditure log

## 🔐 Security Features

- Wallet-based authentication
- Role-based access control
- Blockchain immutability
- Admin-only verification
- Transparent transaction history

## 🌐 Deployment

### Testnet Deployment (Sepolia)

1. Get Sepolia ETH from faucet
2. Update `hardhat.config.js` with Alchemy/Infura URL
3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Follow platform-specific deployment guide
```

## 📚 API Documentation

### Admin Endpoints
- `GET /api/admin/ngos` - Get all NGOs
- `GET /api/admin/ngos/verified` - Get verified NGOs
- `POST /api/admin/ngos/verify` - Verify NGO
- `GET /api/admin/donations` - Get all donations

### NGO Endpoints
- `POST /api/ngo/register` - Register NGO
- `GET /api/ngo/:address` - Get NGO profile
- `GET /api/ngo/:address/donations` - Get NGO donations

### Donor Endpoints
- `POST /api/donor/donate` - Record donation
- `GET /api/donor/:address/donations` - Get donor donations

## 🤝 Contributing

This is an academic project. For improvements:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

ISC License - Free for academic and educational use

## 👥 Authors

Academic Project - NGO Blockchain Platform

## 🙏 Acknowledgments

- Ethereum Foundation
- Hardhat Team
- React Community
- Open Source Contributors
