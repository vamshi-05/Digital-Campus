const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.markAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Access denied' });
    const { student, subject, class: classId, date, status } = req.body;
    const attendance = new Attendance({ faculty: req.user.id, student, subject, class: classId, date, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    // Admin can get all, faculty can get their own
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user.id;
    if (req.query.class) filter.class = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.student) filter.student = req.query.student;
    const records = await Attendance.find(filter).populate('student').populate('subject').populate('class');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 