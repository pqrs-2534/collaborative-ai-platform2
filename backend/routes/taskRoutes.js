const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  bulkUpdateTaskPositions
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', protect, validators.createTask, validate, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, validators.mongoId, validate, getTask);
router.put('/:id', protect, validators.mongoId, validate, updateTask);
router.delete('/:id', protect, validators.mongoId, validate, deleteTask);
router.put('/bulk-update', protect, bulkUpdateTaskPositions);

module.exports = router;