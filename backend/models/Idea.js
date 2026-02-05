const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Idea text is required'],
    maxlength: [5000, 'Idea text cannot exceed 5000 characters']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    maxlength: [1000, 'Prompt cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['feature', 'improvement', 'bug_fix', 'design', 'research', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'rejected', 'implemented'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: Number,
      enum: [-1, 1] // -1 for downvote, 1 for upvote
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiModel: {
    type: String // e.g., 'gpt-4', 'gemini-pro'
  },
  refinements: [{
    text: String,
    refinedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate vote score
IdeaSchema.virtual('voteScore').get(function() {
  return this.votes.reduce((sum, vote) => sum + vote.vote, 0);
});

// Indexes
IdeaSchema.index({ projectId: 1, createdAt: -1 });
IdeaSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Idea', IdeaSchema);