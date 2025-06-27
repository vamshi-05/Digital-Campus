const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middlewares/auth');

router.post('/add', auth, complaintController.addComplaint);
router.get('/all', auth, complaintController.getAllComplaints);
router.get('/mine', auth, complaintController.getOwnComplaints);

module.exports = router; 