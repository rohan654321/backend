const express = require('express');
const router = express.Router();
const {
  updateFeeStatus,
  getAdmissions,
  getAdmissionById,
} = require('../controllers/admissionController');

router.get('/', getAdmissions);
router.get('/:id', getAdmissionById);
router.put('/:id/fee', updateFeeStatus);

module.exports = router;