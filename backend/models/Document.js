const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  currentContent: {
    type: String,
    default: ''
  },
  versions: [{
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeNote: {
      type: String,
      maxlength: [500, 'Change note cannot exceed 500 characters']
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save hook to create version on content update
DocumentSchema.pre('save', function(next) {
  if (this.isModified('currentContent') && this.currentContent !== undefined) {
    // Don't create version if it's the first save
    if (!this.isNew) {
      this.versions.push({
        content: this.currentContent,
        editedBy: this.lastEditedBy || this.createdBy,
        timestamp: new Date()
      });
    }
    this.updatedAt = Date.now();
  }
  next();
});

// Indexes
DocumentSchema.index({ projectId: 1, createdAt: -1 });
DocumentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Document', DocumentSchema);