const { nanoid } = require('nanoid');
const Board = require('../models/Board');
const Idea = require('../models/Idea');


exports.createBoard = async (req, res) => {
  const boardId = nanoid(10);
  const board = new Board({
    id: boardId,
    title: req.body.title,
  });
  await board.save();
  res.json({ boardId });
};

exports.getBoard = async (req, res) => {
  const board = await Board.findOne({ id: req.params.boardId });
  if (!board) return res.status(404).send('Board not found');
  res.json(board);
};

exports.getBoards = async (req, res) => {
    const boards = await Board.find();
    if (!boards) return res.status(404).send('No boards found');
    res.json(boards);
}

exports.deleteBoard = async (req, res) => {
    const boardId = req.params.boardId;
    console.log("Board Id: ", boardId);
  
    try {
        const board = await Board.findOne({ id: boardId });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        console.log("Board found: ", board)
        await Board.findByIdAndDelete(board._id);
  
        // Optional: delete associated ideas
        await Idea.deleteMany({ boardId: boardId });
  
      res.status(200).json({ message: 'Board and associated ideas deleted' });
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ message: 'Server error deleting board' });
    }
  };

exports.editBoardTitle = async (req, res) => {
    const boardId = req.params.boardId;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'title is required' });
    }

    try {
        const updatedBoard = await Board.findOneAndUpdate(
        { id: boardId },
        { title: title },
        );

        if (!updatedBoard) {
        return res.status(404).json({ message: 'Board not found' });
        }

        res.status(200).json(updatedBoard);
    } catch (error) {
        console.error('Error updating board title:', error);
        res.status(500).json({ message: 'Server error updating title' });
    }
};


exports.addIdea = async (req, res) => {
    const board = await Board.findOne({ id: req.params.boardId });
    if (!board) return res.status(404).send('Board not found');

    const ideaId = nanoid(10);
    const idea = new Idea({
        id: ideaId,
        boardId: req.params.boardId,
        content: req.body.content,
        type: req.body.type
    });
    await idea.save();

    const io = req.app.locals.io;
    io.emit('idea-created', idea);

    res.json(idea);
};

exports.getIdeasByBoard = async (req, res) => {
    const { boardId } = req.params;

    try {
        const ideas = await Idea.find({ boardId });

        res.status(200).json(ideas); // Can be empty array
    } catch (error) {
        console.error('Error fetching ideas for board:', error);
        res.status(500).json({ message: 'Server error fetching board ideas' });
    }
};