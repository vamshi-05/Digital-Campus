import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import '../styles/user-management.css';

// Temporary passwords from environment variables
const STUDENT_TEMP_PASSWORD = process.env.REACT_APP_STUDENT_TEMP_PASSWORD || 'Student@123';
const FACULTY_TEMP_PASSWORD = process.env.REACT_APP_FACULTY_TEMP_PASSWORD || 'Faculty@123';
const DEPARTMENT_ADMIN_TEMP_PASSWORD = process.env.REACT_APP_DEPARTMENT_ADMIN_TEMP_PASSWORD || 'Admin@123';

export default function UserManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Get user's department if they are a department admin
  const userDepartment = user?.department;

  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    department: userDepartment || '', // Auto-assign department for department admins
    class: '',
    rollNumber: '',
    year: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });

  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    email: '',
    department: userDepartment || '', // Auto-assign department for department admins
    phone: '',
    specialization: '',
    qualification: '',
    experience: 0,
    designation: 'Faculty'
  });

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    department: userDepartment || '' // Auto-assign department for department admins
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch data based on user role
      let departmentsRes, classesRes;
      
      if (user?.role === 'departmentAdmin') {
        // Department admin: only fetch their department's data
        [departmentsRes, classesRes] = await Promise.all([
          api.get(`/departments/${userDepartment}`),
          api.get(`/classes/all?departmentId=${userDepartment}`)
        ]);
        // Convert single department to array for consistency
        setDepartments([departmentsRes.data]);
      } else {
        // Super admin: fetch all data
        [departmentsRes, classesRes] = await Promise.all([
          api.get('/departments/all'),
          api.get('/classes/all')
        ]);
        setDepartments(departmentsRes.data);
      }
      
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      // For department admins, ensure their department is set
      const userData = {
        ...studentFormData,
        department: user?.role === 'departmentAdmin' ? userDepartment : studentFormData.department,
        password: STUDENT_TEMP_PASSWORD,
        role: 'student'
      };
      
      await api.post('/user', userData);
      setShowAddStudentModal(false);
      setStudentFormData({
        name: '',
        email: '',
        department: userDepartment || '',
        class: '',
        rollNumber: '',
        year: '',
        address: '',
        parentName: '',
        parentPhone: ''
      });
      alert(`Student added successfully! Temporary password: ${STUDENT_TEMP_PASSWORD}`);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      // For department admins, ensure their department is set
      const userData = {
        ...facultyFormData,
        department: user?.role === 'departmentAdmin' ? userDepartment : facultyFormData.department,
        password: FACULTY_TEMP_PASSWORD,
        role: 'faculty'
      };
      
      await api.post('/user', userData);
      setShowAddFacultyModal(false);
      setFacultyFormData({
        name: '',
        email: '',
        department: userDepartment || '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: 0,
        designation: 'Faculty'
      });
      alert(`Faculty added successfully! Temporary password: ${FACULTY_TEMP_PASSWORD}`);
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert('Failed to add faculty. Please try again.');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      // For department admins, ensure their department is set
      const userData = {
        ...adminFormData,
        department: user?.role === 'departmentAdmin' ? userDepartment : adminFormData.department,
        password: DEPARTMENT_ADMIN_TEMP_PASSWORD,
        role: 'departmentAdmin'
      };
      
      await api.post('/user', userData);
      setShowAddAdminModal(false);
      setAdminFormData({
        name: '',
        email: '',
        department: userDepartment || ''
      });
      alert(`Department Admin added successfully! Temporary password: ${DEPARTMENT_ADMIN_TEMP_PASSWORD}`);
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin. Please try again.');
    }
  };

  const getClassesByDepartment = (departmentId) => {
    return classes.filter(cls => cls.department === departmentId);
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        ← Back to Dashboard
      </button>
      
      <div className="user-management-header">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <h1>User Management</h1>
          <p>
            {user?.role === 'departmentAdmin' 
              ? `Add students, faculty, and administrators to ${departments[0]?.name || 'your department'}`
              : 'Add students, faculty, and department administrators'
            }
          </p>
        </motion.div>
      </div>

      <div className="user-management-actions">
        <button 
          className="add-btn student"
          onClick={() => setShowAddStudentModal(true)}
        >
          + Add Student
        </button>
        <button 
          className="add-btn faculty"
          onClick={() => setShowAddFacultyModal(true)}
        >
          + Add Faculty
        </button>
        <button 
          className="add-btn admin"
          onClick={() => setShowAddAdminModal(true)}
        >
          + Add Department Admin
        </button>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button onClick={() => setShowAddStudentModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({...studentFormData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={studentFormData.email}
                  onChange={(e) => setStudentFormData({...studentFormData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              {/* Show department selection only for super admins */}
              {user?.role !== 'departmentAdmin' ? (
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={studentFormData.department}
                    onChange={(e) => {
                      setStudentFormData({
                        ...studentFormData, 
                        department: e.target.value,
                        class: '' // Reset class when department changes
                      });
                    }}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Department *</label>
                  <div className="department-display">
                    <span className="department-name">{departments[0]?.name}</span>
                    <small className="form-text">Your assigned department</small>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Class (Section)</label>
                <select
                  value={studentFormData.class}
                  onChange={(e) => setStudentFormData({...studentFormData, class: e.target.value})}
                >
                  <option value="">Select Class</option>
                  {getClassesByDepartment(studentFormData.department).map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.fullName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    value={studentFormData.rollNumber}
                    onChange={(e) => setStudentFormData({...studentFormData, rollNumber: e.target.value})}
                    placeholder="Enter roll number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Year</label>
                  <select
                    value={studentFormData.year}
                    onChange={(e) => setStudentFormData({...studentFormData, year: e.target.value})}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={studentFormData.address}
                  onChange={(e) => setStudentFormData({...studentFormData, address: e.target.value})}
                  placeholder="Enter address"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Parent Name</label>
                  <input
                    type="text"
                    value={studentFormData.parentName}
                    onChange={(e) => setStudentFormData({...studentFormData, parentName: e.target.value})}
                    placeholder="Enter parent name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Parent Phone</label>
                  <input
                    type="tel"
                    value={studentFormData.parentPhone}
                    onChange={(e) => setStudentFormData({...studentFormData, parentPhone: e.target.value})}
                    placeholder="Enter parent phone"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddFacultyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Faculty</h2>
              <button onClick={() => setShowAddFacultyModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAddFaculty}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={facultyFormData.name}
                  onChange={(e) => setFacultyFormData({...facultyFormData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={facultyFormData.email}
                  onChange={(e) => setFacultyFormData({...facultyFormData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              {/* Show department selection only for super admins */}
              {user?.role !== 'departmentAdmin' ? (
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={facultyFormData.department}
                    onChange={(e) => setFacultyFormData({...facultyFormData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Department *</label>
                  <div className="department-display">
                    <span className="department-name">{departments[0]?.name}</span>
                    <small className="form-text">Your assigned department</small>
                  </div>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={facultyFormData.phone}
                    onChange={(e) => setFacultyFormData({...facultyFormData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Designation</label>
                  <select
                    value={facultyFormData.designation}
                    onChange={(e) => setFacultyFormData({...facultyFormData, designation: e.target.value})}
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="HOD">HOD</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={facultyFormData.specialization}
                  onChange={(e) => setFacultyFormData({...facultyFormData, specialization: e.target.value})}
                  placeholder="e.g., Computer Science, Mathematics"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    value={facultyFormData.qualification}
                    onChange={(e) => setFacultyFormData({...facultyFormData, qualification: e.target.value})}
                    placeholder="e.g., Ph.D., M.Tech"
                  />
                </div>
                
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    value={facultyFormData.experience}
                    onChange={(e) => setFacultyFormData({...facultyFormData, experience: parseInt(e.target.value)})}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddFacultyModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Admin Modal */}
      {showAddAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Department Admin</h2>
              <button onClick={() => setShowAddAdminModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAddAdmin}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={adminFormData.name}
                  onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              {/* Show department selection only for super admins */}
              {user?.role !== 'departmentAdmin' ? (
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={adminFormData.department}
                    onChange={(e) => setAdminFormData({...adminFormData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Department *</label>
                  <div className="department-display">
                    <span className="department-name">{departments[0]?.name}</span>
                    <small className="form-text">Your assigned department</small>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddAdminModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 