require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Import security middleware
const { 
  helmetConfig, 
  limiter, 
  authLimiter, 
  mongoSanitizeConfig, 
  hppConfig 
} = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const roomRoutes = require('./routes/rooms');
const feeRoutes = require('./routes/fees');
const complaintRoutes = require('./routes/complaints');
const attendanceRoutes = require('./routes/attendance');
const noticeRoutes = require('./routes/notices');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy - needed for rate limiting behind proxies/load balancers
app.set('trust proxy', 1);

// Security Middleware (applied first)
app.use(helmetConfig); // Set security HTTP headers
app.use(mongoSanitizeConfig); // Prevent MongoDB injection
app.use(hppConfig); // Prevent HTTP Parameter Pollution

// General rate limiter for all routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/auth', authLimiter, authRoutes); // Apply stricter rate limit to auth
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});

// Handle port already in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('\n🔧 Solutions:');
    console.log('1. Kill the process: lsof -ti:' + PORT + ' | xargs kill -9');
    console.log('2. Change PORT in .env file');
    console.log('3. Use different port: PORT=5002 node server.js\n');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
