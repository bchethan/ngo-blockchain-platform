const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load contract addresses
const addressesPath = path.join(__dirname, 'contract-addresses.json');
let contractAddresses = {};

if (fs.existsSync(addressesPath)) {
  contractAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
}

// Load contract ABIs
const getContractABI = (contractName) => {
  const artifactPath = path.join(__dirname, '../../blockchain/artifacts/contracts', `${contractName}.sol/${contractName}.json`);
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    return artifact.abi;
  }
  return null;
};

// Setup provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');

// Contract instances
const getNGORegistryContract = () => {
  if (!contractAddresses.NGORegistry) return null;
  const abi = getContractABI('NGORegistry');
  return new ethers.Contract(contractAddresses.NGORegistry, abi, provider);
};

const getDonationManagerContract = () => {
  if (!contractAddresses.DonationManager) return null;
  const abi = getContractABI('DonationManager');
  return new ethers.Contract(contractAddresses.DonationManager, abi, provider);
};

const getExpenditureTrackerContract = () => {
  if (!contractAddresses.ExpenditureTracker) return null;
  const abi = getContractABI('ExpenditureTracker');
  return new ethers.Contract(contractAddresses.ExpenditureTracker, abi, provider);
};

module.exports = {
  provider,
  contractAddresses,
  getNGORegistryContract,
  getDonationManagerContract,
  getExpenditureTrackerContract,
};
