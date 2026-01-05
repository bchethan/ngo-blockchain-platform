import { ethers } from 'ethers';

// Contract ABIs (simplified - in production, import from artifacts)
const NGORegistryABI = [
  "function registerNGO(string memory _name, string memory _registrationId, string memory _description, string memory _ipfsDocHash) external",
  "function verifyNGO(address _ngoAddress) external",
  "function getNGO(address _ngoAddress) external view returns (tuple(string name, string registrationId, string description, address walletAddress, bool isVerified, string ipfsDocHash))",
  "function getAllNGOs() external view returns (tuple(string name, string registrationId, string description, address walletAddress, bool isVerified, string ipfsDocHash)[])",
  "function isVerified(address _ngoAddress) external view returns (bool)",
  "event NGORegistered(address indexed ngoAddress, string name)",
  "event NGOVerified(address indexed ngoAddress)"
];

const DonationManagerABI = [
  "function donate(address _ngoAddress, string memory _message) external payable",
  "function getDonationsByDonor(address _donor) external view returns (tuple(address donor, address ngo, uint256 amount, uint256 timestamp, string message)[])",
  "function getDonationsByNGO(address _ngo) external view returns (tuple(address donor, address ngo, uint256 amount, uint256 timestamp, string message)[])",
  "function getAllDonations() external view returns (tuple(address donor, address ngo, uint256 amount, uint256 timestamp, string message)[])",
  "event DonationReceived(address indexed donor, address indexed ngo, uint256 amount, uint256 timestamp)"
];

const ExpenditureTrackerABI = [
  "function recordExpenditure(uint256 _amount, string memory _recipient, string memory _description, string memory _ipfsReceiptHash) external",
  "function getExpendituresByNGO(address _ngo) external view returns (tuple(address ngo, uint256 amount, string recipient, string description, uint256 timestamp, string ipfsReceiptHash)[])",
  "event ExpenditureRecorded(address indexed ngo, uint256 amount, string recipient, uint256 timestamp)"
];

let provider;
let signer;
let ngoRegistryContract;
let donationManagerContract;
let expenditureTrackerContract;

// Contract addresses (will be loaded from deployed addresses)
let contractAddresses = {
  NGORegistry: '',
  DonationManager: '',
  ExpenditureTracker: ''
};

// Load contract addresses
export const loadContractAddresses = async () => {
  try {
    const response = await fetch('/contract-addresses.json');
    contractAddresses = await response.json();
  } catch (error) {
    console.error('Failed to load contract addresses:', error);
  }
};

// Connect to MetaMask
export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Initialize contracts
    await loadContractAddresses();
    ngoRegistryContract = new ethers.Contract(contractAddresses.NGORegistry, NGORegistryABI, signer);
    donationManagerContract = new ethers.Contract(contractAddresses.DonationManager, DonationManagerABI, signer);
    expenditureTrackerContract = new ethers.Contract(contractAddresses.ExpenditureTracker, ExpenditureTrackerABI, signer);
    
    return address;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  const accounts = await provider.listAccounts();
  return accounts[0]?.address || null;
};

// NGO Registry functions
export const registerNGO = async (name, registrationId, description, ipfsDocHash) => {
  const tx = await ngoRegistryContract.registerNGO(name, registrationId, description, ipfsDocHash);
  await tx.wait();
  return tx;
};

export const verifyNGO = async (ngoAddress) => {
  const tx = await ngoRegistryContract.verifyNGO(ngoAddress);
  await tx.wait();
  return tx;
};

export const getNGO = async (ngoAddress) => {
  return await ngoRegistryContract.getNGO(ngoAddress);
};

export const getAllNGOs = async () => {
  return await ngoRegistryContract.getAllNGOs();
};

// Donation Manager functions
export const donate = async (ngoAddress, message, amount) => {
  const tx = await donationManagerContract.donate(ngoAddress, message, {
    value: ethers.parseEther(amount)
  });
  await tx.wait();
  return tx;
};

export const getDonationsByDonor = async (donorAddress) => {
  return await donationManagerContract.getDonationsByDonor(donorAddress);
};

export const getDonationsByNGO = async (ngoAddress) => {
  return await donationManagerContract.getDonationsByNGO(ngoAddress);
};

// Expenditure Tracker functions
export const recordExpenditure = async (amount, recipient, description, ipfsReceiptHash) => {
  const tx = await expenditureTrackerContract.recordExpenditure(
    ethers.parseEther(amount),
    recipient,
    description,
    ipfsReceiptHash
  );
  await tx.wait();
  return tx;
};

export const getExpendituresByNGO = async (ngoAddress) => {
  return await expenditureTrackerContract.getExpendituresByNGO(ngoAddress);
};

export default {
  connectWallet,
  getCurrentAccount,
  registerNGO,
  verifyNGO,
  getNGO,
  getAllNGOs,
  donate,
  getDonationsByDonor,
  getDonationsByNGO,
  recordExpenditure,
  getExpendituresByNGO,
};
