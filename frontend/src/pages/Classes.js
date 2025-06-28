import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Classes() {
  const navigate = useNavigate();

  return (
    <div className="classes-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
      >
        Back to Dashboard
      </button>
      
      <div className="classes-header">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Card.Body>
              <h3>Classes</h3>
              <p>Class management features coming soon...</p>
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 