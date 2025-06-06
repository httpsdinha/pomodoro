let workDuration = 25 * 60; // 25 minutos
let shortBreakDuration = 5 * 60; // 5 minutos
let longBreakDuration = 15 * 60; // 15 minutos
let isShortBreak = true;
let isLongBreak = false;
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
    workDuration = parseInt(pomodoroDurationInput.value) * 60;
    shortBreakDuration = parseInt(shortBreakDurationInput.value) * 60;
    longBreakDuration = parseInt(longBreakDurationInput.value) * 60;
    
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
        stopTimer();
        
        const nextPhase = getNextPhase();
        isWorkTime = nextPhase.isWork;
        isShortBreak = nextPhase.isShort;
        
        // Atualiza as durações antes de definir o próximo timer
        updateDurationsFromInputs();
        timer = nextPhase.duration;
        
        alert(nextPhase.message);
        updateDisplay();
        startTimer(); // aqui pode estar um possivel hotfix. reinicio automatico do timer.
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