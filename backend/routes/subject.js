const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middlewares/auth');

router.post('/add', auth, subjectController.addSubject);
router.get('/all', auth, subjectController.getAllSubjects);
router.post('/assign-faculty', auth, subjectController.assignFaculty);

module.exports = router; 