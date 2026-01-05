const NGO = require('../models/NGO');
const User = require('../models/User');
const { getNGORegistryContract } = require('../config/blockchain');

// Get all NGOs
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get verified NGOs
const getVerifiedNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ isVerified: true });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify NGO (Admin only)
const verifyNGO = async (req, res) => {
  try {
    const { ngoAddress } = req.body;
    
    // Update in database
    const ngo = await NGO.findOneAndUpdate(
      { walletAddress: ngoAddress.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json({ message: 'NGO verified successfully', ngo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donations
const getAllDonations = async (req, res) => {
  try {
    const Donation = require('../models/Donation');
    const donations = await Donation.find().sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNGOs,
  getVerifiedNGOs,
  verifyNGO,
  getAllDonations,
};
