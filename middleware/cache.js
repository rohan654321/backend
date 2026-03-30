const NodeCache = require('node-cache');

// Initialize cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Cache middleware
exports.cache = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    // Store original send function
    const originalSend = res.json;
    
    // Override send function
    res.json = function(body) {
      // Cache the response
      cache.set(key, body, duration);
      // Call original send
      originalSend.call(this, body);
    };
    
    next();
  };
};

// Clear cache for specific pattern
exports.clearCache = (pattern) => {
  const keys = cache.keys();
  const matchedKeys = keys.filter(key => key.includes(pattern));
  matchedKeys.forEach(key => cache.del(key));
};

// Cache statistics middleware
exports.cacheStats = (req, res, next) => {
  if (req.query.debug === 'cache') {
    res.json({
      keys: cache.keys(),
      stats: cache.getStats(),
    });
  } else {
    next();
  }
};