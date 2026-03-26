const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: String,
    required: true,
    lowercase: true,
  },
  ngo: {
    type: String,
    required: true,
    lowercase: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
  },
  amount: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);
