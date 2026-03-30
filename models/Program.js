const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  courseType: {
    type: String,
    enum: ['UG', 'PG'],
    required: true,
  },
  entryType: {
    type: String,
    enum: ['Regular', 'Lateral'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Program', programSchema);