
const Task = require('../models/Task');
const Project = require('../models/Project');
const { getPagination, paginationResponse } = require('../utils/helpers');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    // Verify project exists and user has access
    const project = await Project.findById(req.body.project);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const taskData = {
      ...req.body,
      createdBy: req.user._id
    };

    const task = await Task.create(taskData);
    await task.populate(['assignedTo', 'createdBy'], 'name email avatar');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`project_${req.body.project}`).emit('taskCreated', task);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=:projectId
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { project, status, assignedTo, page = 1, limit = 50 } = req.query;
    const { skip, limit: pageLimit } = getPagination(page, limit);

    const query = {};
    if (project) query.project = project;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name')
      .skip(skip)
      .limit(pageLimit)
      .sort({ position: 1, createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      ...paginationResponse(tasks, page, limit, total)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name status');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      startDate: req.body.startDate,
      tags: req.body.tags,
      position: req.body.position,
      estimatedHours: req.body.estimatedHours,
      actualHours: req.body.actualHours,
      checklist: req.body.checklist
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    task = await Task.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('assignedTo createdBy', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project_${task.project}`).emit('taskUpdated', task);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const projectId = task.project;
    await task.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project_${projectId}`).emit('taskDeleted', { taskId: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update task positions (for drag & drop)
// @route   PUT /api/tasks/bulk-update
// @access  Private
exports.bulkUpdateTaskPositions = async (req, res, next) => {
  try {
    const { tasks } = req.body; // Array of {id, status, position}

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks must be an array'
      });
    }

    // Update all tasks
    const updatePromises = tasks.map(task => 
      Task.findByIdAndUpdate(
        task.id,
        { status: task.status, position: task.position },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Tasks updated successfully'
    });
  } catch (error) {
    next(error);
  }
};