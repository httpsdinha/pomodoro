let workDuration = 25 * 60
let shortBreakDuration = 5 * 60
let longBreakDuration = 15 * 60
let isShortBreak = true
let timer = workDuration
let isRunning = false
let isWorkTime = true
let intervalId = null
let pomodoroCount = 0

const timerDisplay = document.getElementById('timer-display')
const startBtn = document.getElementById('start-btn')
const pauseBtn = document.getElementById('pause-btn')
const resetBtn = document.getElementById('reset-btn')
const pomodoroDurationInput = document.getElementById('pomodoro-duration')
const shortBreakDurationInput = document.getElementById('short-break-duration')
const longBreakDurationInput = document.getElementById('long-break-duration')
const pomodoroCounterDisplay = document.getElementById('pomodoro-counter')

function updateDisplay () {
  let activeInputInvalid = false
  if (!isRunning) {
    const currentInput = isWorkTime ? pomodoroDurationInput : (isShortBreak ? shortBreakDurationInput : longBreakDurationInput)
    const val = parseInt(currentInput.value)
    if (currentInput.value.trim() === '' || isNaN(val) || val < 1) {
      activeInputInvalid = true
    }
  }

  if (activeInputInvalid) {
    timerDisplay.textContent = 'Valor > 0 min'
    document.title = 'Pomodoro - Ajuste'
  } else {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0')
    const seconds = String(timer % 60).padStart(2, '0')
    const timeText = `${minutes}:${seconds}`
    timerDisplay.textContent = timeText
    document.title = `${timeText} - ${isWorkTime ? 'Trabalho' : 'Descanso'}`
  }
}

function updateButtons () {
  startBtn.disabled = isRunning
  pauseBtn.disabled = !isRunning
}

function stopTimer () {
  if (isRunning) {
    clearInterval(intervalId)
    isRunning = false
  }
}

function getNextPhase () {
  if (isWorkTime) {
    pomodoroCount++
    updateCounterDisplay()

    if (pomodoroCount % 4 === 0) {
      return {
        isWork: false,
        isShort: false,
        duration: longBreakDuration,
        message: 'Parabéns! Você completou 4 pomodoros! Hora da pausa longa!'
      }
    } else {
      return {
        isWork: false,
        isShort: true,
        duration: shortBreakDuration,
        message: `Pomodoro ${pomodoroCount} concluído! Hora da pausa curta!`
      }
    }
  } else {
    return {
      isWork: true,
      isShort: false,
      duration: workDuration,
      message: 'Pausa terminada! Hora de trabalhar!'
    }
  }
}

function updateDurationsFromInputs () {
  const parsedWork = parseInt(pomodoroDurationInput.value)
  if (!isNaN(parsedWork) && parsedWork >= 1) {
    workDuration = parsedWork * 60
  }

  const parsedShort = parseInt(shortBreakDurationInput.value)
  if (!isNaN(parsedShort) && parsedShort >= 1) {
    shortBreakDuration = parsedShort * 60
  }

  const parsedLong = parseInt(longBreakDurationInput.value)
  if (!isNaN(parsedLong) && parsedLong >= 1) {
    longBreakDuration = parsedLong * 60
  }

  if (!isRunning) {
    if (isWorkTime) {
      timer = workDuration
    } else if (isShortBreak) {
      timer = shortBreakDuration
    } else {
      timer = longBreakDuration
    }
    updateDisplay()
  }
}

function tick () {
  if (timer > 0) {
    timer--
    updateDisplay()
  } else {
    stopTimer()

    const nextPhase = getNextPhase()

    isWorkTime = nextPhase.isWork
    if (!isWorkTime) {
      isShortBreak = nextPhase.isShort
    }

    timer = nextPhase.duration

    alert(nextPhase.message)

    updateDisplay()
    updateButtons()

    startTimer()
  }
}

function startTimer () {
  if (isRunning) return

  let currentInputInvalid = false
  let durationToUse
  let activeInputControl

  if (isWorkTime) {
    activeInputControl = pomodoroDurationInput
    const val = parseInt(activeInputControl.value)
    if (activeInputControl.value.trim() === '' || isNaN(val) || val < 1) {
      currentInputInvalid = true
    } else {
      if (workDuration !== val * 60) workDuration = val * 60
      durationToUse = workDuration
    }
  } else if (isShortBreak) {
    activeInputControl = shortBreakDurationInput
    const val = parseInt(activeInputControl.value)
    if (activeInputControl.value.trim() === '' || isNaN(val) || val < 1) {
      currentInputInvalid = true
    } else {
      if (shortBreakDuration !== val * 60) shortBreakDuration = val * 60
      durationToUse = shortBreakDuration
    }
  } else {
    activeInputControl = longBreakDurationInput
    const val = parseInt(activeInputControl.value)
    if (activeInputControl.value.trim() === '' || isNaN(val) || val < 1) {
      currentInputInvalid = true
    } else {
      if (longBreakDuration !== val * 60) longBreakDuration = val * 60
      durationToUse = longBreakDuration
    }
  }

  if (currentInputInvalid) {
    alert('A duração configurada é inválida. Por favor, insira um valor maior que 0 minutos.')
    updateDisplay()
    return
  }

  isRunning = true
  timer = durationToUse
  updateDisplay()
  intervalId = setInterval(tick, 1000)
  updateButtons()
}

function pauseTimer () {
  stopTimer()
  updateButtons()
}

function resetTimer () {
  stopTimer()

  isWorkTime = true
  pomodoroDurationInput.value = workDuration / 60
  shortBreakDurationInput.value = shortBreakDuration / 60
  longBreakDurationInput.value = longBreakDuration / 60

  timer = workDuration
  pomodoroCount = 0
  isShortBreak = true
  updateCounterDisplay()

  updateDisplay()
  updateButtons()
}

function allowOnlyNumbers (event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '')
}

function updateCounterDisplay () {
  pomodoroCounterDisplay.textContent = `Ciclos: ${pomodoroCount}`
}

startBtn.addEventListener('click', startTimer)
pauseBtn.addEventListener('click', pauseTimer)
resetBtn?.addEventListener('click', resetTimer)
pomodoroDurationInput.addEventListener('input', updateDurationsFromInputs)
shortBreakDurationInput.addEventListener('input', updateDurationsFromInputs)
longBreakDurationInput.addEventListener('input', updateDurationsFromInputs)

pomodoroDurationInput.addEventListener('input', allowOnlyNumbers)
shortBreakDurationInput.addEventListener('input', allowOnlyNumbers)
longBreakDurationInput.addEventListener('input', allowOnlyNumbers)

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay()
  updateButtons()
  updateCounterDisplay()
})
