const socket = io.connect();
let currentSalonId = null;
// Dans client.js
const compteurNoms = ['Tractions', 'Burpees', 'Corde a Sauter', 'Course à pied', 'squat'];

function JoinSalon(salonId) {
    currentSalonId = salonId;
    socket.emit('joinSalon', salonId);

    document.getElementById('salonSelection').style.display = 'none';
    document.getElementById('compteurs').style.display = 'block';
    document.getElementById('salonName').innerText = `Salon ${salonId + 1}`;
}

function updateCompteur(index, value) {
    socket.emit('updateCompteur', currentSalonId, index, value);
}

function resetCompteurs() {
    console.log('Resetting compteurs for salon:', currentSalonId);
    socket.emit('resetCompteurs', currentSalonId);
}

function returnToSalonSelection() {
    document.getElementById('compteurs').style.display = 'none';
    document.getElementById('salonSelection').style.display = 'block';
    currentSalonId = null;
}

socket.on('compteursReset', (newCompteurs) => {
    newCompteurs.forEach((value, index) => {
        const compteurValueElement = document.getElementById(`compteur${index}Value`);
        if (compteurValueElement) {
            compteurValueElement.innerText = `: ${value}`;
        }
    });
});


socket.on('compteurUpdated', (index, value) => {
    const compteurValueElement = document.getElementById(`compteur${index}Value`);
    if (compteurValueElement) {
        compteurValueElement.innerText = `: ${value}`;
    }
});

socket.on('initialState', (compteurs) => {
    const compteurValuesDiv = document.getElementById('compteurValues');
    compteurValuesDiv.innerHTML = ''; // Nettoyez l'ancien état

    compteurs.forEach((value, index) => {
        const compteurWrapper = document.createElement('div');

        const compteurNameElement = document.createElement('span');
        compteurNameElement.innerText = compteurNoms[index];

        const minusButton = document.createElement('button');
        minusButton.innerText = '-';
        minusButton.addEventListener('click', () => updateCompteur(index, -1));

        const plusButton = document.createElement('button');
        plusButton.innerText = '+';
        plusButton.addEventListener('click', () => updateCompteur(index, 1));

        const compteurValueElement = document.createElement('span');
        compteurValueElement.id = `compteur${index}Value`;
        compteurValueElement.innerText = `: ${value}`;

        compteurWrapper.appendChild(compteurNameElement);
        compteurWrapper.appendChild(minusButton);
        compteurWrapper.appendChild(plusButton);
        compteurWrapper.appendChild(compteurValueElement);

        compteurValuesDiv.appendChild(compteurWrapper);
    });
});
