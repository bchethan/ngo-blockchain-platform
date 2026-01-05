// Mock blockchain service for demo/testing without real transactions
// Set this to true to enable demo mode (no MetaMask, no real blockchain)
export const DEMO_MODE = true;

// Generate fake transaction hash
const generateFakeTxHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate fake wallet address
export const generateFakeWalletAddress = () => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Mock wallet connection
export const connectWallet = async () => {
  if (DEMO_MODE) {
    // Return a fake wallet address
    const fakeAddress = generateFakeWalletAddress();
    console.log('🎭 DEMO MODE: Connected with fake wallet:', fakeAddress);
    return fakeAddress;
  }
  
  // Real MetaMask connection
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
};

// Mock NGO registration
export const registerNGO = async (name, registrationId, description, ipfsDocHash) => {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fakeTx = {
      hash: generateFakeTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      from: generateFakeWalletAddress(),
      to: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Fake contract address
      gasUsed: '150000',
      status: 1
    };
    
    console.log('🎭 DEMO MODE: NGO registered (mock transaction)', fakeTx);
    return fakeTx;
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Mock donation
export const donate = async (ngoAddress, message, amount) => {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fakeTx = {
      hash: generateFakeTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      from: generateFakeWalletAddress(),
      to: ngoAddress,
      value: amount,
      gasUsed: '100000',
      status: 1,
      timestamp: Date.now()
    };
    
    console.log('🎭 DEMO MODE: Donation sent (mock transaction)', fakeTx);
    return fakeTx;
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Mock expenditure recording
export const recordExpenditure = async (amount, recipient, description, ipfsHash) => {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fakeTx = {
      hash: generateFakeTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      from: generateFakeWalletAddress(),
      gasUsed: '120000',
      status: 1
    };
    
    console.log('🎭 DEMO MODE: Expenditure recorded (mock transaction)', fakeTx);
    return fakeTx;
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Mock verify NGO (admin only)
export const verifyNGO = async (ngoAddress) => {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fakeTx = {
      hash: generateFakeTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      status: 1
    };
    
    console.log('🎭 DEMO MODE: NGO verified (mock transaction)', fakeTx);
    return fakeTx;
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Mock get donations by donor
export const getDonationsByDonor = async (donorAddress) => {
  if (DEMO_MODE) {
    // Return empty array for demo mode
    // Real donations will come from backend
    console.log('🎭 DEMO MODE: Getting donations (returning empty, use backend data)');
    return [];
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Mock get expenditures by NGO
export const getExpendituresByNGO = async (ngoAddress) => {
  if (DEMO_MODE) {
    // Return empty array for demo mode
    // Real expenditures will come from backend
    console.log('🎭 DEMO MODE: Getting expenditures (returning empty, use backend data)');
    return [];
  }
  
  // Real blockchain call would go here
  throw new Error('Real blockchain mode not configured');
};

// Check if wallet is connected (demo mode always returns true)
export const isWalletConnected = async () => {
  if (DEMO_MODE) {
    return true;
  }
  
  if (typeof window.ethereum === 'undefined') {
    return false;
  }
  
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0;
};

export default {
  DEMO_MODE,
  connectWallet,
  registerNGO,
  donate,
  recordExpenditure,
  verifyNGO,
  getDonationsByDonor,
  getExpendituresByNGO,
  isWalletConnected,
  generateFakeWalletAddress
};
