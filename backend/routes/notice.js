const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const auth = require('../middlewares/auth');

router.post('/add', auth, noticeController.addNotice);
router.get('/all', auth, noticeController.getAllNotices);

module.exports = router; 