const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoard,
  getBoards,
  deleteBoard,
  editBoardTitle,

  addIdea,
  getIdeasByBoard,
  generateActionItem,
  getActionItems
} = require('../controllers/boardController');

router.post('/', createBoard);
router.get('/', getBoards)
router.get('/:boardId', getBoard);
router.delete('/:boardId', deleteBoard);
router.put('/:boardId', editBoardTitle)

router.post('/:boardId/ideas', addIdea);
router.get('/:boardId/ideas', getIdeasByBoard);
router.post('/:boardId/generateActionItem', generateActionItem)
router.get('/actionItems', getActionItems);

module.exports = router;
