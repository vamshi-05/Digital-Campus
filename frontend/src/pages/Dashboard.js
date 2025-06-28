import React from 'react';
import '../styles/dashboard.css';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect Admin (Super Admin) to their dedicated dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <div className="dashboard-container">
     
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to your dashboard. Here you can find a quick overview and access to all features.</p>
      </div>
      <div className="dashboard-grid">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-4">
            <Card.Body>
              <h2>Welcome, {user?.name || 'User'}!</h2>
              <p>Role: <strong>{user?.role}</strong></p>
            </Card.Body>
          </Card>
          {user?.role === 'faculty' && <FacultyDashboard />}
          {user?.role === 'student' && <StudentDashboard />}
          {user?.role === 'departmentAdmin' && <DepartmentAdminDashboard />}
        </motion.div>
        {/* Example dashboard cards */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Attendance</h2>
            <p className="dashboard-card-subtitle">View and manage attendance</p>
          </div>
          <div className="dashboard-card-body">
            <div className="dashboard-stat">
              <span className="dashboard-stat-label">Total Days</span>
              <span className="dashboard-stat-value">180</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat-label">Present</span>
              <span className="dashboard-stat-value">170</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Classes</h2>
            <p className="dashboard-card-subtitle">Manage your classes</p>
          </div>
          <div className="dashboard-card-body">
            <div className="dashboard-stat">
              <span className="dashboard-stat-label">Total Classes</span>
              <span className="dashboard-stat-value">12</span>
            </div>
          </div>
        </div>
        {/* Add more dashboard cards as needed */}
      </div>
    </div>
  );
}

function FacultyDashboard() {
  return (
    <Card><Card.Body>
      <h4>Faculty Panel</h4>
      <ul>
        <li>Mark/View Attendance</li>
        <li>View Classes</li>
        <li>View/Respond to Complaints</li>
        <li>Post Notices</li>
        <li>View Timetables</li>
      </ul>
    </Card.Body></Card>
  );
}

function StudentDashboard() {
  return (
    <Card><Card.Body>
      <h4>Student Panel</h4>
      <ul>
        <li>View Attendance</li>
        <li>View Classes</li>
        <li>Submit Complaints</li>
        <li>View Notices</li>
        <li>View Timetables</li>
      </ul>
    </Card.Body></Card>
  );
}

function DepartmentAdminDashboard() {
  return (
    <Card><Card.Body>
      <h4>Department Admin Panel</h4>
      <ul>
        <li>Manage Department Students</li>
        <li>Manage Department Faculty</li>
        <li>View Department Complaints</li>
        <li>Post Department Notices</li>
        <li>View Department Timetables</li>
        <li>Manage Department Classes</li>
      </ul>
    </Card.Body></Card>
  );
} 