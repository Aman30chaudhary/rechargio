const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'recharge_portal',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries in console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');
    // Sync models
    // await sequelize.sync({ alter: true }); // Use alter: true in dev to update tables
  } catch (error) {
    console.warn('⚠️  Unable to connect to the database:', error.message);
    // Don't exit - allow app to continue in dev mode without DB
    throw error;
  }
};

module.exports = { sequelize, connectDB };
