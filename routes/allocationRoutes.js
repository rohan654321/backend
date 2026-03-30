const express = require('express');
const router = express.Router();
const {
  allocateGovernmentSeat,
  allocateManagementSeat,
} = require('../controllers/allocationController');

router.post('/government', allocateGovernmentSeat);
router.post('/management', allocateManagementSeat);

module.exports = router;