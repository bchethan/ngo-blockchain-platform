const Donation = require('../models/Donation');
const User = require('../models/User');

// Record donation (called after blockchain transaction)
const recordDonation = async (req, res) => {
  try {
    const { donor, ngo, amount, message, transactionHash, blockNumber } = req.body;

    const donation = new Donation({
      donor: donor.toLowerCase(),
      ngo: ngo.toLowerCase(),
      amount,
      message,
      transactionHash,
      blockNumber,
    });

    await donation.save();

    // Create donor user if doesn't exist
    const existingUser = await User.findOne({ walletAddress: donor.toLowerCase() });
    if (!existingUser) {
      const user = new User({
        walletAddress: donor.toLowerCase(),
        role: 'donor',
      });
      await user.save();
    }

    res.status(201).json({ message: 'Donation recorded successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donations by donor
const getDonorDonations = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const donations = await Donation.find({ donor: walletAddress.toLowerCase() }).sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  recordDonation,
  getDonorDonations,
};
