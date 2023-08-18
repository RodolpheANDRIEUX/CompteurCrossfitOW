const socket = io.connect();

// Lorsque l'état initial des compteurs est reçu du serveur
socket.on('initialState', function(compteurs) {
    const container = document.getElementById('compteurs');

    compteurs.forEach((value, index) => {
        const compteurDiv = document.createElement('div');
        compteurDiv.className = 'compteur';

        const minusButton = document.createElement('button');
        minusButton.innerText = '-1';
        minusButton.onclick = () => updateCompteur(index, -1);

        const plusButton = document.createElement('button');
        plusButton.innerText = '+1';
        plusButton.onclick = () => updateCompteur(index, +1);

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value';
        valueDisplay.innerText = value;

        compteurDiv.appendChild(minusButton);
        compteurDiv.appendChild(valueDisplay);
        compteurDiv.appendChild(plusButton);

        container.appendChild(compteurDiv);
    });
});

socket.on('compteurUpdated', function(index, newValue) {
    const container = document.getElementById('compteurs');
    const valueDisplay = container.children[index].querySelector('.value');
    valueDisplay.innerText = newValue;
});

function updateCompteur(index, value) {
    socket.emit('updateCompteur', index, value);
}
