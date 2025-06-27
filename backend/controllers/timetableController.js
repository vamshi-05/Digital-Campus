const Timetable = require('../models/Timetable');
const Class = require('../models/Class');

exports.addTimetable = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { classId, schedule } = req.body;
    const timetable = new Timetable({ class: classId, schedule });
    await timetable.save();
    await Class.findByIdAndUpdate(classId, { timetable: timetable._id });
    res.status(201).json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const timetable = await Timetable.findOne({ class: classId });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 