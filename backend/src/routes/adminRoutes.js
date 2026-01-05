const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { getAllNGOs, getVerifiedNGOs, verifyNGO, getAllDonations } = require('../controllers/adminController');

// Admin routes
router.get('/ngos', authMiddleware, adminOnly, getAllNGOs);
router.get('/ngos/verified', getVerifiedNGOs); // Public
router.post('/ngos/verify', authMiddleware, adminOnly, verifyNGO);
router.get('/donations', authMiddleware, adminOnly, getAllDonations);

module.exports = router;
