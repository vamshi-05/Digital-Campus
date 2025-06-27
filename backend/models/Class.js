const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  program: { type: String, required: true }, // e.g., B.Tech
  specialization: { type: String, required: true }, // e.g., CSE, EEE
  sections: [{
    name: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }],
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timetable: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable' },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema); 