import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import  useAuth  from '../hooks/useAuth';
import  api  from '../api/axios';
import '../styles/classes.css';

// Temporary passwords from environment variables
const STUDENT_TEMP_PASSWORD = process.env.REACT_APP_STUDENT_TEMP_PASSWORD || 'Student@123';
const FACULTY_TEMP_PASSWORD = process.env.REACT_APP_FACULTY_TEMP_PASSWORD || 'Faculty@123';
const DEPARTMENT_ADMIN_TEMP_PASSWORD = process.env.REACT_APP_DEPARTMENT_ADMIN_TEMP_PASSWORD || 'Admin@123';

export default function Classes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filters, setFilters] = useState({
    departmentId: '',
    academicYear: '',
    semester: ''
  });

  // Get user's department if they are a department admin
  const userDepartment = user?.department;
  console.log(user);

  const [formData, setFormData] = useState({
    name: '',
    departmentId: userDepartment || '', // Auto-assign department for department admins
    classTeacherId: '',
    academicYear: '',
    semester: '',
    capacity: 60,
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch classes with filters
      const classParams = new URLSearchParams();
      
      // For department admins, always filter by their department
      if (user?.role === 'departmentAdmin' && userDepartment) {
        classParams.append('departmentId', userDepartment);
      } else if (filters.departmentId) {
        classParams.append('departmentId', filters.departmentId);
      }
      
      if (filters.academicYear) classParams.append('academicYear', filters.academicYear);
      if (filters.semester) classParams.append('semester', filters.semester);
      
      // Fetch data based on user role
      let classesRes, departmentsRes, facultyRes;
      
      if (user?.role === 'departmentAdmin') {
        // Department admin: only fetch their department's data
        [classesRes, departmentsRes, facultyRes] = await Promise.all([
          api.get(`/classes/all?${classParams}`),
          api.get(`/departments/${userDepartment}`),
          api.get(`/users/faculty?departmentId=${userDepartment}`)
        ]);
        // Convert single department to array for consistency
        setDepartments([departmentsRes.data]);
      } else {
        // Super admin: fetch all data
        [classesRes, departmentsRes, facultyRes] = await Promise.all([
          api.get(`/classes/all?${classParams}`),
          api.get('/departments/all'),
          api.get('/users/faculty')
        ]);
        setDepartments(departmentsRes.data);
      }

      setClasses(classesRes.data);
      setFaculty(facultyRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      // For department admins, ensure their department is set
      const classData = {
        ...formData,
        departmentId: user?.role === 'departmentAdmin' ? userDepartment : formData.departmentId
      };
      
      await api.post('/classes/add', classData);
      setShowAddModal(false);
      setFormData({
        name: '',
        departmentId: userDepartment || '',
        classTeacherId: '',
        academicYear: '',
        semester: '',
        capacity: 60,
        status: 'active'
      });
      fetchData();
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/classes/${selectedClass._id}`, formData);
      setShowEditModal(false);
      setSelectedClass(null);
      setFormData({
        name: '',
        departmentId: userDepartment || '',
        classTeacherId: '',
        academicYear: '',
        semester: '',
        capacity: 60,
        status: 'active'
      });
      fetchData();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async () => {
    try {
      await api.delete(`/classes/${selectedClass._id}`);
      setShowDeleteModal(false);
      setSelectedClass(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const openEditModal = (classData) => {
    setSelectedClass(classData);
    setFormData({
      name: classData.name,
      departmentId: classData.department._id,
      classTeacherId: classData.classTeacher?._id || '',
      academicYear: classData.academicYear,
      semester: classData.semester,
      capacity: classData.capacity,
      status: classData.status
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (classData) => {
    setSelectedClass(classData);
    setShowDeleteModal(true);
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d._id === departmentId);
    return dept ? dept.name : 'Unknown';
  };

  const getFacultyName = (facultyId) => {
    const teacher = faculty.find(f => f._id === facultyId);
    return teacher ? teacher.name : 'Not Assigned';
  };

  if (loading) {
    return (
      <div className="classes-container">
        <div className="loading">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="classes-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        ← Back to Dashboard
      </button>
      
      <div className="classes-header">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <h1>Class Management</h1>
          <p>
            {user?.role === 'departmentAdmin' 
              ? `Manage class sections in ${departments[0]?.name || 'your department'}`
              : 'Manage class sections within departments'
            }
          </p>
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Class
          </button>
        </motion.div>
      </div>

      {/* Filters - Hide department filter for department admins */}
      <div className="filters-section">
        {user?.role !== 'departmentAdmin' && (
          <div className="filter-group">
            <label>Department:</label>
            <select 
              value={filters.departmentId} 
              onChange={(e) => setFilters({...filters, departmentId: e.target.value})}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="filter-group">
          <label>Academic Year:</label>
          <select 
            value={filters.academicYear} 
            onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
          >
            <option value="">All Years</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Semester:</label>
          <select 
            value={filters.semester} 
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
          >
            <option value="">All Semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {classes.map((classData, index) => (
          <motion.div
            key={classData._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="class-card"
          >
            <div className="class-header">
              <h3>{classData.fullName}</h3>
              <span className={`status ${classData.status}`}>
                {classData.status}
              </span>
            </div>
            
            <div className="class-details">
              <p><strong>Department:</strong> {classData.department?.name}</p>
              <p><strong>Academic Year:</strong> {classData.academicYear}</p>
              <p><strong>Semester:</strong> {classData.semester}</p>
              <p><strong>Class Teacher:</strong> {classData.classTeacher?.name || 'Not Assigned'}</p>
              <p><strong>Students:</strong> {classData.currentStrength}/{classData.capacity}</p>
            </div>
            
            <div className="class-actions">
              <button 
                className="view-btn"
                onClick={() => navigate(`/class/${classData._id}`)}
              >
                View Details
              </button>
              <button 
                className="edit-btn"
                onClick={() => openEditModal(classData)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => openDeleteModal(classData)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="no-classes">
          <p>No classes found. Create your first class to get started.</p>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Class</h2>
              <button onClick={() => setShowAddModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAddClass}>
              <div className="form-group">
                <label>Class Name (Section):</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., A, B, C"
                  required
                />
                <small className="form-text">Single letter or number for the section (e.g., A, B, C, 1, 2)</small>
              </div>
              
              {/* Show department selection only for super admins
              {user?.role !== 'departmentAdmin' ? (
                <div className="form-group">
                  <label>Department:</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name} ({dept.code})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Department:</label>
                  <div className="department-display">
                    <span className="department-name">{userDepartment} ({departments[0]?.code})</span>
                    <small className="form-text">Your assigned department</small>
                  </div>
                </div>
              )} */}
              
              <div className="form-group">
                <label>Class Teacher:</label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({...formData, classTeacherId: e.target.value})}
                >
                  <option value="">Select Class Teacher</option>
                  {faculty.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.specialization || 'Faculty'}
                    </option>
                  ))}
                </select>
                <small className="form-text">Optional: Assign a faculty member as class teacher</small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Academic Year:</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Semester:</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                {/* <div className="form-group">
                  <label>Capacity:</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                    placeholder="60"
                  />
                  <small className="form-text">Maximum number of students allowed</small>
                </div> */}
                
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Class</h2>
              <button onClick={() => setShowEditModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleEditClass}>
              <div className="form-group">
                <label>Class Name (Section):</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., A, B, C"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Class Teacher:</label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({...formData, classTeacherId: e.target.value})}
                >
                  <option value="">Select Class Teacher</option>
                  {faculty.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.specialization || 'Faculty'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity:</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>Delete Class</h2>
              <button onClick={() => setShowDeleteModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedClass?.fullName}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleDeleteClass} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 