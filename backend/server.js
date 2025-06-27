const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mainRouter = require('./routes');
const chatSocketHandler = require('./sockets/chat');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- ROUTES ---
app.get('/', (req, res) => res.send('College ERP API running'));
// TODO: Add auth, user, class, department, subject, attendance, timetable, chat, complaint, notice routes
app.use('/api', mainRouter);

// --- SOCKET.IO ---
chatSocketHandler(io);

// --- SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 