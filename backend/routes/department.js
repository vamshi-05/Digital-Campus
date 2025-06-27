const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const auth = require('../middlewares/auth');

router.post('/add', auth, departmentController.addDepartment);
router.get('/all', auth, departmentController.getAllDepartments);
router.post('/assign-admin', auth, departmentController.assignDepartmentAdmin);

module.exports = router; 