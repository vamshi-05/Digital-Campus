import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function Classes() {
  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <Card.Body>
            <h3>Classes</h3>
            <p>Class management features coming soon...</p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
} 