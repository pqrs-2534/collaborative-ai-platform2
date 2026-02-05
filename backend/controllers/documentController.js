const Document = require('../models/Document');
const { getPagination, paginationResponse } = require('../utils/helpers');

// @desc    Create document
// @route   POST /api/documents
// @access  Private
exports.createDocument = async (req, res, next) => {
  try {
    const documentData = {
      ...req.body,
      createdBy: req.user._id,
      lastEditedBy: req.user._id
    };

    const document = await Document.create(documentData);
    await document.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get documents for a project
// @route   GET /api/documents?projectId=:id
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const { projectId, page = 1, limit = 20 } = req.query;
    const { skip, limit: pageLimit } = getPagination(page, limit);

    const query = projectId ? { projectId } : {};

    const documents = await Document.find(query)
      .populate('createdBy lastEditedBy', 'name email avatar')
      .select('-versions') // Don't include all versions in list
      .skip(skip)
      .limit(pageLimit)
      .sort({ updatedAt: -1 });

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      ...paginationResponse(documents, page, limit, total)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('createdBy lastEditedBy', 'name email avatar')
      .populate('versions.editedBy', 'name email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.isLocked && document.lockedBy.toString() !== req.user._id.toString()) {
      return res.status(423).json({
        success: false,
        message: 'Document is locked by another user'
      });
    }

    // Update fields
    if (req.body.title) document.title = req.body.title;
    if (req.body.currentContent !== undefined) {
      document.currentContent = req.body.currentContent;
      document.lastEditedBy = req.user._id;
    }
    if (req.body.tags) document.tags = req.body.tags;

    await document.save();
    await document.populate('createdBy lastEditedBy', 'name email avatar');

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get document version history
// @route   GET /api/documents/:id/versions
// @access  Private
exports.getVersionHistory = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .select('title versions')
      .populate('versions.editedBy', 'name email avatar');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        versions: document.versions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore document version
// @route   POST /api/documents/:id/versions/:versionId/restore
// @access  Private
exports.restoreVersion = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const version = document.versions.id(req.params.versionId);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    // Restore content
    document.currentContent = version.content;
    document.lastEditedBy = req.user._id;
    await document.save();

    res.json({
      success: true,
      data: document,
      message: 'Version restored successfully'
    });
  } catch (error) {
    next(error);
  }
};