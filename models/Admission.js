const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
    unique: true, // One applicant can have only one admission
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true,
  },
  quota: {
    name: {
      type: String,
      enum: ['KCET', 'COMEDK', 'Management'],
      required: true,
    },
    allotmentNumber: {
      type: String,
      sparse: true,
    },
  },
  admissionNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  feeStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Allocated', 'Confirmed', 'Cancelled'],
    default: 'Allocated',
  },
  allocatedDate: {
    type: Date,
    default: Date.now,
  },
  confirmedDate: Date,
}, {
  timestamps: true,
});

// Compound index for program and quota to check availability
admissionSchema.index({ program: 1, 'quota.name': 1 });

module.exports = mongoose.model('Admission', admissionSchema);