const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Admin only routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.put('/:id', protect, authorizeRoles('admin'), validators.mongoId, validate, updateUser);
router.delete('/:id', protect, authorizeRoles('admin'), validators.mongoId, validate, deleteUser);
router.put('/:id/role', protect, authorizeRoles('admin'), validators.mongoId, validate, updateUserRole);

// All authenticated users
router.get('/:id', protect, validators.mongoId, validate, getUser);

module.exports = router;
