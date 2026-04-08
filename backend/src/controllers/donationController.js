const Donation = require('../models/Donation');

// Get donations by specific NGO ID explicitly populating Donor and NGO data
const getDonationsByNgoId = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const donations = await Donation.find({ ngoId })
      .populate('donorId', 'name email')
      .populate('ngoId', 'name')
      .sort({ timestamp: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDonationsByNgoId
};
