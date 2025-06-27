const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');

router.post('/mark', auth, attendanceController.markAttendance);
router.get('/records', auth, attendanceController.getAttendance);

module.exports = router; 