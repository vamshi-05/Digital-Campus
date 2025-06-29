import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import '../styles/timetable-management.css';

const TimetableManagement = () => {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    department: '',
    class: '',
    semester: '',
    academicYear: '',
    schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    }
  });

  // Filters
  const [filters, setFilters] = useState({
    department: '',
    class: '',
    semester: '',
    academicYear: ''
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [timeSlots] = useState([
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  useEffect(() => {
    fetchTimetables();
    fetchDepartments();
    fetchClasses();
    fetchSubjects();
    fetchFaculty();
  }, [user, filters]);

  const fetchTimetables = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.class) params.append('class', filters.class);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);

      const response = await axios.get(`/timetable/all?${params}`);
      setTimetables(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch timetables');
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/department/all');
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/class/all');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subject/all');
      setSubjects(response.data);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('/user/faculty');
      setFaculty(response.data);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimetable) {
        await axios.put(`/timetable/update/${editingTimetable._id}`, formData);
        setEditingTimetable(null);
      } else {
        await axios.post('/timetable/create', formData);
      }
      
      resetForm();
      setShowCreateForm(false);
      fetchTimetables();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save timetable');
    }
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      department: timetable.department._id,
      class: timetable.class._id,
      semester: timetable.semester,
      academicYear: timetable.academicYear,
      schedule: timetable.schedule
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (timetableId) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        await axios.delete(`/timetable/delete/${timetableId}`);
        fetchTimetables();
      } catch (err) {
        setError('Failed to delete timetable');
      }
    }
  };

  const addTimeSlot = (day) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: [...formData.schedule[day], {
          timeSlot: '',
          subject: '',
          faculty: '',
          room: '',
          type: 'Lecture'
        }]
      }
    });
  };

  const removeTimeSlot = (day, index) => {
    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[day].splice(index, 1);
    setFormData({
      ...formData,
      schedule: updatedSchedule
    });
  };

  const updateTimeSlot = (day, index, field, value) => {
    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[day][index][field] = value;
    setFormData({
      ...formData,
      schedule: updatedSchedule
    });
  };

  const resetForm = () => {
    setFormData({
      department: '',
      class: '',
      semester: '',
      academicYear: '',
      schedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      }
    });
  };

  const canManageTimetables = ['admin', 'departmentAdmin'].includes(user.role);

  return (
    <div className="timetable-management-container">
      <div className="timetable-header">
        <h1>Timetable Management</h1>
        {canManageTimetables && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Timetable'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <select
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
          <select
            value={filters.class}
            onChange={(e) => setFilters({...filters, class: e.target.value})}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
          <select
            value={filters.semester}
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
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
      </div>

      {/* Create/Edit Timetable Form */}
      {showCreateForm && (
        <div className="timetable-form-section">
          <h3>{editingTimetable ? 'Edit Timetable' : 'Create New Timetable'}</h3>
          <form onSubmit={handleSubmit} className="timetable-form">
            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Class *</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Semester *</label>
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
              <div className="form-group">
                <label>Academic Year *</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  required
                >
                  <option value="">Select Academic Year</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                </select>
              </div>
            </div>

            {/* Schedule Builder */}
            <div className="schedule-builder">
              <h4>Schedule</h4>
              {days.map(day => (
                <div key={day} className="day-schedule">
                  <div className="day-header">
                    <h5>{day.charAt(0).toUpperCase() + day.slice(1)}</h5>
                    <button 
                      type="button"
                      className="btn btn-small btn-secondary"
                      onClick={() => addTimeSlot(day)}
                    >
                      Add Slot
                    </button>
                  </div>
                  <div className="time-slots">
                    {formData.schedule[day].map((slot, index) => (
                      <div key={index} className="time-slot">
                        <select
                          value={slot.timeSlot}
                          onChange={(e) => updateTimeSlot(day, index, 'timeSlot', e.target.value)}
                          required
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <select
                          value={slot.subject}
                          onChange={(e) => updateTimeSlot(day, index, 'subject', e.target.value)}
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject._id} value={subject._id}>{subject.name}</option>
                          ))}
                        </select>
                        <select
                          value={slot.faculty}
                          onChange={(e) => updateTimeSlot(day, index, 'faculty', e.target.value)}
                          required
                        >
                          <option value="">Select Faculty</option>
                          {faculty.map(f => (
                            <option key={f._id} value={f._id}>{f.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Room"
                          value={slot.room}
                          onChange={(e) => updateTimeSlot(day, index, 'room', e.target.value)}
                          required
                        />
                        <select
                          value={slot.type}
                          onChange={(e) => updateTimeSlot(day, index, 'type', e.target.value)}
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Lab">Lab</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Seminar">Seminar</option>
                        </select>
                        <button 
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() => removeTimeSlot(day, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingTimetable ? 'Update Timetable' : 'Create Timetable'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingTimetable(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetables List */}
      <div className="timetables-section">
        {loading ? (
          <div className="loading">Loading timetables...</div>
        ) : (
          <>
            <div className="timetables-grid">
              {timetables.map(timetable => (
                <div key={timetable._id} className="timetable-card">
                  <div className="timetable-header">
                    <div className="timetable-info">
                      <h3>{timetable.department.name} - {timetable.class.name}</h3>
                      <p>{timetable.semester} | {timetable.academicYear}</p>
                    </div>
                    <div className="timetable-actions">
                      {canManageTimetables && (
                        <>
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={() => handleEdit(timetable)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-small btn-danger"
                            onClick={() => handleDelete(timetable._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => setSelectedTimetable(timetable)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  
                  <div className="timetable-preview">
                    <div className="schedule-preview">
                      {days.map(day => (
                        <div key={day} className="day-preview">
                          <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                          <div className="day-slots">
                            {timetable.schedule[day].slice(0, 3).map((slot, index) => (
                              <div key={index} className="slot-preview">
                                <span className="time">{slot.timeSlot}</span>
                                <span className="subject">{subjects.find(s => s._id === slot.subject)?.name || 'N/A'}</span>
                              </div>
                            ))}
                            {timetable.schedule[day].length > 3 && (
                              <span className="more-slots">+{timetable.schedule[day].length - 3} more</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {timetables.length === 0 && (
              <div className="no-data">No timetables found for the selected filters.</div>
            )}
          </>
        )}
      </div>

      {/* Timetable Detail Modal */}
      {selectedTimetable && (
        <div className="modal-overlay" onClick={() => setSelectedTimetable(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Timetable Details</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedTimetable(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="timetable-detail-header">
                <h3>{selectedTimetable.department.name} - {selectedTimetable.class.name}</h3>
                <p>{selectedTimetable.semester} | {selectedTimetable.academicYear}</p>
              </div>

              <div className="timetable-detail-schedule">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      {days.map(day => (
                        <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(timeSlot => (
                      <tr key={timeSlot}>
                        <td className="time-column">{timeSlot}</td>
                        {days.map(day => {
                          const slot = selectedTimetable.schedule[day].find(s => s.timeSlot === timeSlot);
                          return (
                            <td key={day} className={slot ? 'has-slot' : 'empty-slot'}>
                              {slot ? (
                                <div className="slot-detail">
                                  <div className="subject-name">
                                    {subjects.find(s => s._id === slot.subject)?.name || 'N/A'}
                                  </div>
                                  <div className="faculty-name">
                                    {faculty.find(f => f._id === slot.faculty)?.name || 'N/A'}
                                  </div>
                                  <div className="room-info">{slot.room}</div>
                                  <div className="slot-type">{slot.type}</div>
                                </div>
                              ) : (
                                <span className="empty-text">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement; 