const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  archiveProject
} = require('../controllers/projectController');
const { protect, checkProjectMember } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Base project routes
router.post('/', protect, validators.createProject, validate, createProject);
router.get('/', protect, getProjects);

// Specific project routes
router.get('/:id', protect, checkProjectMember, validators.mongoId, validate, getProject);
router.put('/:id', protect, checkProjectMember, validators.mongoId, validate, updateProject);
router.delete('/:id', protect, validators.mongoId, validate, deleteProject);

// Member management
router.post('/:id/members', protect, checkProjectMember, validators.mongoId, validate, addMember);
router.delete('/:id/members/:memberId', protect, checkProjectMember, validators.mongoId, validate, removeMember);

// Archive
router.put('/:id/archive', protect, validators.mongoId, validate, archiveProject);

module.exports = router;