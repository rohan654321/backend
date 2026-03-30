const { body, validationResult } = require('express-validator');

// Validation rules for different entities

// Applicant validation
exports.validateApplicant = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('category').isIn(['General', 'OBC', 'SC', 'ST']).withMessage('Invalid category'),
  body('marks').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
];

// Institution validation
exports.validateInstitution = [
  body('name').notEmpty().withMessage('Institution name is required'),
  body('code').notEmpty().withMessage('Institution code is required'),
  body('code').isLength({ min: 2, max: 10 }).withMessage('Code must be 2-10 characters'),
];

// Program validation
exports.validateProgram = [
  body('name').notEmpty().withMessage('Program name is required'),
  body('code').notEmpty().withMessage('Program code is required'),
  body('department').notEmpty().withMessage('Department ID is required'),
  body('courseType').isIn(['UG', 'PG']).withMessage('Course type must be UG or PG'),
  body('entryType').isIn(['Regular', 'Lateral']).withMessage('Entry type must be Regular or Lateral'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
];

// Seat Matrix validation
exports.validateSeatMatrix = [
  body('program').notEmpty().withMessage('Program ID is required'),
  body('academicYear').notEmpty().withMessage('Academic Year ID is required'),
  body('quotas').isArray().withMessage('Quotas must be an array'),
  body('quotas.*.name').isIn(['KCET', 'COMEDK', 'Management']).withMessage('Invalid quota name'),
  body('quotas.*.totalSeats').isInt({ min: 0 }).withMessage('Total seats must be a positive integer'),
  body('totalIntake').isInt({ min: 1 }).withMessage('Total intake must be a positive integer'),
];

// Allocation validation
exports.validateGovernmentAllocation = [
  body('applicantId').notEmpty().withMessage('Applicant ID is required'),
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('quotaName').isIn(['KCET', 'COMEDK']).withMessage('Invalid quota for government allocation'),
  body('allotmentNumber').notEmpty().withMessage('Allotment number is required'),
];

exports.validateManagementAllocation = [
  body('applicantId').notEmpty().withMessage('Applicant ID is required'),
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('quotaName').equals('Management').withMessage('Quota must be Management'),
];

// Fee update validation
exports.validateFeeUpdate = [
  body('feeStatus').isIn(['Pending', 'Paid']).withMessage('Fee status must be Pending or Paid'),
];

// Document status validation
exports.validateDocumentStatus = [
  body('status').isIn(['Pending', 'Submitted', 'Verified']).withMessage('Invalid document status'),
];

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};