const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  against: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['student', 'faculty', 'other'], required: true },
  status: { type: String, enum: ['open', 'in progress', 'resolved'], default: 'open' },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema); 