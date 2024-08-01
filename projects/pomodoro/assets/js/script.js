const pomodoroTitle = document.querySelector('#title');
const pomodoroImage = document.querySelector('#pomodoro-img');
const pomodoroTimer = document.querySelector('#timer');
const pomodoroCycles = document.querySelectorAll('.round');

const pomodoroTimerState = {
  focusTime: calculateTimeAsMilliseconds(25, 'minutes'),
  shortInterval: calculateTimeAsMilliseconds(5, 'minutes'),
  longInterval: calculateTimeAsMilliseconds(15, 'minutes'),
  timerCycle: 1,
  stopAfterCycle: pomodoroCycles.length * 2,
  focusCycles: 0,
  timer: null,
  timerStarted: false,
};

pomodoroTimer.innerHTML = formatPomodoroTimerAsText(
  pomodoroTimerState.focusTime
);

pomodoroImage.addEventListener('click', (ev) => startPomodoroTimer(ev));

function startPomodoroTimer() {
  if (pomodoroTimerState.timerStarted) return;

  if (isPomodoroTimerCycleMoreThan(pomodoroTimerState.stopAfterCycle)) {
    setPomodoroTimerTitle('Restart?');

    resetPomodoroCyclesComponent();

    resetPomodoroTimerState();

    return;
  }

  const worker = {
    instance: new Worker('./assets/js/worker.js'),
  };

  const timerState = {
    state: handlePomodoroTimerCycle(pomodoroTimerState),
    timeout: false,
  };

  pomodoroTimerState.timerStarted = true;

  const instance = worker.instance;

  instance.onmessage = () => {
    if (timerState.timeout) {
      instance.terminate();

      handlePomodoroCyclesComponent();

      pomodoroTimerState.timerCycle++;
      pomodoroTimerState.timerStarted = false;

      const audio = generateAudio('./assets/sounds/pomodoro.mp3');
      audio.play();

      setTimeout(() => {
        audio.reset();

        startPomodoroTimer();
      }, calculateTimeAsMilliseconds(1, 'seconds'));
    }

    pomodoroTimer.innerHTML = formatPomodoroTimerAsText(timerState.state);

    timerState.state -= calculateTimeAsMilliseconds(1, 'seconds');

    timerState.timeout = timerState.state === 0;
  };
}

function handlePomodoroCyclesComponent() {
  const component = pomodoroCycles[pomodoroTimerState.focusCycles];

  if (isFocusCycleCompleted()) {
    component.classList.add('done');
    pomodoroTimerState.focusCycles++;
  }
}

function resetPomodoroCyclesComponent() {
  pomodoroCycles.forEach((cycle) => cycle.classList.remove('done'));
}

function resetPomodoroTimerState() {
  pomodoroTimerState.timerCycle = 1;
  pomodoroTimerState.focusCycles = 0;
}

function handlePomodoroTimerCycle(timerState = pomodoroTimerState) {
  if (timerState.timerCycle % 2 === 0) {
    setPomodoroTimerTitle('Relax mode');

    if (timerState.timerCycle === timerState.stopAfterCycle) {
      return timerState.longInterval;
    }

    return timerState.shortInterval;
  }

  setPomodoroTimerTitle('Focus mode');

  return timerState.focusTime;
}

function isPomodoroTimerCycleMoreThan(cycle) {
  return pomodoroTimerState.timerCycle > cycle;
}

function setPomodoroTimerTitle(title) {
  pomodoroTitle.innerHTML = title;
}

function generateAudio(source) {
  const audio = new Audio(source);
  return {
    audio,
    play() {
      audio.play();
    },
    reset() {
      audio.pause();
      audio.currentTime = 0;
    },
  };
}

function calculateTimeAsMilliseconds(time, timeUnit) {
  if (timeUnit === 'seconds') return time * 1000;
  if (timeUnit === 'minutes') return time * 1000 * 60;
}

function formatPomodoroTimerAsText(time) {
  const timeFormatted = {
    minutes: Math.floor(time / (1000 * 60)),
    seconds: Math.floor((time / 1000) % 60),
  };

  if (timeFormatted.minutes < 10)
    timeFormatted.minutes = `0${timeFormatted.minutes}`;

  if (timeFormatted.seconds < 10)
    timeFormatted.seconds = `0${timeFormatted.seconds}`;

  return `${timeFormatted.minutes}:${timeFormatted.seconds}`;
}

function isFocusCycleCompleted() {
  return pomodoroTimerState.timerCycle % 2 === 1;
}
