const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const AdminSettings = sequelize.define('AdminSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  distributorMargin: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  lastUpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'AdminSettings' // Match name if needed
});

AdminSettings.belongsTo(User, { as: 'Updater', foreignKey: 'lastUpdatedBy' });

module.exports = AdminSettings;
