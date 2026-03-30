const Counter = require('../models/Counter');

const generateAdmissionNumber = async (institutionCode, academicYear, courseType, departmentCode, quotaName) => {
  try {
    const prefix = `${institutionCode}/${academicYear}/${courseType}/${departmentCode}/${quotaName}`;
    
    const counter = await Counter.findByIdAndUpdate(
      prefix,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    const sequenceNumber = counter.seq.toString().padStart(4, '0');
    return `${prefix}/${sequenceNumber}`;
  } catch (error) {
    throw new Error(`Failed to generate admission number: ${error.message}`);
  }
};

module.exports = generateAdmissionNumber;