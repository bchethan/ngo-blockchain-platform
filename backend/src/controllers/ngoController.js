const NGO = require('../models/NGO');
const User = require('../models/User');
const Donation = require('../models/Donation');

// Register NGO
const registerNGO = async (req, res) => {
  try {
    const { walletAddress, name, registrationId, description, email, phone, website, ipfsDocHash } = req.body;

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO already registered' });
    }

    // Create NGO
    console.log(`[Backend Log] Attempting to save NGO for wallet: ${walletAddress}`);
    const ngo = new NGO({
      walletAddress: walletAddress.toLowerCase(),
      name,
      registrationId,
      description,
      email,
      phone,
      website,
      ipfsDocHash,
      isVerified: req.body.isVerified !== undefined ? req.body.isVerified : false
    });

    await ngo.save();
    console.log(`[Backend Log] Successfully saved NGO in MongoDB: ${ngo._id}`);

    // Create user entry
    const user = new User({
      walletAddress: walletAddress.toLowerCase(),
      role: 'ngo',
      email,
    });
    await user.save();

    res.status(201).json({ message: 'NGO registered successfully', ngo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get NGO profile
const getNGOProfile = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const ngo = await NGO.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donations received by NGO
const getNGODonations = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const donations = await Donation.find({ ngo: walletAddress.toLowerCase() }).sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all NGOs
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find().sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerNGO,
  getNGOProfile,
  getNGODonations,
  getAllNGOs,
};
