const Subject = require('../models/Subject');
const User = require('../models/User');

exports.addSubject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { name, code, department, faculty, classes } = req.body;
    const subject = new Subject({ name, code, department, faculty, classes });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('faculty').populate('department');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignFaculty = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { subjectId, facultyId } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, { $addToSet: { faculty: facultyId } }, { new: true });
    res.json(updatedSubject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 