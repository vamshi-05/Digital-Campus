const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middlewares/auth');

router.post('/add', auth, classController.addClass);
router.get('/all', auth, classController.getAllClasses);
router.post('/assign-teacher', auth, classController.assignClassTeacher);

module.exports = router; 