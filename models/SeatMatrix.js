const mongoose = require('mongoose');

const quotaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['KCET', 'COMEDK', 'Management'],
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  filledSeats: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const seatMatrixSchema = new mongoose.Schema({
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
  quotas: [quotaSchema],
  totalIntake: {
    type: Number,
    required: true,
    validate: {
      validator: function() {
        const totalQuotaSeats = this.quotas.reduce((sum, q) => sum + q.totalSeats, 0);
        return totalQuotaSeats === this.totalIntake;
      },
      message: 'Total quota seats must equal total intake',
    },
  },
}, {
  timestamps: true,
});

// Ensure unique combination of program and academic year
seatMatrixSchema.index({ program: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('SeatMatrix', seatMatrixSchema);