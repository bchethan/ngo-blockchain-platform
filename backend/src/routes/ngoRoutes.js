const express = require('express');
const router = express.Router();
const { registerNGO, getNGOProfile, getNGODonations } = require('../controllers/ngoController');

// NGO routes
router.post('/register', registerNGO);
router.get('/:walletAddress', getNGOProfile);
router.get('/:walletAddress/donations', getNGODonations);

module.exports = router;
