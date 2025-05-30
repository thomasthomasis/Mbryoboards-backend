const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const boardRoutes = require('./routes/boardRoutes');
const ideaRoutes = require('./routes/ideaRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app)

const PORT = process.env.PORT || 5000;


const io = new Server(server, {
  cors: {
    origin: 'https://mbryoboards.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.locals.io = io;

// Example idea change broadcast
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/boards', boardRoutes);
app.use('/api/ideas', ideaRoutes)

  // Connect to MongoDB and then start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    // Start the HTTP server (which also handles Socket.IO)
    // IMPORTANT: Specify '0.0.0.0' as the host
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    // Exit the process if MongoDB connection fails, as the app won't function
    process.exit(1); // Exit with a non-zero code to indicate an error
  });