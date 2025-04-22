const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require("dotenv").config();

const connectdb = require('./DBConnect');
const routes = require('./routes/route');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 8000;
let rooms = {};

// CORS
app.use(cors({
  origin: "https://xstreamfrontend.onrender.com",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// DB connect
connectdb();

// Routes
app.use('/', routes);

// WebSocket logic
wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomCode, videoState } = data;

      if (type === 'join') {
        if (!rooms[roomCode]) rooms[roomCode] = { users: [], videoState: {} };
        rooms[roomCode].users.push(ws);
        ws.send(JSON.stringify({ type: 'sync', videoState: rooms[roomCode].videoState }));
      }

      if (type === 'video-update') {
        if (rooms[roomCode]) {
          rooms[roomCode].videoState = videoState;
          rooms[roomCode].users.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'sync', videoState }));
            }
          });
        }
      }

      if (type === 'delete-room' && rooms[roomCode]) {
        rooms[roomCode].users.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'room-deleted' }));
            client.close();
          }
        });
        delete rooms[roomCode];
        console.log(`Room ${roomCode} deleted`);
      }
    } catch (error) {
      console.error('WebSocket Error:', error);
    }
  });

  ws.on('close', () => {
    Object.keys(rooms).forEach(roomCode => {
      rooms[roomCode].users = rooms[roomCode].users.filter(user => user !== ws);
      if (rooms[roomCode].users.length === 0) delete rooms[roomCode];
    });
  });
});

// Start Express + WebSocket server
server.listen(port, () => {
  console.log(`Server (HTTP + WebSocket) is running on port ${port}`);
});
