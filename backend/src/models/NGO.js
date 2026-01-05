const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  registrationId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ipfsDocHash: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('NGO', ngoSchema);
