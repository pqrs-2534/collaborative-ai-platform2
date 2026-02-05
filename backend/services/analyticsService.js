const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

class AnalyticsService {
  // Calculate project completion percentage
  async getProjectProgress(projectId) {
    const tasks = await Task.find({ project: projectId });
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) {
      return { completionRate: 0, totalTasks: 0 };
    }

    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    return {
      completionRate,
      totalTasks,
      completedTasks,
      inProgressTasks: tasks.filter(task => task.status === 'in_progress').length,
      todoTasks: tasks.filter(task => task.status === 'todo').length,
      reviewTasks: tasks.filter(task => task.status === 'review').length
    };
  }

  // Get team activity metrics
  async getTeamActivity(projectId, days = 7) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const tasks = await Task.find({
      project: projectId,
      updatedAt: { $gte: dateLimit }
    }).populate('assignedTo createdBy', 'name email avatar');

    const activityMap = {};
    
    tasks.forEach(task => {
      const users = [...task.assignedTo, task.createdBy];
      users.forEach(user => {
        if (user) {
          const userId = user._id.toString();
          if (!activityMap[userId]) {
            activityMap[userId] = {
              user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
              },
              tasksWorkedOn: 0,
              tasksCompleted: 0,
              tasksCreated: 0
            };
          }
          activityMap[userId].tasksWorkedOn++;
          if (task.status === 'done') {
            activityMap[userId].tasksCompleted++;
          }
          if (task.createdBy._id.toString() === userId) {
            activityMap[userId].tasksCreated++;
          }
        }
      });
    });

    return Object.values(activityMap);
  }

  // Get task distribution by status
  async getTaskDistribution(projectId) {
    const tasks = await Task.find({ project: projectId });
    
    const distribution = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    };

    tasks.forEach(task => {
      distribution[task.status]++;
    });

    return distribution;
  }

  // Get overdue tasks
  async getOverdueTasks(projectId) {
    const now = new Date();
    const overdueTasks = await Task.find({
      project: projectId,
      dueDate: { $lt: now },
      status: { $ne: 'done' }
    }).populate('assignedTo', 'name email');

    return overdueTasks;
  }

  // Get productivity trends
  async getProductivityTrends(projectId, days = 30) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.setDate() - days);

    const completedTasks = await Task.find({
      project: projectId,
      status: 'done',
      completedAt: { $gte: dateLimit }
    }).sort({ completedAt: 1 });

    // Group by date
    const trendMap = {};
    completedTasks.forEach(task => {
      const date = task.completedAt.toISOString().split('T')[0];
      trendMap[date] = (trendMap[date] || 0) + 1;
    });

    // Convert to array format
    return Object.entries(trendMap).map(([date, count]) => ({
      date,
      tasksCompleted: count
    }));
  }

  // Get priority distribution
  async getPriorityDistribution(projectId) {
    const tasks = await Task.find({ project: projectId });
    
    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    tasks.forEach(task => {
      distribution[task.priority]++;
    });

    return distribution;
  }

  // Calculate average task completion time
  async getAverageCompletionTime(projectId) {
    const completedTasks = await Task.find({
      project: projectId,
      status: 'done',
      completedAt: { $exists: true }
    });

    if (completedTasks.length === 0) {
      return { averageDays: 0, totalTasks: 0 };
    }

    const totalDays = completedTasks.reduce((sum, task) => {
      const created = new Date(task.createdAt);
      const completed = new Date(task.completedAt);
      const days = (completed - created) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return {
      averageDays: Math.round(totalDays / completedTasks.length * 10) / 10,
      totalTasks: completedTasks.length
    };
  }

  // Get comprehensive project analytics
  async getComprehensiveAnalytics(projectId) {
    const [
      progress,
      teamActivity,
      taskDistribution,
      overdueTasks,
      productivityTrends,
      priorityDistribution,
      completionTime
    ] = await Promise.all([
      this.getProjectProgress(projectId),
      this.getTeamActivity(projectId),
      this.getTaskDistribution(projectId),
      this.getOverdueTasks(projectId),
      this.getProductivityTrends(projectId),
      this.getPriorityDistribution(projectId),
      this.getAverageCompletionTime(projectId)
    ]);

    return {
      progress,
      teamActivity,
      taskDistribution,
      overdueTasks,
      productivityTrends,
      priorityDistribution,
      completionTime,
      generatedAt: new Date()
    };
  }
}

module.exports = new AnalyticsService();