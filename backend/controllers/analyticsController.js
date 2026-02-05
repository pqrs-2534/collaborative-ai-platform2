const analyticsService = require('../services/analyticsService');
const aiService = require('../services/aiService');
const Project = require('../models/Project');

// @desc    Get project analytics
// @route   GET /api/analytics/projects/:projectId
// @access  Private
exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getComprehensiveAnalytics(req.params.projectId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-powered insights
// @route   GET /api/analytics/projects/:projectId/insights
// @access  Private
exports.getAIInsights = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const analytics = await analyticsService.getComprehensiveAnalytics(req.params.projectId);

    const projectData = {
      name: project.name,
      taskCount: analytics.progress.totalTasks,
      completedTasks: analytics.progress.completedTasks,
      memberCount: project.members.length,
      duration: project.endDate && project.startDate 
        ? Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))
        : 0
    };

    const insights = await aiService.generateProjectInsights(projectData);

    res.json({
      success: true,
      data: {
        insights: insights.generated_text,
        analytics
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team activity
// @route   GET /api/analytics/teams/:projectId/activity
// @access  Private
exports.getTeamActivity = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const activity = await analyticsService.getTeamActivity(req.params.projectId, parseInt(days));

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};
