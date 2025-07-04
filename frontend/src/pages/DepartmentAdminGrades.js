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
  const [editing, setEditing] = useState({}); // { gradeId: true/false }
  const [isEditAll, setIsEditAll] = useState(false);
  const [externalMarks, setExternalMarks] = useState({}); // { gradeId: value }
  const [success, setSuccess] = useState('');
  
  // New state for selection and filtering
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const academicYears = ['2023-24', '2024-25', '2025-26'];

  useEffect(() => {
    if (user.role === 'departmentAdmin') {
      fetchClasses();
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSemester) {
      setFilteredClasses(classes.filter(cls => cls.semester === selectedSemester));
      setSelectedClass('');
      setFilteredSubjects([]);
      setSelectedSubject('');
      setFilteredStudents([]);
      setGrades([]);
    }
  }, [selectedSemester, classes]);

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find(c => c._id === selectedClass);
      if (cls && Array.isArray(cls.subjects)) {
        setFilteredSubjects(cls.subjects.map(s => s.subject));
      } else {
        setFilteredSubjects([]);
      }
      setSelectedSubject('');
      setFilteredStudents([]);
      setGrades([]);
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    console.log(students);
    console.log(selectedClass);
    if (selectedClass && students.length > 0) {
      setFilteredStudents(students.filter(s => s.class === selectedClass));
    } else {
      setFilteredStudents([]);
    }
    console.log(filteredStudents);
  }, [selectedClass, students]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchGrades(selectedClass, selectedSubject);
    } else {
      setGrades([]);
      setExternalMarks({});
    }
  }, [selectedClass, selectedSubject]);

  const fetchGrades = async (classId, subjectId) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('classId', classId);
      params.append('subjectId', subjectId);
      const response = await axios.get(`/grade/faculty-grades?${params}`);
      console.log(response.data);
      setGrades(response.data);
      // Initialize externalMarks state
      const extMarks = {};
      response.data.forEach(g => {
        extMarks[g._id] = g.externalMarks ?? '';
      });
      setExternalMarks(extMarks);
    } catch (err) {
      setError('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const response = await axios.get(`/class/${classId}/students`);
      console.log(response.data);
      setStudents(response.data);
    } catch (err) {
      setStudents([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subject/all');
      setSubjects(response.data);
    } catch (err) {
      setSubjects([]);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/class/all');
      setClasses(response.data);
    } catch (err) {
      setClasses([]);
    }
  };

  const handleEdit = (gradeId) => {
    setEditing(prev => ({ ...prev, [gradeId]: true }));
    setIsEditAll(false);
  };

  const handleEditAll = () => {
    const newEditing = {};
    grades.forEach(g => {
      newEditing[g._id] = true;
    });
    setEditing(newEditing);
    setIsEditAll(true);
  };

  const handleExternalMarkChange = (gradeId, value) => {
    setExternalMarks(prev => ({ ...prev, [gradeId]: value }));
    setEditing(prev => ({ ...prev, [gradeId]: true }));
  };

  const handleSave = async (gradeId) => {
    setLoading(true);
    setError('');
    try {
      await axios.put(`/grade/external-marks/${gradeId}`, {
        marks: externalMarks[gradeId] !== '' ? Number(externalMarks[gradeId]) : undefined
      });
      setEditing(prev => ({ ...prev, [gradeId]: false }));
      setSuccess('Marks saved!');
      fetchGrades(selectedClass, selectedSubject);
    } catch (err) {
      setError('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError('');
    try {
      for (const grade of grades) {
        await axios.put(`/grade/external-marks/${grade._id}`, {
          marks: externalMarks[grade._id] !== '' ? Number(externalMarks[grade._id]) : undefined
        });
      }
      setSuccess('All marks saved!');
      setIsEditAll(false);
      setEditing({});
      fetchGrades(selectedClass, selectedSubject);
    } catch (err) {
      setError('Failed to save all marks');
    } finally {
      setLoading(false);
    }
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
      
      <div className="filters-section">
        <div className="filters-grid">
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            disabled={!selectedSemester}
          >
            <option value="">Select Class</option>
            {filteredClasses.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.fullName || cls.name}</option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map(sub => (
              <option key={sub} value={sub}>{subjects.find(s => s._id === sub)?.name}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {console.log(filteredStudents)}
      {loading ? (
        ""
        // <div className="loading">Loading...</div>
      ) : selectedSemester && selectedClass && selectedSubject && filteredStudents ? (
        
        <div className="grades-section">
          <h3>External Marks Management</h3>
          <div className="dept-admin-grades-header">
        <h1>Manage External Marks</h1>
        <button className="edit-btn" onClick={handleEditAll} style={{ float: 'right', marginBottom: 10, marginLeft:'20%', marginRight:'20%', padding: 10, width:20 }} disabled={isEditAll}>
          Edit All
        </button>
        {isEditAll && (
          <button className="submit-btn" onClick={handleSaveAll} style={{ float: 'right', marginBottom: 10, marginRight: 100 }}>
            Save All
          </button>
        )}
      </div>
          <div className="table-container">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Mid 1</th>
                  <th>Mid 2</th>
                  <th>External Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log(grades)} */}
                {grades.length === 0 && <tr><td colSpan={3}>Faculty Not Updated Internal Marks</td></tr>}
                {grades.map(grade => {
                  const student = filteredStudents.find(s => s._id === grade.student._id);
                  if (!student) return null;
                  const isEditing = !!editing[grade._id];
                  return (
                    <tr key={grade._id}>
                      <td>
                        <div className="student-info">
                          <strong>{student.name}</strong>
                          <span>{student.rollNumber}</span>
                        </div>
                      </td>
                      <td>{grade.midExam1}</td>
                      <td>{grade.midExam2}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={externalMarks[grade._id] ?? ''}
                          disabled={!isEditAll && !isEditing}
                          onChange={e => handleExternalMarkChange(grade._id, e.target.value)}
                          style={{ width: 70 }}
                        />
                      </td>
                      <td>
                        {!isEditAll && (
                          !isEditing ? (
                            <button className="edit-btn" onClick={() => handleEdit(grade._id)}>Edit</button>
                          ) : (
                            <button className="submit-btn" onClick={() => handleSave(grade._id)}>Save</button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DepartmentAdminGrades; 