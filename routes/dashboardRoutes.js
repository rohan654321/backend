const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getQuotaUtilization,
} = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/quota-utilization', getQuotaUtilization);

module.exports = router;