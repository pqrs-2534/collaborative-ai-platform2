const Project = require('../models/Project');
const Task = require('../models/Task');
const { getPagination, paginationResponse, generateRandomColor } = require('../utils/helpers');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user._id,
      color: req.body.color || generateRandomColor(),
      members: [{
        user: req.user._id,
        role: 'admin',
        joinedAt: new Date()
      }]
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const { skip, limit: pageLimit } = getPagination(page, limit);

    // Build query - user is either owner or member
    const query = {
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ],
      isArchived: false
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      ...paginationResponse(projects, page, limit, total)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private (must be project member)
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members.user', 'name email avatar role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get task statistics
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: 0,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    };

    taskStats.forEach(stat => {
      stats[stat._id] = stat.count;
      stats.total += stat.count;
    });

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        taskStats: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner or admin member)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or admin member
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    const isAdmin = member && member.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update project
    const fieldsToUpdate = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      tags: req.body.tags,
      color: req.body.color,
      settings: req.body.settings
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    project = await Project.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('owner members.user', 'name email avatar');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete the project'
      });
    }

    // Delete all related tasks
    await Task.deleteMany({ project: req.params.id });

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project and related tasks deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (owner or admin)
exports.addMember = async (req, res, next) => {
  try {
    const { userId, role = 'team_member' } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    const isAdmin = member && member.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members'
      });
    }

    // Check if user already a member
    const existingMember = project.members.find(m => m.user.toString() === userId);
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    // Add member
    project.members.push({
      user: userId,
      role,
      joinedAt: new Date()
    });

    await project.save();

    // Populate the project
    await project.populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private (owner or admin)
exports.removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    const isAdmin = member && member.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members'
      });
    }

    // Cannot remove owner
    if (req.params.memberId === project.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    // Remove member
    project.members = project.members.filter(
      m => m.user.toString() !== req.params.memberId
    );

    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive project
// @route   PUT /api/projects/:id/archive
// @access  Private (owner only)
exports.archiveProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can archive
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can archive the project'
      });
    }

    project.isArchived = !project.isArchived;
    project.status = project.isArchived ? 'archived' : 'active';
    await project.save();

    res.json({
      success: true,
      data: project,
      message: `Project ${project.isArchived ? 'archived' : 'unarchived'} successfully`
    });
  } catch (error) {
    next(error);
  }
};