# College ERP Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend directory with the following content:
   ```env
   MONGODB_URI=mongodb://localhost:27017/college_erp
   JWT_SECRET=your_jwt_secret
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- User roles: Admin, Department Admin, Faculty, Student
- Class, Department, Subject, Attendance, Timetable management
- Real-time chat (Socket.io)
- Complaints and Notice Board 