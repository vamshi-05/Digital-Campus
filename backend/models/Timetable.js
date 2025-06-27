const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  schedule: [
    {
      day: String, // e.g., Monday
      periods: [
        {
          subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
          startTime: String,
          endTime: String,
        },
      ],
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema); 