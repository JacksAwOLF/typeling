const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const players = [];

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (client) => {
    players.push(client);
    console.log('a user connected', players.length);
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});