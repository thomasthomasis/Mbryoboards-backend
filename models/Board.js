const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', boardSchema);
