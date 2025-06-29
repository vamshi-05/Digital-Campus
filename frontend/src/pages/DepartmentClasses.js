import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import '../styles/department-classes.css';

const DepartmentClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    classTeacherId: '',
    academicYear: '',
    semester: '',
    capacity: 60,
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(user);
      // For department admins, fetch only their department's data
      const [classesRes, facultyRes] = await Promise.all([
        api.get(`/class/all?departmentId=${user.department}`),
        api.get(`/user/faculty?departmentId=${user.department}`)
      ]);
      
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
      // Automatically assign the department admin's department
      const classData = {
        ...formData,
        departmentId: user.department
      };
      
      await api.post('/class/add', classData);
      setShowAddModal(false);
      setFormData({
        name: '',
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
      await api.put(`/class/${selectedClass._id}`, formData);
      setShowEditModal(false);
      setSelectedClass(null);
      setFormData({
        name: '',
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
      await api.delete(`/class/${selectedClass._id}`);
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

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cls.classTeacher?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || cls.academicYear === filterYear;
    const matchesSemester = !filterSemester || cls.semester === filterSemester;
    
    return matchesSearch && matchesYear && matchesSemester;
  });

  if (loading) {
    return (
      <div className="classes-container">
        <div className="loading">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="classes-container">
      <div className="classes-header">
        <div className="header-content">
          <h1>Department Classes</h1>
          <p>Manage class sections in your department</p>
        </div>
        <Link to="/department-admin/dashboard" className="back-btn">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="controls-section">
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">All Years</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
            
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
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
        
        <button
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Class
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Classes</h3>
          <p>{classes.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Classes</h3>
          <p>{classes.filter(cls => cls.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{classes.reduce((total, cls) => total + (cls.students?.length || 0), 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Faculty Members</h3>
          <p>{faculty.length}</p>
        </div>
      </div>

      <div className="classes-table">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Class Teacher</th>
              <th>Academic Year</th>
              <th>Semester</th>
              {/* <th>Capacity</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map(cls => (
              <tr key={cls._id}>
                <td>
                  <div className="class-info">
                    <h4>{cls.name}</h4>
                    {cls.description && <p>{cls.description}</p>}
                  </div>
                </td>
                <td>{cls.classTeacher?.name}</td>
                <td>{cls.academicYear}</td>
                <td>{cls.semester}</td>
                {/* <td>{cls.capacity}</td> */}
                <td>{cls.status}</td>
                <td>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(cls)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredClasses.length === 0 && (
          <div className="no-data">
            <p>No classes found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Class</h2>
              <button
                className="close-btn"
                onClick={() => {setShowAddModal(false); setFormData({
                  name: '',
                  classTeacherId: '',
                  academicYear: '',
                  semester: '',
                  capacity: 60,
                  status: 'active'
                });}}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddClass}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Class Teacher</label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({...formData, classTeacherId: e.target.value})}
                  
                >
                  <option value="-">Select Class Teacher (Can add after )</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  required
                >
                  <option value="">Select Academic Year</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Semester</label>
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
              
              {/* <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div> */}
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Class</button>
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
              <button
                className="close-btn"
                onClick={() => {setFormData({
                  name: '',
                  classTeacherId: '',
                  academicYear: '',
                  semester: '',
                  capacity: 60,
                  status: 'active'
                }); setShowEditModal(false)}}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditClass}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Class Teacher</label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({...formData, classTeacherId: e.target.value})}
                  required
                >
                  <option value="">Select Class Teacher</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  required
                >
                  <option value="">Select Academic Year</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Semester</label>
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
              
              {/* <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div> */}
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Update Class</button>
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
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete the class "{selectedClass?.name}"?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button onClick={handleDeleteClass} className="delete-btn">
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentClasses; 