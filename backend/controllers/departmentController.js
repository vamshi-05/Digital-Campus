const Department = require('../models/Department');
const User = require('../models/User');

exports.addDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { name, admins } = req.body;
    const department = new Department({ name, admins });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('admins');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignDepartmentAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { departmentId, adminId } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(departmentId, { $addToSet: { admins: adminId } }, { new: true });
    res.json(updatedDepartment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 