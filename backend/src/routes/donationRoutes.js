const express = require('express');
const router = express.Router();
const { getDonationsByNgoId } = require('../controllers/donationController');

// Donation routes
router.get('/ngo/:ngoId', getDonationsByNgoId);

module.exports = router;
