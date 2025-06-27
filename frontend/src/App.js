import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Classes from './pages/Classes';
import Complaints from './pages/Complaints';
import Departments from './pages/Departments';
import Notices from './pages/Notices';
import Timetable from './pages/Timetable';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Page placeholders
const Home = () => <h2>Welcome to Digital Campus</h2>;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

function App() {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Digital Campus</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/attendance">Attendance</Nav.Link>
              <Nav.Link as={Link} to="/classes">Classes</Nav.Link>
              <Nav.Link as={Link} to="/complaints">Complaints</Nav.Link>
              <Nav.Link as={Link} to="/departments">Departments</Nav.Link>
              <Nav.Link as={Link} to="/notices">Notices</Nav.Link>
              <Nav.Link as={Link} to="/timetable">Timetable</Nav.Link>
              <Nav.Link as={Link} to="/chat">Chat</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-4">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><PageWrapper><Attendance /></PageWrapper></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><PageWrapper><Classes /></PageWrapper></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><PageWrapper><Complaints /></PageWrapper></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><PageWrapper><Departments /></PageWrapper></ProtectedRoute>} />
            <Route path="/notices" element={<ProtectedRoute><PageWrapper><Notices /></PageWrapper></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute><PageWrapper><Timetable /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </Container>
    </>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
