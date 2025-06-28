const User = require('../models/User');
const Department = require('../models/Department');
const Class = require('../models/Class');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('department', 'name code')
      .populate('class', 'name fullName');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const users = await User.find()
      .select('-password')
      .populate('department', 'name code')
      .populate('class', 'name fullName');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDepartmentAdmins = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const users = await User.find({ role: 'departmentAdmin' })
      .select('-password')
      .populate('department', 'name code');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFaculty = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { departmentId } = req.query;
    let query = { role: 'faculty' };
    
    if (departmentId) {
      query.department = departmentId;
    }
    
    const faculty = await User.find(query)
      .select('-password')
      .populate('department', 'name code');
    
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { departmentId, classId } = req.query;
    let query = { role: 'student' };
    
    if (departmentId) {
      query.department = departmentId;
    }
    
    if (classId) {
      query.class = classId;
    }
    
    const students = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .populate('class', 'name fullName');
    
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { 
      name, 
      email, 
      password, 
      role, 
      department, 
      class: classId, 
      phone,
      specialization,
      qualification,
      experience,
      designation,
      rollNumber,
      year,
      address,
      parentName,
      parentPhone
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      class: classId,
      phone,
      specialization,
      qualification,
      experience,
      designation,
      rollNumber,
      year,
      address,
      parentName,
      parentPhone
    });
    
    await user.save();
    
    // Update department relationships based on role
    if (department) {
      if (role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(
          department,
          { $addToSet: { admins: user._id } }
        );
      }
    }
    
    // If student is assigned to a class, update class student count
    if (role === 'student' && classId) {
      await Class.findByIdAndUpdate(classId, {
        $push: { students: user._id },
        $inc: { currentStrength: 1 }
      });
    }
    
    // Return user without password
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('department', 'name code')
      .populate('class', 'name fullName');
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Get the current user to check for changes
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle department admin changes
    if (updateData.department && updateData.department !== currentUser.department?.toString()) {
      // Remove from old department
      if (currentUser.department && currentUser.role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(currentUser.department, { $pull: { admins: id } });
      }
      
      // Add to new department
      if (updateData.role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(updateData.department, { $addToSet: { admins: id } });
      }
    }
    
    // Handle class changes for students
    if (currentUser.role === 'student' && updateData.class !== currentUser.class?.toString()) {
      // Remove from old class
      if (currentUser.class) {
        await Class.findByIdAndUpdate(currentUser.class, {
          $pull: { students: id },
          $inc: { currentStrength: -1 }
        });
      }
      
      // Add to new class
      if (updateData.class) {
        await Class.findByIdAndUpdate(updateData.class, {
          $push: { students: id },
          $inc: { currentStrength: 1 }
        });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .select('-password')
    .populate('department', 'name code')
    .populate('class', 'name fullName');
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { id } = req.params;
    
    // Get the user to check their department and role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from department relationships
    if (user.department && user.role === 'departmentAdmin') {
      await Department.findByIdAndUpdate(user.department, { $pull: { admins: id } });
    }
    
    // Remove student from class
    if (user.role === 'student' && user.class) {
      await Class.findByIdAndUpdate(user.class, {
        $pull: { students: id },
        $inc: { currentStrength: -1 }
      });
    }
    
    // If user is a class teacher, update their status
    if (user.isClassTeacher) {
      await User.findByIdAndUpdate(id, { isClassTeacher: false });
    }
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsersByDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'departmentAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { departmentId } = req.params;
    const { role } = req.query;
    
    let query = { department: departmentId };
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .populate('class', 'name fullName');
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 