import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4">
          <Card.Body>
            <h2>Welcome, {user?.name || 'User'}!</h2>
            <p>Role: <strong>{user?.role}</strong></p>
          </Card.Body>
        </Card>
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'faculty' && <FacultyDashboard />}
        {user?.role === 'student' && <StudentDashboard />}
      </motion.div>
    </Container>
  );
}

function AdminDashboard() {
  return (
    <Card><Card.Body>
      <h4>Admin Panel</h4>
      <ul>
        <li>Manage Departments</li>
        <li>Manage Classes</li>
        <li>View All Complaints</li>
        <li>Post Notices</li>
        <li>View Timetables</li>
      </ul>
    </Card.Body></Card>
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