const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema); 