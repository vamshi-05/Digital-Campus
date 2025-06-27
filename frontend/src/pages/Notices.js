import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function Notices() {
  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <Card.Body>
            <h3>Notices</h3>
            <p>Notice features coming soon...</p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
} 