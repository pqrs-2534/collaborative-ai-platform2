const Idea = require('../models/Idea');
const aiService = require('../services/aiService');
const { getPagination, paginationResponse } = require('../utils/helpers');

// @desc    Generate ideas using AI
// @route   POST /api/ai/generate-ideas
// @access  Private
exports.generateIdeas = async (req, res, next) => {
  try {
    const { prompt, projectId, category = 'other' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    // Generate idea using AI
    const aiResult = await aiService.generateText(prompt);

    // Save the idea
    const idea = await Idea.create({
      text: aiResult.generated_text,
      prompt,
      projectId,
      category,
      createdBy: req.user._id,
      isAIGenerated: true,
      aiModel: aiResult.model
    });

    await idea.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ideas for a project
// @route   GET /api/ai/ideas?projectId=:id
// @access  Private
exports.getIdeas = async (req, res, next) => {
  try {
    const { projectId, category, status, page = 1, limit = 20 } = req.query;
    const { skip, limit: pageLimit } = getPagination(page, limit);

    const query = {};
    if (projectId) query.projectId = projectId;
    if (category) query.category = category;
    if (status) query.status = status;

    const ideas = await Idea.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('votes.user', 'name')
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Idea.countDocuments(query);

    res.json({
      success: true,
      ...paginationResponse(ideas, page, limit, total)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update idea
// @route   PUT /api/ai/ideas/:id
// @access  Private
exports.updateIdea = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      text: req.body.text,
      category: req.body.category,
      status: req.body.status,
      priority: req.body.priority,
      tags: req.body.tags
    };

    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const idea = await Idea.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email avatar');

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    res.json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on idea
// @route   POST /api/ai/ideas/:id/vote
// @access  Private
exports.voteIdea = async (req, res, next) => {
  try {
    const { vote } = req.body; // 1 or -1

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({
        success: false,
        message: 'Vote must be 1 or -1'
      });
    }

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Remove existing vote if any
    idea.votes = idea.votes.filter(v => v.user.toString() !== req.user._id.toString());

    // Add new vote
    idea.votes.push({
      user: req.user._id,
      vote
    });

    await idea.save();
    await idea.populate('createdBy votes.user', 'name email avatar');

    res.json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refine an idea using AI
// @route   POST /api/ai/ideas/:id/refine
// @access  Private
exports.refineIdea = async (req, res, next) => {
  try {
    const { refinementPrompt } = req.body;
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Use AI to refine the idea
    const result = await aiService.refineIdea(idea.text, refinementPrompt);

    // Add refinement to history
    idea.refinements.push({
      text: result.generated_text,
      refinedBy: req.user._id,
      refinedAt: new Date()
    });

    await idea.save();
    await idea.populate('createdBy refinements.refinedBy', 'name email avatar');

    res.json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};