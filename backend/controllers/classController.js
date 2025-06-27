const Class = require('../models/Class');
const User = require('../models/User');

exports.addClass = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { program, specialization, sections, classTeacher } = req.body;
    const newClass = new Class({ program, specialization, sections, classTeacher });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignClassTeacher = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { classId, teacherId } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(classId, { classTeacher: teacherId }, { new: true });
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 