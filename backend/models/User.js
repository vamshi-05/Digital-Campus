const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'departmentAdmin', 'faculty', 'student'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // for faculty, departmentAdmin, student
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // for students
  section: { type: String }, // for students
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 