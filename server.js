const express = require('express')
const app = express()
require("dotenv").config();
const connectdb = require('./DBConnect')
const cors = require('cors')
// const bodyParser = require('body-parser')
const routes = require('./routes/route')
// const cloudinary = require('cloudinary');
const port =  process.env.PORT || 8000;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8081 });
let rooms = {};


app.use(cors(
  {
    origin: "http://localhost:3000", // restrict calls to those this address
    credentials: true,
  }
)) // middleware present b/w client and server to change requests
app.use(express.json())


// database connection
connectdb()

// encoding url
app.use(express.urlencoded({extended:false}))


// router-Load (call routers)
app.use('/',routes)


// public folder static files setup
app.use(express.static('public'))


app.listen(port,()=>{
  console.log(`server started at port:${port} ...`);
})



//websocket code
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
      try {
          const data = JSON.parse(message);
          const { type, roomCode, videoState } = data;

          if (type === 'join') {
              if (!rooms[roomCode]) {
                  rooms[roomCode] = { users: [], videoState: {} };
              }
              rooms[roomCode].users.push(ws);
              console.log(`User joined room: ${roomCode}`);

              // Send the current video state to the new user
              ws.send(JSON.stringify({ type: 'sync', videoState: rooms[roomCode].videoState }));
          }

          if (type === 'video-update') {
              if (rooms[roomCode]) {
                  rooms[roomCode].videoState = videoState; // Update the state
                  rooms[roomCode].users.forEach(client => {
                      if (client !== ws && client.readyState === WebSocket.OPEN) {
                          client.send(JSON.stringify({ type: 'sync', videoState }));
                      }
                  });
              }
          }
          if(type == "delete-room"){
            if (rooms[roomCode]) {
              // Close all WebSocket connections in this room
              rooms[roomCode].users.forEach(client => {
                  if (client.readyState === WebSocket.OPEN) {
                      client.send(JSON.stringify({ type: 'room-deleted' })); // Notify users
                      client.close(); // Close the WebSocket connection
                  }
              });
  
              // Delete room from the rooms object
              delete rooms[roomCode];
              console.log(`Room ${roomCode} deleted`);
            }
          }
      } catch (error) {
          console.error('Error processing message:', error);
      }
  });

  ws.on('close', () => {
      Object.keys(rooms).forEach(roomCode => {
          rooms[roomCode].users = rooms[roomCode].users.filter(user => user !== ws);
          if (rooms[roomCode].users.length === 0) {
              delete rooms[roomCode]; // Clean up empty rooms
          }
      });
      console.log('User disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8081');