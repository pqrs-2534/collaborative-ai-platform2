const express = require('express');
const {
  generateIdeas,
  getIdeas,
  updateIdea,
  voteIdea,
  refineIdea
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { validators, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/generate-ideas', protect, generateIdeas);
router.get('/ideas', protect, getIdeas);
router.put('/ideas/:id', protect, validators.mongoId, validate, updateIdea);
router.post('/ideas/:id/vote', protect, validators.mongoId, validate, voteIdea);
router.post('/ideas/:id/refine', protect, validators.mongoId, validate, refineIdea);

module.exports = router;