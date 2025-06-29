const Grade = require('../models/Grade');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Class = require('../models/Class');

// Add grade for a student
exports.addGrade = async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Only faculty can add grades.' });
    }

    const { 
      studentId, 
      subjectId, 
      classId, 
      semester, 
      academicYear, 
      gradeType, 
      gradeValue, 
      maxMarks, 
      remarks 
    } = req.body;

    // Verify student exists and is in faculty's class
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify subject exists and faculty is assigned to it
    const subject = await Subject.findById(subjectId);
    if (!subject || !subject.faculty.includes(req.user._id)) {
      return res.status(403).json({ message: 'Subject not found or you are not assigned to this subject' });
    }

    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if grade already exists for this student, subject, and grade type
    const existingGrade = await Grade.findOne({
      student: studentId,
      subject: subjectId,
      semester,
      academicYear,
      gradeType
    });

    if (existingGrade) {
      return res.status(400).json({ message: 'Grade already exists for this student, subject, and grade type' });
    }

    const grade = new Grade({
      student: studentId,
      subject: subjectId,
      class: classId,
      faculty: req.user._id,
      semester,
      academicYear,
      gradeType,
      gradeValue,
      maxMarks: maxMarks || 100,
      remarks
    });

    await grade.save();

    res.status(201).json({
      message: 'Grade added successfully',
      grade
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Only faculty can update grades.' });
    }

    const { id } = req.params;
    const { gradeValue, maxMarks, remarks } = req.body;

    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Verify faculty owns this grade
    if (grade.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update grades you created' });
    }

    grade.gradeValue = gradeValue;
    grade.maxMarks = maxMarks || grade.maxMarks;
    grade.remarks = remarks;
    grade.updatedAt = Date.now();

    await grade.save();

    res.json({
      message: 'Grade updated successfully',
      grade
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get grades for a student
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, academicYear, subjectId } = req.query;

    let query = { student: studentId };

    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    if (subjectId) query.subject = subjectId;

    const grades = await Grade.find(query)
      .populate('subject', 'name code')
      .populate('faculty', 'name')
      .populate('class', 'name')
      .sort({ createdAt: -1 });

    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get grades for a class (faculty view)
exports.getClassGrades = async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Only faculty can view class grades.' });
    }

    const { classId, subjectId, semester, academicYear } = req.query;

    let query = { faculty: req.user._id };

    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('student', 'name rollNumber')
      .populate('subject', 'name code')
      .populate('class', 'name')
      .sort({ 'student.name': 1, gradeType: 1 });

    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Only faculty can delete grades.' });
    }

    const { id } = req.params;

    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Verify faculty owns this grade
    if (grade.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete grades you created' });
    }

    await Grade.findByIdAndDelete(id);

    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get grade statistics
exports.getGradeStatistics = async (req, res) => {
  try {
    const { classId, subjectId, semester, academicYear } = req.query;

    let query = { faculty: req.user._id };

    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query);

    const statistics = {
      totalGrades: grades.length,
      averageGrade: grades.length > 0 ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length : 0,
      highestGrade: grades.length > 0 ? Math.max(...grades.map(g => g.percentage)) : 0,
      lowestGrade: grades.length > 0 ? Math.min(...grades.map(g => g.percentage)) : 0,
      gradeDistribution: {
        'A+ (90-100)': grades.filter(g => g.percentage >= 90).length,
        'A (80-89)': grades.filter(g => g.percentage >= 80 && g.percentage < 90).length,
        'B+ (70-79)': grades.filter(g => g.percentage >= 70 && g.percentage < 80).length,
        'B (60-69)': grades.filter(g => g.percentage >= 60 && g.percentage < 70).length,
        'C+ (50-59)': grades.filter(g => g.percentage >= 50 && g.percentage < 60).length,
        'C (40-49)': grades.filter(g => g.percentage >= 40 && g.percentage < 50).length,
        'F (<40)': grades.filter(g => g.percentage < 40).length
      }
    };

    res.json(statistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 