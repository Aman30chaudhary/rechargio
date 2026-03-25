const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  serviceType: {
    type: DataTypes.STRING,
    defaultValue: 'Mobile'
  },
  serviceDetails: {
    type: DataTypes.JSON, // Use JSON for service-specific fields
    allowNull: true
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  operator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('success', 'pending', 'failed'),
    defaultValue: 'pending'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  distributorMargin: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  adminProfit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  cashbackEarned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  timestamps: true
});

// Relationships
Transaction.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });

module.exports = Transaction;
