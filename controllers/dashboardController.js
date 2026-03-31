const mongoose = require('mongoose');
const Admission = require('../models/Admission');
const SeatMatrix = require('../models/SeatMatrix');
const Applicant = require('../models/Applicant');
const AcademicYear = require('../models/AcademicYear');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    const academicYear = await AcademicYear.findOne({ isActive: true });
    if (!academicYear) {
      return res.status(404).json({ 
        success: false, 
        error: 'No active academic year found' 
      });
    }
    
    console.log('Academic year found:', academicYear.year);
    
    // Get all seat matrices for current academic year
    const seatMatrices = await SeatMatrix.find({ academicYear: academicYear._id })
      .populate('program', 'name code');
    
    console.log(`Found ${seatMatrices.length} seat matrices`);
    
    // Calculate total intake and admitted
    let totalIntake = 0;
    let totalAdmitted = 0;
    const quotaStats = {
      KCET: { total: 0, filled: 0 },
      COMEDK: { total: 0, filled: 0 },
      Management: { total: 0, filled: 0 },
    };
    
    seatMatrices.forEach(matrix => {
      totalIntake += matrix.totalIntake;
      
      matrix.quotas.forEach(quota => {
        quotaStats[quota.name].total += quota.totalSeats;
        quotaStats[quota.name].filled += quota.filledSeats;
        totalAdmitted += quota.filledSeats;
      });
    });
    
    // Get pending documents count
    const pendingDocuments = await Applicant.countDocuments({
      'documents.status': 'Pending',
    });
    
    // Get fee pending list
    const feePending = await Admission.find({ feeStatus: 'Pending' })
      .populate('applicant', 'firstName lastName email')
      .populate('program', 'name code')
      .limit(10)
      .sort({ createdAt: -1 });
    
    console.log('Dashboard stats fetched successfully');
    
    res.json({
      success: true,
      data: {
        totalIntake,
        totalAdmitted,
        remainingSeats: totalIntake - totalAdmitted,
        quotaStats,
        pendingDocuments,
        feePending,
        seatMatrices,
      },
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getQuotaUtilization = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findOne({ isActive: true });
    if (!academicYear) {
      return res.status(404).json({ 
        success: false, 
        error: 'No active academic year found' 
      });
    }
    
    const seatMatrices = await SeatMatrix.find({ academicYear: academicYear._id })
      .populate('program', 'name code');
    
    const utilization = seatMatrices.map(matrix => ({
      program: matrix.program.name,
      quotas: matrix.quotas.map(quota => ({
        name: quota.name,
        total: quota.totalSeats,
        filled: quota.filledSeats,
        remaining: quota.totalSeats - quota.filledSeats,
        percentage: (quota.filledSeats / quota.totalSeats) * 100,
      })),
    }));
    
    res.json({
      success: true,
      data: utilization,
    });
  } catch (error) {
    console.error('Error in getQuotaUtilization:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};