import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import '../styles/department-classes.css';

const DepartmentClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    faculty: '',
    schedule: '',
    room: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, facultyRes, subjectsRes] = await Promise.all([
        axios.get('/department-admin/classes'),
        axios.get('/department-admin/faculty-list'),
        axios.get('/department-admin/subjects-list')
      ]);
      
      setClasses(classesRes.data);
      setFaculty(facultyRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/department-admin/classes', formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        subject: '',
        faculty: '',
        schedule: '',
        room: '',
        capacity: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/department-admin/classes/${selectedClass._id}`, formData);
      setShowEditModal(false);
      setSelectedClass(null);
      setFormData({
        name: '',
        subject: '',
        faculty: '',
        schedule: '',
        room: '',
        capacity: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async () => {
    try {
      await axios.delete(`/department-admin/classes/${selectedClass._id}`);
      setShowDeleteModal(false);
      setSelectedClass(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      subject: cls.subject,
      faculty: cls.faculty,
      schedule: cls.schedule,
      room: cls.room,
      capacity: cls.capacity,
      description: cls.description
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || cls.subject === filterSubject;
    const matchesFaculty = !filterFaculty || cls.faculty === filterFaculty;
    
    return matchesSearch && matchesSubject && matchesFaculty;
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
          <p>Manage classes for {user.department}</p>
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
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            
            <select
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
            >
              <option value="">All Faculty</option>
              {faculty.map(f => (
                <option key={f._id} value={f.name}>
                  {f.name}
                </option>
              ))}
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
          <h3>{classes.length}</h3>
          <p>Total Classes</p>
        </div>
        <div className="stat-card">
          <h3>{subjects.length}</h3>
          <p>Subjects</p>
        </div>
        <div className="stat-card">
          <h3>{faculty.length}</h3>
          <p>Faculty Members</p>
        </div>
      </div>

      <div className="classes-table">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Schedule</th>
              <th>Room</th>
              <th>Capacity</th>
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
                <td>{cls.subject}</td>
                <td>{cls.faculty}</td>
                <td>{cls.schedule}</td>
                <td>{cls.room}</td>
                <td>{cls.capacity}</td>
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
                onClick={() => setShowAddModal(false)}
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
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Faculty</label>
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    placeholder="e.g., Mon, Wed, Fri 10:00 AM"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
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
                onClick={() => setShowEditModal(false)}
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
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Faculty</label>
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    placeholder="e.g., Mon, Wed, Fri 10:00 AM"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
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