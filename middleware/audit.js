// Audit log middleware
exports.auditLog = (req, res, next) => {
  const startTime = Date.now();
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log audit information
    const auditData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?._id || 'anonymous',
      userRole: req.user?.role || 'guest',
    };
    
    // Log to console (in production, save to database)
    console.log('AUDIT:', JSON.stringify(auditData));
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Sensitive data redaction middleware
exports.redactSensitiveData = (req, res, next) => {
  // Redact sensitive data from request body for logging
  if (req.body) {
    const redactedBody = { ...req.body };
    const sensitiveFields = ['password', 'token', 'secret', 'allotmentNumber'];
    
    sensitiveFields.forEach(field => {
      if (redactedBody[field]) {
        redactedBody[field] = '********';
      }
    });
    
    req.redactedBody = redactedBody;
  }
  
  next();
};