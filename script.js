let workDuration = 25 * 60; // 25 minutos
let breakDuration = 5 * 60; // 5 minutos
let timer = workDuration;
let isRunning = false;
let isWorkTime = true;
let intervalId = null;

// Elementos DOM
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    const timeText = `${minutes}:${seconds}`;
    
    timerDisplay.textContent = timeText;
    document.title = `${timeText} - ${isWorkTime ? 'Trabalho' : 'Descanso'}`;
}

function updateButtons() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    // resetBtn sempre habilitado - removida verificação desnecessária
}

function stopTimer() {
    if (isRunning) {  // Combinando lógica repetida
        clearInterval(intervalId);
        isRunning = false;
    }
}

function tick() {
    if (timer > 0) {
        timer--;
        updateDisplay();
    } else {
        stopTimer(); // Usando função reutilizada
        
        isWorkTime = !isWorkTime;
        timer = isWorkTime ? workDuration : breakDuration;
        
        alert(isWorkTime ? 'Descanso terminado! Hora de trabalhar!' : 'Tempo de trabalho terminado! Hora do descanso!');
        updateDisplay();
        startTimer(); // Iniciar automaticamente próxima fase
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(tick, 1000);
        updateButtons();
    }
}

function pauseTimer() {
    stopTimer(); // Reutilizando lógica
    updateButtons();
}

function resetTimer() {
    stopTimer(); // Reutilizando lógica
    
    // CORREÇÃO: Reset sempre volta para trabalho
    isWorkTime = true;
    timer = workDuration;
    
    updateDisplay();
    updateButtons();
}

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn?.addEventListener('click', resetTimer); // Usando optional chaining

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateButtons();
});