import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

// Page placeholders
const Home = () => <h2>Welcome to Digital Campus</h2>;
const Login = () => <h2>Login</h2>;
const Register = () => <h2>Register</h2>;
const Dashboard = () => <h2>Dashboard</h2>;
const Attendance = () => <h2>Attendance</h2>;
const Classes = () => <h2>Classes</h2>;
const Complaints = () => <h2>Complaints</h2>;
const Departments = () => <h2>Departments</h2>;
const Notices = () => <h2>Notices</h2>;
const Timetable = () => <h2>Timetable</h2>;
const Chat = () => <h2>Chat</h2>;
const Profile = () => <h2>Profile</h2>;

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
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/attendance" element={<PageWrapper><Attendance /></PageWrapper>} />
            <Route path="/classes" element={<PageWrapper><Classes /></PageWrapper>} />
            <Route path="/complaints" element={<PageWrapper><Complaints /></PageWrapper>} />
            <Route path="/departments" element={<PageWrapper><Departments /></PageWrapper>} />
            <Route path="/notices" element={<PageWrapper><Notices /></PageWrapper>} />
            <Route path="/timetable" element={<PageWrapper><Timetable /></PageWrapper>} />
            <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
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
