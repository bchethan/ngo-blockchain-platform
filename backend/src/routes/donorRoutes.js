const express = require('express');
const router = express.Router();
const { recordDonation, getDonorDonations, createDonor, getAllDonors, getDonorTransactions } = require('../controllers/donorController');

// Donor routes
router.post('/donate', recordDonation);
router.get('/:walletAddress/donations', getDonorDonations); // Legacy route
router.post('/create', createDonor);
router.get('/all', getAllDonors);
router.get('/:id/transactions', getDonorTransactions);

module.exports = router;
