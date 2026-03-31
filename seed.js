const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');

// Import all models
const AcademicYear = require('./models/AcademicYear');
const Institution = require('./models/Institution');
const Campus = require('./models/Campus');
const Department = require('./models/Department');
const Program = require('./models/Program');
const SeatMatrix = require('./models/SeatMatrix');
const Applicant = require('./models/Applicant');
const Admission = require('./models/Admission');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old data...');
    await AcademicYear.deleteMany();
    await Institution.deleteMany();
    await Campus.deleteMany();
    await Department.deleteMany();
    await Program.deleteMany();
    await SeatMatrix.deleteMany();
    await Applicant.deleteMany();
    await Admission.deleteMany();

    console.log('🌱 Seeding data...');

    // 1️⃣ Academic Year
    const academicYear = await AcademicYear.create({
      year: '2025-26',
      isActive: true,
    });

    // 2️⃣ Institution
    const institution = await Institution.create({
      name: 'ABC Engineering College',
      code: 'ABC',
      isActive: true,
    });

    // 3️⃣ Campus
    const campus = await Campus.create({
      name: 'Main Campus',
      code: 'MC',
      institution: institution._id,
      isActive: true,
    });

    // 4️⃣ Department
    const department = await Department.create({
      name: 'Computer Science',
      code: 'CSE',
      campus: campus._id,
      isActive: true,
    });

    // 5️⃣ Program
    const program = await Program.create({
      name: 'BTech CSE',
      code: 'CSE01',
      department: department._id,
      courseType: 'UG',
      entryType: 'Regular',
      duration: 4,
      isActive: true,
    });

    // 6️⃣ Seat Matrix
    const seatMatrix = await SeatMatrix.create({
      program: program._id,
      academicYear: academicYear._id,
      totalIntake: 60,
      quotas: [
        { name: 'KCET', totalSeats: 30, filledSeats: 10 },
        { name: 'COMEDK', totalSeats: 20, filledSeats: 5 },
        { name: 'Management', totalSeats: 10, filledSeats: 2 },
      ],
    });

    // 7️⃣ Applicant
    const applicant = await Applicant.create({
      firstName: 'Rohan',
      lastName: 'Mondal',
      email: 'rohan@test.com',
      category: 'General',
      marks: 85,
      documents: {
        status: 'Pending',
      },
    });

    // 8️⃣ Admission
    await Admission.create({
      applicant: applicant._id,
      program: program._id,
      academicYear: academicYear._id,
      quota: {
        name: 'KCET',
      },
      feeStatus: 'Pending',
      status: 'Allocated',
    });

    console.log('✅ Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();