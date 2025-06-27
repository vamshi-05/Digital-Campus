const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  monitoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema); 