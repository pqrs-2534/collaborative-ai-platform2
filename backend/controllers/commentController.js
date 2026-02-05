const Comment = require('../models/Comment');

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const commentData = {
      ...req.body,
      author: req.user._id
    };

    const comment = await Comment.create(commentData);
    await comment.populate('author', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`${req.body.targetType}_${req.body.targetId}`).emit('commentAdded', comment);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a target
// @route   GET /api/comments?targetType=Task&targetId=:id
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.query;

    const comments = await Comment.find({ targetType, targetId, parentComment: null })
      .populate('author', 'name email avatar')
      .populate({
        path: 'parentComment',
        populate: { path: 'author', select: 'name email avatar' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Only author can update
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'name email avatar');

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Only author can delete
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reaction to comment
// @route   POST /api/comments/:id/reactions
// @access  Private
exports.addReaction = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Remove existing reaction from this user
    comment.reactions = comment.reactions.filter(
      r => r.user.toString() !== req.user._id.toString() || r.emoji !== emoji
    );

    // Add new reaction
    comment.reactions.push({ user: req.user._id, emoji });
    await comment.save();

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};