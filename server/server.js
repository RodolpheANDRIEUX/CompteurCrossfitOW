const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const compteurs = [0, 0, 0, 0, 0, 0];

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.emit('initialState', compteurs);

    socket.on('updateCompteur', (index, value) => {
        compteurs[index] += value;
        io.emit('compteurUpdated', index, compteurs[index]);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

