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
    const departments = await Department.find()
      .populate('admins', 'name email role')
      .populate('faculty', 'name email role')
      .populate('students', 'name email role')
      .populate('classes', 'name section');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { id } = req.params;
    const { name } = req.body;
    
    const department = await Department.findByIdAndUpdate(
      id, 
      { name }, 
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { id } = req.params;
    
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if department has any users or classes
    if (department.admins.length > 0 || department.faculty.length > 0 || 
        department.students.length > 0 || department.classes.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with existing users or classes. Please remove all users and classes first.' 
      });
    }
    
    await Department.findByIdAndDelete(id);
    res.json({ message: 'Department deleted successfully' });
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