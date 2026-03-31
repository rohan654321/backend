const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const helmet = require('helmet');
const hpp = require('hpp');

// Import middleware
const { logger, errorLogger } = require('./middleware/logger');
const { apiLimiter, authLimiter, allocationLimiter } = require('./middleware/rateLimiter');
const { corsOptions } = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const { auditLog, redactSensitiveData } = require('./middleware/audit');
const { cache } = require('./middleware/cache');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  xssFilter: true,
}));
app.use(hpp());
app.use(cors(corsOptions));

// Logging middleware
app.use(logger);
app.use(redactSensitiveData);
app.use(auditLog);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes - IMPORTANT: Make sure these are mounted correctly
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/applicants', require('./routes/applicantRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes')); // This should be /api/dashboard

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// 404 handler - This should be last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    error: `Route not found: ${req.method} ${req.url}` 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
});