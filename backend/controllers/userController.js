const User = require('../models/User');
const Department = require('../models/Department');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const { name, email, password, role, department, class: classId, section } = req.body;
    
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
      section
    });
    
    await user.save();
    
    // Update department relationships based on role
    if (department) {
      if (role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(
          department,
          { $addToSet: { admins: user._id } },
          { new: true }
        );
      } else if (role === 'faculty') {
        await Department.findByIdAndUpdate(
          department,
          { $addToSet: { faculty: user._id } },
          { new: true }
        );
      } else if (role === 'student') {
        await Department.findByIdAndUpdate(
          department,
          { $addToSet: { students: user._id } },
          { new: true }
        );
      }
    }
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
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
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const { id } = req.params;
    const { name, email, role, department, class: classId, section } = req.body;
    
    // Get the current user to check for changes
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from old department relationships
    if (currentUser.department) {
      const oldDepartment = currentUser.department;
      const oldRole = currentUser.role;
      
      if (oldRole === 'departmentAdmin') {
        await Department.findByIdAndUpdate(oldDepartment, { $pull: { admins: id } });
      } else if (oldRole === 'faculty') {
        await Department.findByIdAndUpdate(oldDepartment, { $pull: { faculty: id } });
      } else if (oldRole === 'student') {
        await Department.findByIdAndUpdate(oldDepartment, { $pull: { students: id } });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, department, class: classId, section },
      { new: true, runValidators: true }
    ).select('-password');
    
    // Add user to new department relationships
    if (department) {
      if (role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(department, { $addToSet: { admins: id } });
      } else if (role === 'faculty') {
        await Department.findByIdAndUpdate(department, { $addToSet: { faculty: id } });
      } else if (role === 'student') {
        await Department.findByIdAndUpdate(department, { $addToSet: { students: id } });
      }
    }
    
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
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const { id } = req.params;
    
    // Get the user to check their department and role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from department relationships
    if (user.department) {
      const department = user.department;
      const role = user.role;
      
      if (role === 'departmentAdmin') {
        await Department.findByIdAndUpdate(department, { $pull: { admins: id } });
      } else if (role === 'faculty') {
        await Department.findByIdAndUpdate(department, { $pull: { faculty: id } });
      } else if (role === 'student') {
        await Department.findByIdAndUpdate(department, { $pull: { students: id } });
      }
    }
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 