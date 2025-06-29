const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Grade management routes
router.post('/add', gradeController.addGrade);
router.put('/update/:id', gradeController.updateGrade);
router.delete('/delete/:id', gradeController.deleteGrade);

// Get grades
router.get('/student/:studentId', gradeController.getStudentGrades);
router.get('/class', gradeController.getClassGrades);
router.get('/statistics', gradeController.getGradeStatistics);

module.exports = router; 