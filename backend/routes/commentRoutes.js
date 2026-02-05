const express = require('express');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  addReaction
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', protect, createComment);
router.get('/', protect, getComments);
router.put('/:id', protect, validators.mongoId, validate, updateComment);
router.delete('/:id', protect, validators.mongoId, validate, deleteComment);
router.post('/:id/reactions', protect, validators.mongoId, validate, addReaction);

module.exports = router;