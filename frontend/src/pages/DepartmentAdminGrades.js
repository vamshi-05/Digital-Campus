import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import '../styles/department-admin-grades.css';

const DepartmentAdminGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [semesterResults, setSemesterResults] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    classId: '',
    semester: '',
    academicYear: '',
    marks: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    classId: '',
    subjectId: '',
    semester: '',
    academicYear: ''
  });

  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const academicYears = ['2023-24', '2024-25', '2025-26'];

  useEffect(() => {
    if (user.role === 'departmentAdmin') {
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

      const response = await axios.get(`/grade/faculty-grades?${params}`);
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

  const fetchSemesterResults = async (studentId) => {
    try {
      const response = await axios.get(`/grade/semester-results/${studentId}`);
      setSemesterResults(response.data);
    } catch (err) {
      console.error('Failed to fetch semester results:', err);
    }
  };

  const handleStudentSelect = async (studentId) => {
    const student = students.find(s => s._id === studentId);
    setSelectedStudent(student);
    if (studentId) {
      await fetchSemesterResults(studentId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        await axios.put(`/grade/external-marks/${editingGrade._id}`, {
          marks: parseInt(formData.marks)
        });
        setEditingGrade(null);
      } else {
        await axios.post('/grade/external-marks', formData);
      }
      
      setFormData({
        studentId: '',
        subjectId: '',
        classId: '',
        semester: '',
        academicYear: '',
        marks: ''
      });
      setShowAddForm(false);
      fetchGrades();
      if (selectedStudent) {
        await fetchSemesterResults(selectedStudent._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save external marks');
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
      marks: grade.externalMarks || ''
    });
    setShowAddForm(true);
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+') return '#4CAF50';
    if (grade === 'A') return '#8BC34A';
    if (grade === 'B+') return '#FFC107';
    if (grade === 'B') return '#FF9800';
    if (grade === 'C+') return '#FF5722';
    if (grade === 'C') return '#F44336';
    return '#9E9E9E';
  };

  const getSGPAStatus = (sgpa) => {
    if (sgpa >= 8.5) return { color: '#4CAF50', label: 'Excellent' };
    if (sgpa >= 7.5) return { color: '#8BC34A', label: 'Very Good' };
    if (sgpa >= 6.5) return { color: '#FFC107', label: 'Good' };
    if (sgpa >= 5.5) return { color: '#FF9800', label: 'Average' };
    return { color: '#F44336', label: 'Needs Improvement' };
  };

  if (user.role !== 'departmentAdmin') {
    return (
      <div className="dept-admin-grades-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Only department administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dept-admin-grades-container">
      <div className="dept-admin-grades-header">
        <h1>Manage External Marks</h1>
        <button 
          className="add-marks-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add External Marks
        </button>
      </div>

      {/* Student Selection */}
      <div className="student-selection-section">
        <h3>Select Student</h3>
        <select
          value={selectedStudent?._id || ''}
          onChange={(e) => handleStudentSelect(e.target.value)}
          className="student-select"
        >
          <option value="">Choose a student to view detailed results</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.rollNumber} - {student.semester}
            </option>
          ))}
        </select>
      </div>

      {/* Semester Results for Selected Student */}
      {selectedStudent && (
        <div className="semester-results-section">
          <h3>Academic Progress - {selectedStudent.name}</h3>
          <div className="results-grid">
            {semesterResults.map((result, index) => {
              const sgpaStatus = getSGPAStatus(result.sgpa);
              return (
                <div key={result._id} className="result-card">
                  <div className="result-header">
                    <h4>{result.semester}</h4>
                    <span className={`status-badge ${result.isCompleted ? 'completed' : 'pending'}`}>
                      {result.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="result-details">
                    <div className="sgpa-display">
                      <span className="label">SGPA:</span>
                      <span 
                        className="sgpa-value"
                        style={{ color: sgpaStatus.color }}
                      >
                        {result.sgpa.toFixed(2)}
                      </span>
                      <span className="sgpa-label" style={{ color: sgpaStatus.color }}>
                        {sgpaStatus.label}
                      </span>
                    </div>
                    <div className="credits-info">
                      <span>Credits: {result.earnedCredits}/{result.totalCredits}</span>
                    </div>
                    {result.hasBacklog && (
                      <div className="backlog-warning">
                        <span>⚠️ Backlog: {result.backlogSubjects.length} subjects</span>
                      </div>
                    )}
                  </div>
                  {index === semesterResults.length - 1 && (
                    <div className="cgpa-display">
                      <span className="label">CGPA:</span>
                      <span className="cgpa-value">
                        {result.cgpa.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingGrade ? 'Edit External Marks' : 'Add External Marks'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGrade(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="marks-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Student</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                    disabled={!!editingGrade}
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
                    disabled={!!editingGrade}
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
                    disabled={!!editingGrade}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    required
                    disabled={!!editingGrade}
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Academic Year</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    required
                    disabled={!!editingGrade}
                  >
                    <option value="">Select Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>External Marks (0-60)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    required
                    placeholder="Enter external marks"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingGrade ? 'Update Marks' : 'Add Marks'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGrade(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grades Table */}
      <div className="grades-section">
        <h3>External Marks Management</h3>
        {loading ? (
          <div className="loading">Loading grades...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Semester</th>
                  <th>Mid Exam 1</th>
                  <th>Mid Exam 2</th>
                  <th>Internal Marks</th>
                  <th>External Marks</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(grade => (
                  <tr key={grade._id}>
                    <td>
                      <div className="student-info">
                        <strong>{grade.student.name}</strong>
                        <span>{grade.student.rollNumber}</span>
                      </div>
                    </td>
                    <td>{grade.subject.name}</td>
                    <td>{grade.class.name}</td>
                    <td>{grade.semester}</td>
                    <td className={grade.midExam1 !== null ? 'marks-entered' : 'marks-pending'}>
                      {grade.midExam1 !== null ? grade.midExam1 : 'Pending'}
                    </td>
                    <td className={grade.midExam2 !== null ? 'marks-entered' : 'marks-pending'}>
                      {grade.midExam2 !== null ? grade.midExam2 : 'Pending'}
                    </td>
                    <td className={grade.internalMarks !== null ? 'marks-entered' : 'marks-pending'}>
                      {grade.internalMarks !== null ? grade.internalMarks : 'Pending'}
                    </td>
                    <td className={grade.externalMarks !== null ? 'marks-entered' : 'marks-pending'}>
                      {grade.externalMarks !== null ? grade.externalMarks : 'Pending'}
                    </td>
                    <td className={grade.totalMarks !== null ? 'marks-entered' : 'marks-pending'}>
                      {grade.totalMarks !== null ? grade.totalMarks : 'Pending'}
                    </td>
                    <td>
                      {grade.grade && (
                        <span 
                          className="grade-badge"
                          style={{ backgroundColor: getGradeColor(grade.grade) }}
                        >
                          {grade.grade}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(grade)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAdminGrades; 