const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const ipWhitelistMiddleware = require('../middleware/ipWhitelist');
const { adminAuth } = require('../middleware/auth');

// Rate limiting for admin routes (max 100 requests per 15 mins)
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply security middleware to all admin routes
router.use(ipWhitelistMiddleware);
router.use(adminRateLimiter);
router.use(adminAuth);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/transactions', adminController.getTransactions);
router.post('/settings', adminController.updateSettings);
router.post('/cashback-rules', adminController.createCashbackRule);
router.post('/popup-offers', adminController.createPopupOffer);

module.exports = router;
