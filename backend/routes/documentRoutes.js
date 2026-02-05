const express = require('express');
const {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  getVersionHistory,
  restoreVersion
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', protect, createDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, validators.mongoId, validate, getDocument);
router.put('/:id', protect, validators.mongoId, validate, updateDocument);
router.get('/:id/versions', protect, validators.mongoId, validate, getVersionHistory);
router.post('/:id/versions/:versionId/restore', protect, validators.mongoId, validate, restoreVersion);

module.exports = router;