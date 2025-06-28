import React from 'react';
import '../styles/complaints.css';
import { useNavigate } from 'react-router-dom';

export default function Complaints() {
  const navigate = useNavigate();

  return (
    <div className="complaints-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        Back to Dashboard
      </button>
      
      <div className="complaints-header">
        <h1 className="complaints-title">Complaints</h1>
        <p className="complaints-subtitle">Submit and view your complaints here.</p>
      </div>
      <div className="complaints-card">
        <div className="complaints-card-header">
          <h2 className="complaints-card-title">Submit a Complaint</h2>
        </div>
        <div className="complaints-card-body">
          <form className="complaints-form">
            <div className="complaints-form-group">
              <label className="complaints-form-label" htmlFor="complaint">Complaint</label>
              <textarea className="complaints-form-control" id="complaint" placeholder="Describe your issue..." required />
            </div>
            <button type="submit" className="complaints-btn">Submit</button>
          </form>
        </div>
      </div>
      <div className="complaints-list">
        <div className="complaints-item">
          <div className="complaints-item-header">
            <span className="complaints-item-title">Network Issue</span>
            <span className="complaints-item-date">2024-06-01</span>
          </div>
          <div className="complaints-item-content">Internet was down in the lab.</div>
          <div className="complaints-item-footer">
            <span className="complaints-item-author">By: John Doe</span>
            <span className="complaints-status pending">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
} 