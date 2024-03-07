let worker = new Worker('./assets/js/worker.js');
// select pomodoro image to add click event
const pomodoroImage = document.querySelector('#pomodoro-img');
// select clock for change time
const pomodoroClock = document.querySelector('#clock');

const pomodoroSound = new Audio('./assets/sounds/pomodoro.mp3');

const title = document.querySelector('#title');

// dots elements to mark sessions
const roundElements = document.querySelectorAll('#round');

const timer = {
  shortInterval: 5 * 1000 * 60,
  longInterval: 15 * 1000 * 60,
  focus: 25 * 1000 * 60,
};

// pomodoro sessions
let round = 1;

// to return false if pomodoro image already clicked
let started = false;

// dots marker
let dotIndex = 0;

// add click event
pomodoroImage.onclick = async () => {
  if (started) return;
  if (!worker) worker = new Worker('./assets/js/worker.js');

  if (round % 2 === 1) title.textContent = 'Focus';
  else title.textContent = 'Relax';

  started = true;

  // 25 minutes calculation to miliseconds
  let pomodoroMinutes = timer.focus;

  if (round % 2 === 0) {
    if (round === 8) {
      // 15 minutes
      pomodoroMinutes = timer.longInterval;
    }
    // 5 minutes
    pomodoroMinutes = timer.shortInterval;
  }

  worker.onmessage = function () {
    // calculate remaining time from pomodoro minutes
    let minutesRemaining = Math.floor(pomodoroMinutes / 1000 / 60);
    let secondsRemaining = Math.floor(pomodoroMinutes / 1000) % 60;

    // if less than 10 add 0 to minutes and seconds remaining
    if (minutesRemaining < 10) minutesRemaining = `0${minutesRemaining}`;
    if (secondsRemaining < 10) secondsRemaining = `0${secondsRemaining}`;

    pomodoroClock.textContent = `${minutesRemaining}:${secondsRemaining}`;

    pomodoroMinutes -= 1000;

    if (pomodoroMinutes < 0) {
      if (round % 2 === 1 || round === 1) {
        // round - 1 to select as array is index 0
        roundElements[dotIndex].classList.add('done');
        dotIndex++;
      }
      round++;
      started = false;

      if (round === 9) {
        roundElements.forEach((element) => element.classList.remove('done'));
        dotIndex = 0;
        round = 1;
        started = false;
        //clearInterval(pomodoroCounter);
        worker.terminate();
        worker = null;
        return;
      }

      pomodoroImage.click();
      pomodoroSound.play();

      setTimeout(() => {
        pomodoroSound.pause();
      }, 1000);

      //clearInterval(pomodoroCounter);
    }
  };
};
