const express = require('express');
const router = express.Router();
const {
  upVoteIdea,
  downVoteIdea,
  getAllIdeas,
  deleteIdea,
  editIdeaContent
} = require('../controllers/ideaController');

router.get('/', getAllIdeas)
router.delete('/:ideaId', deleteIdea)
router.post('/:ideaId/upvote', upVoteIdea);
router.post('/:ideaId/downvote', downVoteIdea);
router.put('/:ideaId', editIdeaContent)

module.exports = router;
