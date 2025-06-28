import React from 'react';
import '../styles/attendance.css';
import { useNavigate } from 'react-router-dom';

export default function Attendance() {
  const navigate = useNavigate();

  return (
    <div className="attendance-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        Back to Dashboard
      </button>
      
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance</h1>
        <p className="attendance-subtitle">Track and manage your attendance records here.</p>
      </div>
      <div className="attendance-card">
        <div className="attendance-card-header">
          <h2 className="attendance-card-title">Today's Attendance</h2>
        </div>
        <div className="attendance-card-body">
          {/* Example attendance table */}
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-06-01</td>
                <td><span className="attendance-status present">Present</span></td>
              </tr>
              <tr>
                <td>2024-05-31</td>
                <td><span className="attendance-status absent">Absent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 