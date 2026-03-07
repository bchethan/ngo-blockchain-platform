const express = require('express');
const router = express.Router();
const { getAllNGOs, getVerifiedNGOs, verifyNGO, getAllDonations } = require('../controllers/adminController');

// Admin routes (Authentication bypassed for demo functionality)
router.get('/ngos', getAllNGOs);
router.get('/ngos/verified', getVerifiedNGOs); // Public
router.post('/ngos/verify', verifyNGO);
router.get('/donations', getAllDonations);

module.exports = router;
