import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const dashboardItems = [
    {
      title: 'Manage Department Admins',
      description: 'Add, edit, and manage department administrators',
      icon: '👥',
      action: () => navigate('/super-admin/department-admins'),
      variant: 'primary'
    },
    {
      title: 'Manage Departments',
      description: 'Add, edit, and manage departments',
      icon: '🏢',
      action: () => navigate('/super-admin/departments'),
      variant: 'info'
    },
    {
      title: 'View All Departments',
      description: 'Overview of all departments and their admins',
      icon: '📋',
      action: () => navigate('/super-admin/departments-overview'),
      variant: 'secondary'
    },
    {
      title: 'System Overview',
      description: 'View system statistics and analytics',
      icon: '📊',
      action: () => navigate('/super-admin/analytics'),
      variant: 'success'
    },
    {
      title: 'User Management',
      description: 'Manage all users across departments',
      icon: '👤',
      action: () => navigate('/super-admin/users'),
      variant: 'warning'
    }
  ];

  return (
    <div className="super-admin-dashboard-container">
     
      
      <div className="super-admin-dashboard-header">
        <Container>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-4">
              <Card.Body>
                <h2>Super Admin Dashboard</h2>
                <p className="text-muted">Welcome back, {user?.name}!</p>
                <p>Manage the entire Digital Campus system from here.</p>
              </Card.Body>
            </Card>

            <Row>
              {dashboardItems.map((item, index) => (
                <Col key={index} md={6} lg={3} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-100 shadow-sm" 
                      style={{ cursor: 'pointer' }}
                      onClick={item.action}
                    >
                      <Card.Body className="text-center">
                        <div className="mb-3" style={{ fontSize: '2rem' }}>
                          {item.icon}
                        </div>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {item.description}
                        </Card.Text>
                        <Button variant={item.variant} size="sm">
                          Access
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </div>
    </div>
  );
} 