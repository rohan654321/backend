const mongoose = require('mongoose');
const Admission = require('../models/Admission');
const SeatMatrix = require('../models/SeatMatrix');
const Applicant = require('../models/Applicant');
const Program = require('../models/Program');
const AcademicYear = require('../models/AcademicYear');
const generateAdmissionNumber = require('../utils/admissionNumberGenerator');

exports.allocateGovernmentSeat = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { applicantId, programId, quotaName, allotmentNumber } = req.body;
    
    // Validate allotment number for government quota
    if (!allotmentNumber) {
      throw new Error('Allotment number is required for government quota');
    }
    
    // Get current academic year
    const academicYear = await AcademicYear.findOne({ isActive: true });
    if (!academicYear) {
      throw new Error('No active academic year found');
    }
    
    // Check if applicant already has admission
    const existingAdmission = await Admission.findOne({ applicant: applicantId });
    if (existingAdmission) {
      throw new Error('Applicant already has an admission');
    }
    
    // Get seat matrix and check availability
    const seatMatrix = await SeatMatrix.findOne({
      program: programId,
      academicYear: academicYear._id,
    }).session(session);
    
    if (!seatMatrix) {
      throw new Error('Seat matrix not found for this program and academic year');
    }
    
    const quota = seatMatrix.quotas.find(q => q.name === quotaName);
    if (!quota) {
      throw new Error('Quota not found');
    }
    
    if (quota.filledSeats >= quota.totalSeats) {
      throw new Error(`${quotaName} quota is full`);
    }
    
    // Increment filled seats
    await SeatMatrix.updateOne(
      { _id: seatMatrix._id, 'quotas.name': quotaName },
      { $inc: { 'quotas.$.filledSeats': 1 } },
      { session }
    );
    
    // Create admission record
    const admission = new Admission({
      applicant: applicantId,
      program: programId,
      academicYear: academicYear._id,
      quota: {
        name: quotaName,
        allotmentNumber,
      },
      status: 'Allocated',
    });
    
    await admission.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: admission,
      message: 'Seat allocated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.allocateManagementSeat = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { applicantId, programId, quotaName } = req.body;
    
    // Validate quota name is Management
    if (quotaName !== 'Management') {
      throw new Error('Invalid quota for management allocation');
    }
    
    // Get current academic year
    const academicYear = await AcademicYear.findOne({ isActive: true });
    if (!academicYear) {
      throw new Error('No active academic year found');
    }
    
    // Check if applicant already has admission
    const existingAdmission = await Admission.findOne({ applicant: applicantId });
    if (existingAdmission) {
      throw new Error('Applicant already has an admission');
    }
    
    // Get seat matrix and check availability
    const seatMatrix = await SeatMatrix.findOne({
      program: programId,
      academicYear: academicYear._id,
    }).session(session);
    
    if (!seatMatrix) {
      throw new Error('Seat matrix not found for this program and academic year');
    }
    
    const quota = seatMatrix.quotas.find(q => q.name === quotaName);
    if (!quota) {
      throw new Error('Quota not found');
    }
    
    if (quota.filledSeats >= quota.totalSeats) {
      throw new Error(`${quotaName} quota is full`);
    }
    
    // Increment filled seats
    await SeatMatrix.updateOne(
      { _id: seatMatrix._id, 'quotas.name': quotaName },
      { $inc: { 'quotas.$.filledSeats': 1 } },
      { session }
    );
    
    // Create admission record
    const admission = new Admission({
      applicant: applicantId,
      program: programId,
      academicYear: academicYear._id,
      quota: {
        name: quotaName,
      },
      status: 'Allocated',
    });
    
    await admission.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: admission,
      message: 'Seat allocated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, error: error.message });
  }
};