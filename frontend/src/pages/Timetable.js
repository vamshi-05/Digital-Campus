import React from 'react';
import '../styles/timetable.css';
import { useNavigate } from 'react-router-dom';

export default function Timetable() {
  const navigate = useNavigate();

  return (
    <div className="timetable-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        Back to Dashboard
      </button>
      
      <div className="timetable-header">
        <h1 className="timetable-title">Timetable</h1>
        <p className="timetable-subtitle">View your class schedule below.</p>
      </div>
      <div className="timetable-card">
        <div className="timetable-card-header">
          <h2 className="timetable-card-title">Weekly Timetable</h2>
        </div>
        <div className="timetable-card-body">
          <div className="timetable-grid">
            <div className="timetable-header-cell">Time</div>
            <div className="timetable-header-cell">Mon</div>
            <div className="timetable-header-cell">Tue</div>
            <div className="timetable-header-cell">Wed</div>
            <div className="timetable-header-cell">Thu</div>
            <div className="timetable-header-cell">Fri</div>
            {/* Example timetable slots */}
            <div className="timetable-time-cell">9:00</div>
            <div className="timetable-slot has-class">
              <span className="timetable-class-name">Math</span>
              <span className="timetable-class-teacher">Mr. Smith</span>
              <span className="timetable-class-room">Room 101</span>
            </div>
            <div className="timetable-slot empty">-</div>
            <div className="timetable-slot has-class">
              <span className="timetable-class-name">Physics</span>
              <span className="timetable-class-teacher">Ms. Lee</span>
              <span className="timetable-class-room">Room 102</span>
            </div>
            <div className="timetable-slot empty">-</div>
            <div className="timetable-slot has-class">
              <span className="timetable-class-name">Chemistry</span>
              <span className="timetable-class-teacher">Dr. Brown</span>
              <span className="timetable-class-room">Room 103</span>
            </div>
            {/* Add more rows as needed */}
          </div>
        </div>
      </div>
    </div>
  );
} 