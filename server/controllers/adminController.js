const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const CashbackRule = require('../models/CashbackRule');
const PopupOffer = require('../models/PopupOffer');
const { sequelize } = require('../config/database');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTransactions = await Transaction.count();
    const revenue = await Transaction.sum('adminProfit', { where: { status: 'success' } }) || 0;
    
    const statusCountsRaw = await Transaction.findAll({
      attributes: ['status', [sequelize.fn('count', sequelize.col('status')), 'count']],
      group: ['status']
    });

    const statusCounts = statusCountsRaw.reduce((acc, curr) => ({
      ...acc,
      [curr.status]: parseInt(curr.getDataValue('count'))
    }), {});
    
    res.status(200).json({
      totalUsers,
      totalTransactions,
      revenue,
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const transactions = await Transaction.findAll({
      where,
      include: [{ model: User, attributes: ['email', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { distributorMargin } = req.body;
    const settings = await AdminSettings.create({ 
      distributorMargin, 
      lastUpdatedBy: req.user.id 
    });
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings', error: err.message });
  }
};

exports.createCashbackRule = async (req, res) => {
  try {
    const rule = await CashbackRule.create(req.body);
    res.status(200).json(rule);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create cashback rule', error: err.message });
  }
};

exports.createPopupOffer = async (req, res) => {
  try {
    const offer = await PopupOffer.create(req.body);
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create popup offer', error: err.message });
  }
};
