
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes

// server/index.js


const server = http.createServer(app);

// server/index.js

// ...
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
    },
});




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

    app.use(express.json()); 
// A simple route to check if the server is running

app.use('/api/auth', require('./routes/auth'));
app.use('/api/execute', require('./routes/execute')); 

app.get('/', (req, res) => {
    res.send('CodeCollab server is running!');
});

const PORT = process.env.PORT || 5000;


// server/index.js

// NEW: We will store users in this object.
const userSocketMap = {}; // Maps socketId to username
function getAllConnectedClients(roomId) {
    // This will return an array of {socketId, username} objects for a room
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // UPDATED: 'join_room' now takes a username
    socket.on('join_room', ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        // Notify everyone in the room that a new user has joined
        const clients = getAllConnectedClients(roomId);
        io.in(roomId).emit('update_user_list', clients);
        console.log(`${username} joined room ${roomId}`);
    });
    
    // Listen for chat messages (no changes here)
    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('receive_message', data);
    });

    // Listen for code changes (no changes here)
    socket.on('code_change', (data) => {
        const { roomId, newCode } = data;
        socket.to(roomId).emit('code_change', newCode);
    });

    // UPDATED: 'disconnect' now cleans up and notifies the room
    socket.on('disconnect', () => {
        const username = userSocketMap[socket.id];
        // Find all rooms this socket was a part of
        const rooms = Array.from(socket.rooms);
        rooms.forEach((roomId) => {
            // Emit the updated user list to each room
            const clients = getAllConnectedClients(roomId);
            io.in(roomId).emit('update_user_list', clients);
        });
        delete userSocketMap[socket.id];
        console.log(`User Disconnected: ${username} (${socket.id})`);
    });
});
// ... the server.listen() part is below this

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});