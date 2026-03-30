const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security middleware configuration
exports.securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// XSS protection
exports.xssProtection = xss();

// HTTP Parameter Pollution protection
exports.preventHpp = hpp();

// Additional security headers
exports.secureHeaders = (req, res, next) => {
  // Set additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};