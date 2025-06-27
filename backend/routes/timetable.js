const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const auth = require('../middlewares/auth');

router.post('/add', auth, timetableController.addTimetable);
router.get('/:classId', auth, timetableController.getTimetable);

module.exports = router; 