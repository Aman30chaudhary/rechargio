const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

// Routes
app.use('/api/recharge', require('./routes/rechargeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    // Sync models (creates tables if they don't exist)
    // In production, use migrations instead of sync
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (err) {
    console.warn('⚠️  Database connection failed (dev mode - continuing without DB):', err.message);
  }

  // Start server regardless of database connection status
  server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`   API: http://localhost:${PORT}`);
  });
};

startServer();

// Attach io to app to use in controllers
app.set('io', io);
