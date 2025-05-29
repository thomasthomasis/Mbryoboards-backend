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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    })
  })
  .catch(err => console.error(err));

