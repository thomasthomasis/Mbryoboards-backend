const Board = require('../models/Board');
const Idea = require('../models/Idea');

const dotenv = require('dotenv');
dotenv.config();


exports.createBoard = async (req, res) => {

  const { nanoid } = await import('nanoid');
  
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

    const { nanoid } = await import('nanoid');
    
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

exports.generateActionItem = async (req, res) => {
  const { boardId } = req.params;

    try {
        const ideas = await Idea.find({ boardId });

        res.status(200).json(ideas); // Can be empty array
    } catch (error) {
        console.error('Error fetching ideas for board:', error);
        res.status(500).json({ message: 'Server error fetching board ideas' });
    }
}

exports.generateActionItem = async (req, res) => {

    const ideaToProcess = req.params;

    // 1. Construct the prompt for the Ollama model
    const prompt = `
      You are an expert project manager assistant. Your task is to convert a piece of feedback into a structured action item.

      Your response MUST be a valid JSON object and nothing else. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.

      The JSON object must have the following two keys:
      1. "description": A concise, one-sentence explanation of what needs to be done.

      ---
      Here is an example:

      User Feedback: "The final designs were delivered late, which delayed the development team."

      Your JSON Response:
      {
        "description": "Create a clear schedule for design handoffs to ensure the development team receives assets on time."
      }
      ---

      Now, process the following user feedback:

      User Feedback: "${ideaToProcess}"

      Your JSON Response:
      `;

    try {
        // 2. Make a POST request to the local Ollama server
        const response = await fetch(process.env.AI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "mistral", // The model you downloaded
                prompt: prompt,
                stream: false // IMPORTANT: Keep this false for a simple, single response
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Ollama API request failed with status ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json(data); 

    } catch (e) {
        console.error('Error generating action item:', error);
        res.status(500).json({ message: 'Server error generating action item' });
    }
};