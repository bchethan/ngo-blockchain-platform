const Donation = require('../models/Donation');
const User = require('../models/User');
const Donor = require('../models/Donor');
const NGO = require('../models/NGO');

// Record donation (called after blockchain transaction)
const recordDonation = async (req, res) => {
  try {
    const { donor, ngo, amount, message, transactionHash, blockNumber, donorId, ngoId } = req.body;

    const donation = new Donation({
      donor: donor ? donor.toLowerCase() : 'legacy',
      ngo: ngo ? ngo.toLowerCase() : 'legacy',
      amount,
      message,
      transactionHash,
      blockNumber,
      donorId,
      ngoId
    });

    await donation.save();

    // Create donor user if doesn't exist (legacy fallback)
    if (donor) {
      const existingUser = await User.findOne({ walletAddress: donor.toLowerCase() });
      if (!existingUser) {
        const user = new User({
          walletAddress: donor.toLowerCase(),
          role: 'donor',
        });
        await user.save();
      }
    }

    res.status(201).json({ message: 'Donation recorded successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donations by donor wallet (legacy)
const getDonorDonations = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const donations = await Donation.find({ donor: walletAddress.toLowerCase() }).sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Donor
const createDonor = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(`[Backend Log] Attempting to create donor:`, { name, email });
    const donor = await Donor.create({ name, email });
    console.log(`[Backend Log] Successfully created donor:`, donor._id);
    res.status(201).json(donor);
  } catch (error) {
    console.error(`[Backend Error] Failed to create donor:`, error);
    res.status(500).json({ message: error.message, errorDetails: error });
  }
};

// Get All Donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor's transactions explicitly populating NGO name
const getDonorTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const donations = await Donation.find({ donorId: id })
      .populate('ngoId', 'name')
      .sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  recordDonation,
  getDonorDonations,
  createDonor,
  getAllDonors,
  getDonorTransactions
};
