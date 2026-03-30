const express = require('express');
const router = express.Router();
const {
  createInstitution,
  getInstitutions,
  createCampus,
  getCampuses,
  createDepartment,
  getDepartments,
  createProgram,
  getPrograms,
  createAcademicYear,
  getAcademicYears,
  createSeatMatrix,
  getSeatMatrices,
  updateSeatMatrix,
} = require('../controllers/masterController');

// Institution routes
router.post('/institutions', createInstitution);
router.get('/institutions', getInstitutions);

// Campus routes
router.post('/campuses', createCampus);
router.get('/campuses', getCampuses);

// Department routes
router.post('/departments', createDepartment);
router.get('/departments', getDepartments);

// Program routes
router.post('/programs', createProgram);
router.get('/programs', getPrograms);

// Academic Year routes
router.post('/academic-years', createAcademicYear);
router.get('/academic-years', getAcademicYears);

// Seat Matrix routes
router.post('/seat-matrices', createSeatMatrix);
router.get('/seat-matrices', getSeatMatrices);
router.put('/seat-matrices/:id', updateSeatMatrix);

module.exports = router;