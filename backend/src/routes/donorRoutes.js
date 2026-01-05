const express = require('express');
const router = express.Router();
const { recordDonation, getDonorDonations } = require('../controllers/donorController');

// Donor routes
router.post('/donate', recordDonation);
router.get('/:walletAddress/donations', getDonorDonations);

module.exports = router;
