const express = require('express');
const {
  getMessages,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:projectId/messages', protect, getMessages);
router.post('/:projectId/read', protect, markAsRead);

module.exports = router;