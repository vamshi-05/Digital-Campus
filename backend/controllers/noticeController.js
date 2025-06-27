const Notice = require('../models/Notice');

exports.addNotice = async (req, res) => {
  try {
    if (!['admin', 'departmentAdmin'].includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    const { title, content, department } = req.body;
    const notice = new Notice({ title, content, department, createdBy: req.user.id });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const filter = req.query.department ? { department: req.query.department } : {};
    const notices = await Notice.find(filter).populate('department').populate('createdBy');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 