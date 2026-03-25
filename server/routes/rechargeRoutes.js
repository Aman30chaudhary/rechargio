const express = require('express');
const router = express.Router();
const rechargeController = require('../controllers/rechargeController');

router.post('/detect-operator', rechargeController.detectOperator);
router.post('/create-order', rechargeController.createOrder);
router.post('/verify-payment', rechargeController.verifyPayment);
router.get('/offers/:operator', rechargeController.getOffers);

module.exports = router;
