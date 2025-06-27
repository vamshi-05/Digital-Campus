const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'departmentAdmin', 'faculty', 'student'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // for faculty, departmentAdmin, student
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // for students
  section: { type: String }, // for students
}, { timestamps: true });

userSchema.statics.seedAdmin = async function() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.warn('Admin email or password not set in .env');
    return;
  }
  const existingAdmin = await this.findOne({ email: adminEmail, role: 'admin' });
  if (!existingAdmin) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user seeded');
  } else {
    console.log('Admin user already exists');
  }
};

module.exports = mongoose.model('User', userSchema); 