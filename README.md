# Digital Campus Management System

A comprehensive MERN stack application for managing campus operations including user management, notices, complaints, real-time chat, attendance tracking, and more.

## 🚀 Features

### Core Features
- **Multi-Role Authentication**: Admin, Department Admin, Faculty, Student
- **User Management**: Complete CRUD operations with role-based access
- **Department Management**: Organize users by departments
- **Class Management**: Manage classes and sections
- **Subject Management**: Handle course subjects and assignments

### Communication Features
- **Notice Board**: Publish and manage notices with file attachments
- **Complaints Center**: Submit and track complaints with status updates
- **Real-time Chat**: Instant messaging between users
- **Email Notifications**: Automated email alerts for important events

### Academic Features
- **Attendance Tracking**: Mark and view attendance records
- **Grade Management**: Submit and view student grades
- **Timetable Management**: Create and manage class schedules

### Advanced Features
- **File Upload System**: Support for multiple file types
- **Real-time Notifications**: Socket.io powered live updates
- **Dashboard Analytics**: Comprehensive statistics and insights
- **Search and Filtering**: Advanced search capabilities
- **Pagination**: Efficient data loading
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io-client** - Real-time features
- **CSS3** - Styling

### Testing
- **Jest** - Testing framework
- **Supertest** - API testing
- **MongoDB Memory Server** - In-memory database for tests

## 📁 Project Structure

```
Digital Campus/
├── backend/
│   ├── controllers/          # Business logic
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middlewares
│   ├── services/            # External services
│   ├── sockets/             # Socket.io handlers
│   ├── uploads/             # File uploads
│   ├── tests/               # Test files
│   └── server.js            # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── api/             # API configuration
│   │   ├── styles/          # CSS files
│   │   └── utils/           # Utility functions
│   └── public/              # Static files
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Digital-Campus
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/digital-campus
   JWT_SECRET=your-secret-key
   PORT=5000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   
   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Base URL for file uploads
   BASE_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

## 🧪 Testing

### Run Tests
```bash
cd backend
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/all` - Get all users
- `POST /api/user/create` - Create new user
- `PUT /api/user/update/:id` - Update user
- `DELETE /api/user/delete/:id` - Delete user

### Notice Management
- `GET /api/notice/all` - Get all notices
- `POST /api/notice/create` - Create notice
- `PUT /api/notice/update/:id` - Update notice
- `DELETE /api/notice/delete/:id` - Delete notice

### Complaint Management
- `GET /api/complaint/all` - Get all complaints
- `POST /api/complaint/create` - Create complaint
- `PUT /api/complaint/update/:id` - Update complaint

### Chat System
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:chatId` - Get chat messages

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activities` - Get recent activities
- `GET /api/dashboard/upcoming-events` - Get upcoming events

## 🔐 Role-Based Access Control

### Admin
- Full system access
- User management
- Department management
- System-wide notices
- Complaint management

### Department Admin
- Department-specific access
- Faculty and student management
- Department notices
- Department complaints

### Faculty
- Class management
- Attendance tracking
- Grade submission
- Student communication

### Student
- View notices
- Submit complaints
- View grades
- Chat with faculty

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Frontend Deployment (Netlify)
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy to Netlify or Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added real-time chat and file uploads
- **v1.2.0** - Enhanced dashboard and analytics
- **v1.3.0** - Added email notifications and testing

## 🎯 Roadmap

- [ ] Video conferencing integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with external LMS
- [ ] Multi-language support
- [ ] Advanced reporting system 