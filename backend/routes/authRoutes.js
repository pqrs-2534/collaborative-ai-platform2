const express = require('express');
const {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', validators.register, validate, register);
router.post('/login', validators.login, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;