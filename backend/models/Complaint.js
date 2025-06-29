const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  trackingNumber: { 
    type: String, 
    unique: true 
  },
  complainant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  against: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  category: { 
    type: String, 
    enum: ['Academic', 'Behavioral', 'Infrastructure', 'Administrative', 'Other'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  isAnonymous: { 
    type: Boolean, 
    default: false 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    fileType: String
  }],
  internalNotes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  responses: [{
    response: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date, default: Date.now }
  }],
  escalatedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  escalatedAt: { 
    type: Date 
  },
  resolvedAt: { 
    type: Date 
  },
  closedAt: { 
    type: Date 
  },
  resolutionTime: { 
    type: Number // in hours
  },
  satisfactionRating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  satisfactionComment: { 
    type: String 
  }
}, { timestamps: true });

// Generate tracking number before saving
complaintSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.trackingNumber = `COMP-${year}-${random}`;
  }
  next();
});

// Index for efficient querying
complaintSchema.index({ trackingNumber: 1 });
complaintSchema.index({ complainant: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema); 