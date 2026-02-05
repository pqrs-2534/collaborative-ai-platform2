const mongoose = require('mongoose');

const WhiteboardSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: 'Main Whiteboard'
  },
  objects: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['rect', 'circle', 'line', 'text', 'image', 'sticky', 'arrow', 'path']
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    position: {
      x: Number,
      y: Number
    },
    dimensions: {
      width: Number,
      height: Number
    },
    style: {
      fill: String,
      stroke: String,
      strokeWidth: Number,
      opacity: Number
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  background: {
    type: String,
    default: '#ffffff'
  },
  gridEnabled: {
    type: Boolean,
    default: true
  },
  snapToGrid: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  activeUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cursorPosition: {
      x: Number,
      y: Number
    },
    color: String,
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Increment version on save
WhiteboardSchema.pre('save', function(next) {
  if (this.isModified('objects')) {
    this.version += 1;
  }
  next();
});

// Index
WhiteboardSchema.index({ projectId: 1 });

module.exports = mongoose.model('Whiteboard', WhiteboardSchema);