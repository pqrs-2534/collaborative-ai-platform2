const express = require('express');
const {
  getProjectAnalytics,
  getAIInsights,
  getTeamActivity
} = require('../controllers/analyticsController');
const { protect, checkProjectMember } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/projects/:projectId', protect, checkProjectMember, validators.mongoId, validate, getProjectAnalytics);
router.get('/projects/:projectId/insights', protect, checkProjectMember, validators.mongoId, validate, getAIInsights);
router.get('/teams/:projectId/activity', protect, checkProjectMember, validators.mongoId, validate, getTeamActivity);

module.exports = router;
