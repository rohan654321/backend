const Applicant = require('../models/Applicant');

exports.createApplicant = async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.status(201).json({ success: true, data: applicant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    
    if (status) {
      query['documents.status'] = status;
    }
    
    const applicants = await Applicant.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Applicant.countDocuments(query);
    
    res.json({
      success: true,
      data: applicants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ success: false, error: 'Applicant not found' });
    }
    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!applicant) {
      return res.status(404).json({ success: false, error: 'Applicant not found' });
    }
    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = {
      'documents.status': status,
    };
    
    if (status === 'Submitted') {
      updateData['documents.submittedDate'] = new Date();
    } else if (status === 'Verified') {
      updateData['documents.verifiedDate'] = new Date();
    }
    
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!applicant) {
      return res.status(404).json({ success: false, error: 'Applicant not found' });
    }
    
    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};