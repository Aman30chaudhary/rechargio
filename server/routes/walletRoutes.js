const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/:userId', walletController.getWalletDetails);
router.post('/add-cashback', walletController.addCashback);

module.exports = router;
