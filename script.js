let score = 0;
let timeLeft = 60;
let timer;
let username = "";
const form = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const gameArea = document.getElementById('game-area');
const userSetup = document.getElementById('user-setup');
const playerNameDisplay = document.getElementById('player-name');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const actionButton = document.getElementById('action-button');
const restartButton = document.getElementById('restart-button');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    username = usernameInput.value.trim();
    if (username === "") return;

    playerNameDisplay.textContent = username;
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    userSetup.classList.add('hidden');
    gameArea.classList.remove('hidden');

    startTimer();
});
actionButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
});
restartButton.addEventListener('click', () => {
    gameArea.classList.add('hidden');
    userSetup.classList.remove('hidden');
    restartButton.classList.add('hidden');
    usernameInput.value = "";
});
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}
function endGame() {
    actionButton.disabled = true;
    restartButton.classList.remove('hidden');
    fetch('/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username,
            score: score
        })
    }).catch(err => {
        console.error('Error al enviar los datos:', err);
    });
}
