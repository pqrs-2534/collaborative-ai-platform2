const ChatMessage = require('../models/ChatMessage');

// @desc    Get chat messages for a project
// @route   GET /api/chat/:projectId/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, before } = req.query;

    const query = {
      projectId,
      isDeleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'name email avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   POST /api/chat/:projectId/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { messageIds } = req.body;

    await ChatMessage.updateMany(
      {
        _id: { $in: messageIds },
        projectId
      },
      {
        $addToSet: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};