const startButton = document.querySelector('#start-button');

const buttonColors = ['red', 'green', 'blue', 'yellow'];

const userClickedPattern = [];

let gamePattern = [];
let level = 0;
let started = false;

function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
}

function animatePress(currentColor) {
  $(currentColor).addClass('pressed');
  setTimeout(() => {
    $(currentColor).removeClass('pressed');
  }, 100);
}

function nextSequence() {
  userClickedPattern.splice(0, userClickedPattern.length);
  level++;

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  const button = $(`#${randomChosenColor}`);
  button.fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColor);

  $('#level-title').html(`Level ${level}`);
}

$("[type='button']").click(function () {
  const userChosenColor = this.id;
  userClickedPattern.push(userChosenColor);

  animatePress(`#${userChosenColor}`);
  playSound(userChosenColor);

  if (userClickedPattern.length === gamePattern.length) checkAnswer();
});

window.addEventListener('keypress', (e) => {
  if (started) return;
  const code = e.key;

  if (code === 'a' || code === 'A') {
    nextSequence();
    started = true;
  }
});

startButton.addEventListener('click', (ev) => {
  if (started) return;

  nextSequence();
  started = true;
  $(ev.target).toggle('none').html('Start');
  $('#level-title').toggle('none');
});

function wrongPattern() {
  for (let i = 0; i < gamePattern.length; i++) {
    if (gamePattern[i] !== userClickedPattern[i]) return true;
  }
  return false;
}

function checkAnswer() {
  let isWrongPattern = wrongPattern();
  if (isWrongPattern) {
    playSound('wrong');
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over');
    }, 200);
    // $('#level-title').html('Game Over, press A to restart.');
    $('#level-title').toggle('none');
    $('#start-button').toggle('none').html('Restart');
    reset();

    return;
  }

  setTimeout(() => {
    nextSequence();
  }, 1000);
}

function reset() {
  started = false;
  gamePattern = [];
  level = 0;
}
