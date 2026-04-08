const express = require('express');
const router = express.Router();
const { registerNGO, getNGOProfile, getNGODonations, getAllNGOs } = require('../controllers/ngoController');

// NGO routes
router.post('/register', registerNGO);
router.get('/', getAllNGOs);
router.get('/:walletAddress', getNGOProfile);
router.get('/:walletAddress/donations', getNGODonations);

module.exports = router;
