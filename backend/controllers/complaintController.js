const Complaint = require('../models/Complaint');

exports.addComplaint = async (req, res) => {
  try {
    if (!['student', 'faculty'].includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    const { against, type, description } = req.body;
    const complaint = new Complaint({ by: req.user.id, against, type, description });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    if (!['admin', 'departmentAdmin'].includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    const complaints = await Complaint.find().populate('by').populate('against');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOwnComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ by: req.user.id }).populate('against');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 