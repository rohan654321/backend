const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Import middleware
const { logger, errorLogger } = require('./middleware/logger');
const { securityHeaders, xssProtection, preventHpp, secureHeaders } = require('./middleware/security');
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

// Security middleware (order matters!)
app.use(securityHeaders);
app.use(xssProtection);
app.use(preventHpp);
app.use(secureHeaders);
app.use(cors(corsOptions));

// Logging middleware
app.use(logger);
app.use(redactSensitiveData);
app.use(auditLog);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter); // General rate limit for all API routes
app.use('/api/auth/', authLimiter); // Stricter limit for auth routes
app.use('/api/allocations/', allocationLimiter); // Limit for allocation operations

// Cache middleware (apply to specific routes in routes files)

// Routes
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/applicants', require('./routes/applicantRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/dashboard', cache(300), require('./routes/dashboardRoutes')); // Cache dashboard for 5 minutes

// Error handling middleware (should be last)
app.use(errorLogger);
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});