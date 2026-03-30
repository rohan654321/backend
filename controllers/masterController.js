const Institution = require('../models/Institution');
const Campus = require('../models/Campus');
const Department = require('../models/Department');
const Program = require('../models/Program');
const AcademicYear = require('../models/AcademicYear');
const SeatMatrix = require('../models/SeatMatrix');

// Institution CRUD
exports.createInstitution = async (req, res) => {
  try {
    const institution = new Institution(req.body);
    await institution.save();
    res.status(201).json({ success: true, data: institution });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ isActive: true });
    res.json({ success: true, data: institutions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Campus CRUD
exports.createCampus = async (req, res) => {
  try {
    const campus = new Campus(req.body);
    await campus.save();
    res.status(201).json({ success: true, data: campus });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getCampuses = async (req, res) => {
  try {
    const campuses = await Campus.find({ isActive: true }).populate('institution', 'name code');
    res.json({ success: true, data: campuses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Department CRUD
exports.createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('campus', 'name code');
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Program CRUD
exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .populate('department', 'name code');
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Academic Year CRUD
exports.createAcademicYear = async (req, res) => {
  try {
    const academicYear = new AcademicYear(req.body);
    await academicYear.save();
    res.status(201).json({ success: true, data: academicYear });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find().sort({ year: -1 });
    res.json({ success: true, data: academicYears });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Seat Matrix Management
exports.createSeatMatrix = async (req, res) => {
  try {
    const seatMatrix = new SeatMatrix(req.body);
    await seatMatrix.save();
    res.status(201).json({ success: true, data: seatMatrix });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSeatMatrices = async (req, res) => {
  try {
    const seatMatrices = await SeatMatrix.find()
      .populate('program', 'name code courseType')
      .populate('academicYear', 'year');
    res.json({ success: true, data: seatMatrices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSeatMatrix = async (req, res) => {
  try {
    const seatMatrix = await SeatMatrix.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!seatMatrix) {
      return res.status(404).json({ success: false, error: 'Seat matrix not found' });
    }
    res.json({ success: true, data: seatMatrix });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};