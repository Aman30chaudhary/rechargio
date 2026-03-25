const Transaction = require('../models/Transaction');
const User = require('../models/User');
const CashbackRule = require('../models/CashbackRule');
const PopupOffer = require('../models/PopupOffer');
const { Op } = require('sequelize');

exports.getWalletDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const transactions = await Transaction.findAll({ 
      where: { userId }, 
      order: [['createdAt', 'DESC']] 
    });
    
    const popupOffers = await PopupOffer.findAll({ 
      where: { isActive: true }, 
      order: [['createdAt', 'DESC']] 
    });
    
    res.status(200).json({ balance: user.walletBalance, transactions, popupOffers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wallet details', error: err.message });
  }
};

exports.addCashback = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Apply cashback rule logic
    const rule = await CashbackRule.findOne({ 
      where: { 
        minAmount: { [Op.lte]: amount }, 
        isActive: true 
      }, 
      order: [['minAmount', 'DESC']] 
    });
    
    if (rule) {
      const cashback = (amount * rule.cashbackPercent) / 100;
      await User.increment({ walletBalance: cashback }, { where: { id: userId } });
      const updatedUser = await User.findByPk(userId);
      res.status(200).json({ message: 'Cashback added', cashback, balance: updatedUser.walletBalance });
    } else {
      res.status(200).json({ message: 'No cashback rule applies' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add cashback', error: err.message });
  }
};
