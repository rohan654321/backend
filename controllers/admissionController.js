const mongoose = require('mongoose');
const Admission = require('../models/Admission');
const Institution = require('../models/Institution');
const Program = require('../models/Program');
const generateAdmissionNumber = require('../utils/admissionNumberGenerator');

exports.updateFeeStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { feeStatus } = req.body;
    const admissionId = req.params.id;
    
    const admission = await Admission.findById(admissionId)
      .populate('applicant')
      .populate('program')
      .populate('academicYear')
      .session(session);
    
    if (!admission) {
      throw new Error('Admission not found');
    }
    
    // Update fee status
    admission.feeStatus = feeStatus;
    
    // If fee is paid and admission number doesn't exist, generate it
    if (feeStatus === 'Paid' && !admission.admissionNumber) {
      // Get institution details
      const program = await Program.findById(admission.program)
        .populate({
          path: 'department',
          populate: {
            path: 'campus',
            populate: {
              path: 'institution',
            },
          },
        });
      
      const institution = program.department.campus.institution;
      const academicYear = admission.academicYear.year;
      const courseType = program.courseType;
      const departmentCode = program.department.code;
      const quotaName = admission.quota.name;
      
      admission.admissionNumber = await generateAdmissionNumber(
        institution.code,
        academicYear,
        courseType,
        departmentCode,
        quotaName
      );
      admission.status = 'Confirmed';
      admission.confirmedDate = new Date();
    }
    
    await admission.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({
      success: true,
      data: admission,
      message: 'Fee status updated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAdmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, feeStatus } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (feeStatus) query.feeStatus = feeStatus;
    
    const admissions = await Admission.find(query)
      .populate('applicant', 'firstName lastName email')
      .populate('program', 'name code courseType')
      .populate('academicYear', 'year')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Admission.countDocuments(query);
    
    res.json({
      success: true,
      data: admissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate('applicant')
      .populate('program')
      .populate('academicYear');
    
    if (!admission) {
      return res.status(404).json({ success: false, error: 'Admission not found' });
    }
    
    res.json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};