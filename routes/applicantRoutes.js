const express = require('express');
const router = express.Router();
const {
  createApplicant,
  getApplicants,
  getApplicantById,
  updateApplicant,
  updateDocumentStatus,
} = require('../controllers/applicantController');

router.post('/', createApplicant);
router.get('/', getApplicants);
router.get('/:id', getApplicantById);
router.put('/:id', updateApplicant);
router.put('/:id/documents', updateDocumentStatus);

module.exports = router;