import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <Card.Body>
                <h3 className="mb-4 text-center">Register</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} required autoFocus />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select name="role" value={form.role} onChange={handleChange} required>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
} 