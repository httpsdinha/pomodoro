let workDuration = 25 * 60; // 25 minutosAdd commentMore actions
let shortBreakDuration = 5 * 60; // 5 minutos
let longBreakDuration = 15 * 60; // 15 minutos
let isShortBreak = true;
let timer = workDuration;
let isRunning = false;
let isWorkTime = true;
let intervalId = null;
let pomodoroCount = 0; 

// Elementos DOM
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');

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

function getNextPhase() {
    if (isWorkTime) {
        // Acabou um pomodoro de trabalho
        pomodoroCount++;
        
        // A cada 4 pomodoros, pausa longa
        if (pomodoroCount % 4 === 0) {
            return {
                isWork: false,
                isShort: false,
                duration: longBreakDuration,
                message: 'Parabéns! Você completou 4 pomodoros! Hora da pausa longa!'
            };
        } else {
            return {
                isWork: false,
                isShort: true,
                duration: shortBreakDuration,
                message: `Pomodoro ${pomodoroCount} concluído! Hora da pausa curta!`
            };
        }
    } else {
        // Acabou uma pausa (curta ou longa)
        return {
            isWork: true,
            isShort: false,
            duration: workDuration,
            message: 'Pausa terminada! Hora de trabalhar!'
        };
    }
}

function updateDurationsFromInputs() {
    let newWorkDuration = parseInt(pomodoroDurationInput.value);
    let newShortBreakDuration = parseInt(shortBreakDurationInput.value);
    let newLongBreakDuration = parseInt(longBreakDurationInput.value);

    // Garante que as durações sejam pelo menos 1
    if (newWorkDuration < 1) {
        newWorkDuration = 1;
        pomodoroDurationInput.value = 1;
    }
    if (newShortBreakDuration < 1) {
        newShortBreakDuration = 1;
        shortBreakDurationInput.value = 1;
    }
    if (newLongBreakDuration < 1) {
        newLongBreakDuration = 1;
        longBreakDurationInput.value = 1;
    }

    workDuration = newWorkDuration * 60;
    shortBreakDuration = newShortBreakDuration * 60;
    longBreakDuration = newLongBreakDuration * 60;
    
    // Se o timer não estiver rodando E estiver no tempo máximo (não pausado no meio)
    if (!isRunning) {
        if (isWorkTime) {
            timer = workDuration;
        } else if (isShortBreak) {
            timer = shortBreakDuration;
        } else {
            timer = longBreakDuration;
        }
        updateDisplay();
    }
}

function tick() {
    if (timer > 0) {
        timer--;
        updateDisplay();
    } else {
        stopTimer(); // Stop the current timer interval

        const nextPhase = getNextPhase();

        // Set the state for the upcoming phase
        isWorkTime = nextPhase.isWork;
        if (!isWorkTime) { // If the next phase is a break
            isShortBreak = nextPhase.isShort; // True for short break, false for long break
        }
        
        timer = nextPhase.duration; // Set the timer for the new phase from getNextPhase()

        alert(nextPhase.message); // Announce the new phase

        updateDisplay(); // Update the timer display and title
        updateButtons(); // Ensure buttons reflect the new state (e.g., start should be enabled)
        
        startTimer();    // Automatically start the timer for the next phase
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
    pomodoroCount = 0; // Reset pomodoro cycle count
    isShortBreak = true; // Reset to default break type expectation

    updateDisplay();
    updateButtons();
}

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn?.addEventListener('click', resetTimer); // Usando optional chaining
pomodoroDurationInput.addEventListener('input', updateDurationsFromInputs);
shortBreakDurationInput.addEventListener('input', updateDurationsFromInputs);
longBreakDurationInput.addEventListener('input', updateDurationsFromInputs);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateButtons();
});