const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const CashbackRule = require('../models/CashbackRule');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const detectOperatorLogic = (mobileNumber) => {
  // Enhanced simulation logic based on common Indian mobile number series
  const firstDigit = mobileNumber[0];
  const firstTwo = mobileNumber.substring(0, 2);
  
  if (['9', '8'].includes(firstDigit) && ['98', '99', '80', '81'].includes(firstTwo)) return 'Airtel';
  if (['7', '6'].includes(firstDigit) && ['70', '60', '77', '66'].includes(firstTwo)) return 'Jio';
  if (['9', '8'].includes(firstDigit) && ['91', '97', '88', '89'].includes(firstTwo)) return 'VI';
  if (['9', '7'].includes(firstDigit) && ['94', '75', '90', '73'].includes(firstTwo)) return 'BSNL';
  
  return 'Airtel'; // default
};

exports.detectOperator = catchAsync(async (req, res, next) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber || mobileNumber.length < 4) {
    return next(new AppError('Mobile number too short for detection', 400));
  }
  const operator = detectOperatorLogic(mobileNumber);
  res.status(200).json({ operator });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) return next(new AppError('Amount is required', 400));

  const options = {
    amount: amount * 100, // razorpay expects in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
  
  const order = await razorpay.orders.create(options);
  res.status(200).json(order);
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, service, details, userId } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError('Payment details missing', 400));
  }

  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return next(new AppError('Invalid payment signature', 400));
  }

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

  res.status(200).json({
    status: success ? 'success' : 'failed',
    transactionId: transaction.id,
    cashbackEarned: cashbackAmount
  });
});

exports.getOffers = catchAsync(async (req, res, next) => {
  const { operator } = req.params;
  
  // Simulation: Return different offers based on operator
  const baseOffers = [
    { id: 1, title: 'Super Saver Plan', description: 'Unlimited calls + 2GB/day + 100 SMS/day', price: 299, validity: '28 Days' },
    { id: 2, title: 'Data Booster', description: '50GB high-speed data for your streaming needs', price: 199, validity: 'Existing' },
    { id: 3, title: 'Value Pack', description: '₹100 Talktime + 1GB Data', price: 99, validity: '15 Days' },
    { id: 4, title: 'Cricket Pack', description: 'Disney+ Hotstar Subscription + 3GB/day', price: 499, validity: '56 Days' },
    { id: 5, title: 'Work From Home', description: 'Unlimited Data (capped at 5GB/day)', price: 251, validity: '30 Days' },
  ];

  // Randomize prices slightly for simulation
  const offers = baseOffers.map(o => ({
    ...o,
    price: o.price + (operator.length % 5) * 10
  }));

  res.status(200).json(offers);
});
