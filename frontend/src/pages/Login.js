import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
                <h3 className="mb-4 text-center">Login</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
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