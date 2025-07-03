import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import useAuth  from '../hooks/useAuth';
import '../styles/grades.css';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    classId: '',
    semester: '',
    academicYear: '',
    gradeType: 'assignment',
    gradeValue: '',
    maxMarks: 100,
    remarks: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    classId: '',
    subjectId: '',
    semester: '',
    academicYear: ''
  });

  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const gradeTypes = ['assignment', 'midterm', 'final', 'project', 'quiz'];
  const academicYears = ['2023-24', '2024-25', '2025-26'];

  useEffect(() => {
    if (user.role === 'faculty') {
      fetchGrades();
      fetchStudents();
      fetchSubjects();
      fetchClasses();
    }
  }, [user, filters]);

  const fetchGrades = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.classId) params.append('classId', filters.classId);
      if (filters.subjectId) params.append('subjectId', filters.subjectId);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);

      const response = await axios.get(`/grade/class?${params}`);
      setGrades(response.data);
    } catch (err) {
      setError('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/department-admin/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/class/all');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        await axios.put(`/grade/update/${editingGrade._id}`, formData);
        setEditingGrade(null);
      } else {
        await axios.post('/grade/add', formData);
      }
      
      setFormData({
        studentId: '',
        subjectId: '',
        classId: '',
        semester: '',
        academicYear: '',
        gradeType: 'assignment',
        gradeValue: '',
        maxMarks: 100,
        remarks: ''
      });
      setShowAddForm(false);
      fetchGrades();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grade');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.student._id,
      subjectId: grade.subject._id,
      classId: grade.class._id,
      semester: grade.semester,
      academicYear: grade.academicYear,
      gradeType: grade.gradeType,
      gradeValue: grade.gradeValue,
      maxMarks: grade.maxMarks,
      remarks: grade.remarks || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await axios.delete(`/grade/delete/${gradeId}`);
        fetchGrades();
      } catch (err) {
        setError('Failed to delete grade');
      }
    }
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  // if (user.role === 'student') {
    const [studentGrades, setStudentGrades] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');
    const fetchStudentGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/grade/student/${user.id}`);
        setStudentGrades(res.data);
      } catch (err) {
        setStudentGrades([]);
        setError('Failed to fetch grades');
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      if (user.role === 'student') {
        fetchStudentGrades();
      }
    }, [user]);
    return (
      <div className="grades-container">
        <div className="grades-header">
          <h1>My Grades</h1>
        </div>
        <div className="grades-table-section">
          <h3>Grades List</h3>
          {loading ? (
            <div className="loading">Loading grades...</div>
          ) : (
            <div className="table-container">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Grade</th>
                    <th>Percentage</th>
                    <th>Letter</th>
                    <th>Semester</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map(grade => (
                    <tr key={grade._id}>
                      <td>{grade.subject?.name}</td>
                      <td>{grade.gradeType}</td>
                      <td>{grade.gradeValue}/{grade.maxMarks}</td>
                      <td>{grade.percentage?.toFixed(1)}%</td>
                      <td className={`grade-letter grade-${getGradeLetter(grade.percentage).toLowerCase()}`}>{getGradeLetter(grade.percentage)}</td>
                      <td>{grade.semester}</td>
                      <td>{grade.academicYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentGrades.length === 0 && (
                <div className="no-data">No grades found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  

  // if (user.role !== 'faculty') {
  //   return (
  //     <div className="grades-container">
  //       <div className="error-message">
  //         <h2>Access Denied</h2>
  //         <p>Only faculty members can access the grades management system.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="grades-container">
      <div className="grades-header">
        <h1>Grades Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Grade'}
        </button>
      </div>

      {/* {error && <div className="error-message">{error}</div>} */}

      {/* Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <select
            value={filters.classId}
            onChange={(e) => setFilters({...filters, classId: e.target.value})}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>

          <select
            value={filters.subjectId}
            onChange={(e) => setFilters({...filters, subjectId: e.target.value})}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.name}</option>
            ))}
          </select>

          <select
            value={filters.semester}
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <select
            value={filters.academicYear}
            onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
          >
            <option value="">All Years</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Grade Form */}
      {showAddForm && (
        <div className="grade-form-section">
          <h3>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</h3>
          <form onSubmit={handleSubmit} className="grade-form">
            <div className="form-row">
              <div className="form-group">
                <label>Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.rollNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Grade Type</label>
                <select
                  value={formData.gradeType}
                  onChange={(e) => setFormData({...formData, gradeType: e.target.value})}
                  required
                >
                  {gradeTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
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
                  <option value="">Select Year</option>
                  {academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grade Value</label>
                <input
                  type="number"
                  value={formData.gradeValue}
                  onChange={(e) => setFormData({...formData, gradeValue: e.target.value})}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Marks</label>
                <input
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingGrade ? 'Update Grade' : 'Add Grade'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGrade(null);
                  setFormData({
                    studentId: '',
                    subjectId: '',
                    classId: '',
                    semester: '',
                    academicYear: '',
                    gradeType: 'assignment',
                    gradeValue: '',
                    maxMarks: 100,
                    remarks: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grades Table */}
      <div className="grades-table-section">
        <h3>Grades List</h3>
        {loading ? (
          <div className="loading">Loading grades...</div>
        ) : (
          <div className="table-container">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>Grade</th>
                  <th>Percentage</th>
                  <th>Letter</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(grade => (
                  <tr key={grade._id}>
                    <td>{grade.student?.name}</td>
                    <td>{grade.subject?.name}</td>
                    <td>{grade.class?.name}</td>
                    <td>{grade.gradeType}</td>
                    <td>{grade.gradeValue}/{grade.maxMarks}</td>
                    <td>{grade.percentage?.toFixed(1)}%</td>
                    <td className={`grade-letter grade-${getGradeLetter(grade.percentage).toLowerCase()}`}>
                      {getGradeLetter(grade.percentage)}
                    </td>
                    <td>{grade.semester}</td>
                    <td>{grade.academicYear}</td>
                    <td>
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(grade)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(grade._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {grades.length === 0 && (
              <div className="no-data">No grades found for the selected filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades; 