import React from 'react';
import '../styles/notices.css';
import { useNavigate } from 'react-router-dom';

export default function Notices() {
  const navigate = useNavigate();

  return (
    <div className="notices-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        Back to Dashboard
      </button>
      
      <div className="notices-header">
        <h1 className="notices-title">Notices</h1>
        <p className="notices-subtitle">Stay updated with the latest notices.</p>
      </div>
      <div className="notices-card">
        <div className="notices-card-header">
          <h2 className="notices-card-title">New Notice</h2>
        </div>
        <div className="notices-card-body">
          <form className="notices-form">
            <div className="notices-form-group">
              <label className="notices-form-label" htmlFor="notice">Notice</label>
              <textarea className="notices-form-control" id="notice" placeholder="Write a notice..." required />
            </div>
            <button type="submit" className="notices-btn">Post Notice</button>
          </form>
        </div>
      </div>
      <div className="notices-list">
        <div className="notices-item">
          <div className="notices-item-header">
            <span className="notices-item-title">Holiday Announcement</span>
            <span className="notices-item-date">2024-06-01</span>
          </div>
          <div className="notices-item-content">Campus will be closed on June 5th for maintenance.</div>
          <div className="notices-item-footer">
            <span className="notices-item-author">By: Admin</span>
            <span className="notices-priority high">High</span>
          </div>
        </div>
      </div>
    </div>
  );
} 