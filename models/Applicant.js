const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  dateOfBirth: Date,
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST'],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  documents: {
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Verified'],
      default: 'Pending',
    },
    submittedDate: Date,
    verifiedDate: Date,
    remarks: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Applicant', applicantSchema);