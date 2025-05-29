const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoard,
  getBoards,
  deleteBoard,
  editBoardTitle,

  addIdea,
  getIdeasByBoard
} = require('../controllers/boardController');

router.post('/', createBoard);
router.get('/', getBoards)
router.get('/:boardId', getBoard);
router.delete('/:boardId', deleteBoard);
router.put('/:boardId', editBoardTitle)

router.post('/:boardId/ideas', addIdea);
router.get('/:boardId/ideas', getIdeasByBoard);

module.exports = router;
