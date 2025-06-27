const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/profile', auth, userController.getProfile);
router.get('/all', auth, userController.getAllUsers);

module.exports = router; 