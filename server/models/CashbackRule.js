const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CashbackRule = sequelize.define('CashbackRule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  minAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cashbackPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = CashbackRule;
