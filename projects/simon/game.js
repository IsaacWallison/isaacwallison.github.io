const startButton = document.querySelector('#start-button');
const simonButtons = document.querySelectorAll('.simon-btn');
const levelTitle = document.querySelector('#level-title');
const colors = ['green', 'red', 'yellow', 'blue'];

const state = {
  randomSequence: {},
  choosenSequence: {},
  level: 0,
  sequenceAccess: 1,
  isPossibleToChoose: false,
};

simonButtons.forEach((button) => {
  button.addEventListener('click', (ev) => chooseAction(ev));
});
startButton.addEventListener('click', () => startGame());

function chooseAction(ev) {
  if (!state.isPossibleToChoose) return;

  animateButton(ev.target);

  handleSoundForButton(ev.target);

  setChoosenSequenceByButtonId(ev.target);

  if (compareSequencesBySequenceAccess()) {
    if (state.sequenceAccess === getSizeOfSequence(state.randomSequence)) {
      state.isPossibleToChoose = false;

      setTimeout(() => {
        nextSequence();
      }, 1000);

      return;
    }

    state.sequenceAccess++;

    return;
  }

  toggleStartButtonVisibility();
  gameOver();
}

function reset() {
  state.isPossibleToChoose = false;
  state.randomSequence = {};
  state.choosenSequence = {};
  state.level = 0;
  state.sequenceAccess = 1;
}

function startGame() {
  animateButtonAndSetRandomSequence();

  toggleStartButtonVisibility();

  toggleLevelTitleVisibility();

  setLevelTitle(state.level);

  state.isPossibleToChoose = true;
}

function gameOver() {
  reset();
  toggleLevelTitleVisibility();

  const audio = getSoundFor('wrong');
  audio.play();

  document.body.classList.add('game-over');

  setTimeout(() => {
    document.body.classList.remove('game-over');
  }, 200);
}

function nextSequence() {
  state.choosenSequence = {};
  state.isPossibleToChoose = true;
  state.level++;
  state.sequenceAccess = 1;

  animateButtonAndSetRandomSequence();
  setLevelTitle(state.level);
}

function animateButtonAndSetRandomSequence() {
  const randomColor = getRandomColor();

  animateRandomChoosenButton(randomColor);

  setRandomSequence(randomColor);
}

function setRandomSequence(randomColor) {
  const id = getSequenceId(state.randomSequence);
  state.randomSequence[id] = randomColor;
}

function setChoosenSequenceByButtonId(button) {
  const choosedColor = button.id;
  const id = getSequenceId(state.choosenSequence);

  state.choosenSequence[id] = choosedColor;
}

function setLevelTitle(level) {
  levelTitle.innerHTML = `Level ${level}`;
}

function compareSequencesBySequenceAccess() {
  const sequenceAccess = state.sequenceAccess;

  return (
    state.choosenSequence[sequenceAccess] ===
    state.randomSequence[sequenceAccess]
  );
}

function getSequenceId(sequence) {
  return Object.keys(sequence).length + 1;
}

function getSizeOfSequence(sequence) {
  return Object.keys(sequence).length;
}

function getRandomColor() {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function getSoundFor(id) {
  const sound = new Audio(`./sounds/${id}.mp3`);
  return sound;
}

function animateButton(button) {
  button.classList.add('pressed');

  setTimeout(() => {
    button.classList.remove('pressed');
  }, 100);
}

function handleSoundForButton(button) {
  const audio = getSoundFor(button.id);
  audio.play();
}

function animateRandomChoosenButton(randomColor) {
  const randomButton = document.querySelector(`#${randomColor}`);

  animateButton(randomButton);

  handleSoundForButton(randomButton);
}

function toggleStartButtonVisibility() {
  startButton.classList.toggle('none');
}

function toggleLevelTitleVisibility() {
  levelTitle.classList.toggle('none');
}
