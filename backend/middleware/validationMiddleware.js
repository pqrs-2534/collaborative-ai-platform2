const { validationResult } = require('express-validator');

// Validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Common validators
const { body, param, query } = require('express-validator');

const validators = {
  // User validators
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  // Project validators
  createProject: [
    body('name')
      .trim()
      .notEmpty().withMessage('Project name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['planning', 'active', 'on_hold', 'completed', 'archived'])
      .withMessage('Invalid status')
  ],

  // Task validators
  createTask: [
    body('title')
      .trim()
      .notEmpty().withMessage('Task title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Task title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('project')
      .notEmpty().withMessage('Project ID is required')
      .isMongoId().withMessage('Invalid project ID'),
    body('status')
      .optional()
      .isIn(['todo', 'in_progress', 'review', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority')
  ],

  // MongoDB ID validator
  mongoId: [
    param('id')
      .isMongoId().withMessage('Invalid ID format')
  ],

  // Pagination validators
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};

module.exports = {
  validate,
  validators
};