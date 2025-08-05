const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  boardId: { type: String, required: true },
  content: String,
  type: { type: String, default: 'positive' },
  votes: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
