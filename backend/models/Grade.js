const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  faculty: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  semester: { 
    type: String, 
    required: true 
  },
  academicYear: { 
    type: String, 
    required: true 
  },
  gradeType: { 
    type: String, 
    enum: ['assignment', 'midterm', 'final', 'project', 'quiz'], 
    required: true 
  },
  gradeValue: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  maxMarks: { 
    type: Number, 
    default: 100 
  },
  percentage: { 
    type: Number,
    min: 0,
    max: 100
  },
  remarks: { 
    type: String 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Calculate percentage before saving
gradeSchema.pre('save', function(next) {
  this.percentage = (this.gradeValue / this.maxMarks) * 100;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Grade', gradeSchema); 