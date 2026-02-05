const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'archived'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'project_manager', 'team_member', 'guest'],
      default: 'team_member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  color: {
    type: String,
    default: '#4A90E2' // Default blue color
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowTasks: {
      type: Boolean,
      default: true
    },
    allowDocuments: {
      type: Boolean,
      default: true
    },
    allowWhiteboard: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for tasks
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

// Virtual for ideas
ProjectSchema.virtual('ideas', {
  ref: 'Idea',
  localField: '_id',
  foreignField: 'projectId',
  justOne: false
});

// Index for better query performance
ProjectSchema.index({ owner: 1, createdAt: -1 });
ProjectSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Project', ProjectSchema);