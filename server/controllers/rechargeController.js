const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const CashbackRule = require('../models/CashbackRule');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Op } = require('sequelize');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const detectOperator = (mobileNumber) => {
  // Enhanced simulation logic based on common Indian mobile number series
  const firstDigit = mobileNumber[0];
  const firstTwo = mobileNumber.substring(0, 2);
  
  if (['9', '8'].includes(firstDigit) && ['98', '99', '80', '81'].includes(firstTwo)) return 'Airtel';
  if (['7', '6'].includes(firstDigit) && ['70', '60', '77', '66'].includes(firstTwo)) return 'Jio';
  if (['9', '8'].includes(firstDigit) && ['91', '97', '88', '89'].includes(firstTwo)) return 'VI';
  if (['9', '7'].includes(firstDigit) && ['94', '75', '90', '73'].includes(firstTwo)) return 'BSNL';
  
  return 'Airtel'; // default
};

exports.detectOperator = async (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber || mobileNumber.length < 4) {
    return res.status(400).json({ message: 'Mobile number too short for detection' });
  }
  const operator = detectOperator(mobileNumber);
  res.status(200).json({ operator });
};

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // razorpay expects in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, service, details, userId } = req.body;
  
  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      // Payment verified, now simulate service processing
      const success = Math.random() < 0.95; // 95% success rate for all services
      
      // Get margin from admin settings
      const settings = await AdminSettings.findOne({ order: [['updatedAt', 'DESC']] }) || { distributorMargin: 5 }; // default 5%
      const adminProfit = (amount * settings.distributorMargin) / 100;
      
      // Check for cashback rules
      let cashbackAmount = 0;
      const rules = await CashbackRule.findAll({ 
        where: { 
          isActive: true, 
          minAmount: { [Op.lte]: amount } 
        },
        order: [['minAmount', 'DESC']]
      });
      
      if (rules.length > 0) {
        cashbackAmount = (amount * rules[0].cashbackPercent) / 100;
      }

      const transaction = await Transaction.create({
        userId,
        amount,
        serviceType: service || 'Mobile',
        serviceDetails: details,
        mobileNumber: details.mobileNumber || details.phoneNumber || details.accountNumber || details.consumerNumber || details.cardNumber || details.subscriberId || details.consumerId,
        operator: details.operator || details.board || 'Other',
        status: success ? 'success' : 'failed',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        distributorMargin: settings.distributorMargin,
        adminProfit: adminProfit,
        cashbackEarned: success ? cashbackAmount : 0,
      });

      if (success && cashbackAmount > 0) {
        // Update user wallet
        await User.increment({ walletBalance: cashbackAmount }, { where: { id: userId } });
      }

      // Notify user via socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit('transactionUpdate', transaction);
      }

      res.status(200).json({ status: success ? 'success' : 'failed', transaction });
    } catch (dbErr) {
      console.error('Database error in verifyPayment:', dbErr);
      res.status(500).json({ message: 'Error processing transaction', error: dbErr.message });
    }
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
};

exports.getOffers = async (req, res) => {
  try {
    const { operator } = req.params;
    
    // Mock offers for different operators
    const allOffers = {
      'Airtel': [
        { id: 1, title: 'Airtel Saver', price: 199, description: '1.5GB/day + Unlimited Calls', validity: '28 Days' },
        { id: 2, title: 'Airtel Booster', price: 49, description: '6GB Data Pack', validity: 'Existing' },
        { id: 3, title: 'Airtel Family', price: 599, description: '100GB Data + 4 Connections', validity: '30 Days' },
        { id: 4, title: 'Airtel WFH', price: 251, description: '50GB Data Pack', validity: '28 Days' },
      ],
      'Jio': [
        { id: 1, title: 'Jio Super', price: 239, description: '1.5GB/day + Unlimited Calls', validity: '28 Days' },
        { id: 2, title: 'Jio Data', price: 61, description: '6GB Data Pack', validity: 'Existing' },
        { id: 3, title: 'Jio Happy', price: 666, description: '1.5GB/day + Unlimited Calls', validity: '84 Days' },
        { id: 4, title: 'Jio Cricket', price: 499, description: '3GB/day + Disney+ Hotstar', validity: '28 Days' },
      ],
      'VI': [
        { id: 1, title: 'VI Hero', price: 299, description: '1.5GB/day + Weekend Rollover', validity: '28 Days' },
        { id: 2, title: 'VI Data', price: 58, description: '3GB Data Pack', validity: 'Existing' },
        { id: 3, title: 'VI Unlimited', price: 479, description: '1.5GB/day + Unlimited Calls', validity: '56 Days' },
        { id: 4, title: 'VI Binge', price: 359, description: '2GB/day + Binge All Night', validity: '28 Days' },
      ],
      'BSNL': [
        { id: 1, title: 'BSNL PV', price: 107, description: '3GB Data + 200 mins Calls', validity: '40 Days' },
        { id: 2, title: 'BSNL Data', price: 98, description: '2GB/day Data Pack', validity: '22 Days' },
        { id: 3, title: 'BSNL Voice', price: 187, description: '2GB/day + Unlimited Calls', validity: '28 Days' },
        { id: 4, title: 'BSNL Annual', price: 1999, description: '600GB Data + Unlimited Calls', validity: '365 Days' },
      ]
    };

    const offers = allOffers[operator] || allOffers['Airtel']; // Fallback to Airtel if operator not found
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offers', error: err.message });
  }
};
