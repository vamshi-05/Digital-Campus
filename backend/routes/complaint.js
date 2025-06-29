const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Complaint CRUD operations
router.post('/submit', complaintController.submitComplaint);
router.get('/all', complaintController.getComplaints);
router.get('/:id', complaintController.getComplaintById);

// Complaint management
router.put('/status/:id', complaintController.updateComplaintStatus);
router.post('/note/:id', complaintController.addInternalNote);
router.post('/response/:id', complaintController.addResponse);
router.put('/escalate/:id', complaintController.escalateComplaint);
router.post('/rate/:id', complaintController.rateComplaint);

// Analytics and search
router.get('/analytics', complaintController.getComplaintAnalytics);
router.get('/search/tracking', complaintController.searchByTrackingNumber);

module.exports = router; 