const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Représentation de chaque salon avec ses compteurs
const salons = [];
for (let i = 0; i < 10; i++) {
    salons.push({ id: i, compteurs: [0, 0, 0, 0, 0] });
}

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    // Lorsqu'un utilisateur rejoint un salon
    socket.on('joinSalon', (salonId) => {
        socket.join(salonId);
        socket.emit('initialState', salons[salonId].compteurs);
    });

    // Lorsque l'utilisateur met à jour un compteur dans un salon spécifique
    socket.on('updateCompteur', (salonId, index, value) => {
        salons[salonId].compteurs[index] += value;
        // Seuls les utilisateurs de ce salon spécifique reçoivent la mise à jour
        io.to(salonId).emit('compteurUpdated', index, salons[salonId].compteurs[index]);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });

    socket.on('resetCompteurs', (salonId) => {
        console.log('Received reset request for salon:', salonId);

        if (salons[salonId]) {
            for (let i = 0; i < salons[salonId].compteurs.length; i++) {
                salons[salonId].compteurs[i] = 0;
            }
            // Informer tous les utilisateurs du salon que les compteurs ont été réinitialisés
            io.to(salonId).emit('compteursReset', salons[salonId].compteurs);
            console.log('Counters after reset:', salons[salonId].compteurs);
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
