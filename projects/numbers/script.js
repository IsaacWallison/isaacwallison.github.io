class NumberGame {
  constructor() {
    this.numbers = document.querySelectorAll('.number');
    this.tableStart = document.querySelector('#table-board');
    this.startButton = document.querySelector('#start');
    this.continueButton = document.querySelector('#continue');
    this.quizBoard = document.querySelector('#quiz-board');
    this.question = document.querySelector('#question');
    this.answers = document.querySelector('#answers');
    this.modal = document.querySelector('#modal');
    this.corrects = document.querySelector('#corrects');
    this.percentage = document.querySelector('#percentage');

    this.timer = null;
    this.totalPoints = 0;
    this.starterNumber = 0;
    this.selectedElements = {};
    this.selected = {};
    this.selectedKey = null;
    this.selectedQuantity = 0;
    this.correctAnswer = null;
    this.startButton.disabled = Object.keys(this.selected).length === 0;
  }
  start() {
    this.events();
  }
  reset() {
    this.totalPoints = 0;
    this.timer = null;
    this.starterNumber = 0;
    this.correctAnswer = null;
    this.selectedKey = null;
    this.selected = {};
    Object.keys(this.selectedElements).forEach((k) => {
      this.selectedElements[k].checked = false;
      this.selectedElements[k].parentElement.classList.remove('selected');
    });
    this.selectedElements = {};
    this.startButton.disabled = Object.keys(this.selected).length === 0;
  }
  events() {
    this.numbers.forEach((e) =>
      e.addEventListener('change', (ev) => this.selectNumber(ev))
    );
    this.startButton.addEventListener('click', () => this.startGame());
    this.continueButton.addEventListener('click', () => this.toggleModal());
  }

  toggleMode() {
    this.tableStart.classList.toggle('none');
    this.quizBoard.classList.toggle('none');
  }

  startGame() {
    this.startTimer();
    this.generateQuestion();
    this.generateAnswers();
    this.toggleMode();

    this.question.textContent = `${this.selectedKey} x ${this.starterNumber}`;
  }

  selectNumber(ev) {
    ev.target.parentElement.classList.toggle('selected');
    if (ev.target.checked) {
      this.selected[ev.target.value] = [];
      this.selectedElements[ev.target.value] = ev.target;
    } else {
      delete this.selected[ev.target.value];
      delete this.selectedElements[ev.target.value];
    }
    this.startButton.disabled = Object.keys(this.selected).length === 0;
    this.selectedQuantity = Object.keys(this.selected).length;
  }

  nextQuestion() {
    this.startTimer();
    this.generateQuestion();
    this.generateAnswers();
    this.question.textContent = `${this.selectedKey} x ${this.starterNumber}`;
  }

  generateQuestion() {
    if (this.starterNumber === 9) {
      this.starterNumber = 0;
      delete this.selected[this.selectedKey];
      if (!Object.keys(this.selected).length) {
        clearInterval(this.timer);
        this.toggleModal();
        this.pontuationModal();
        this.reset();
        this.toggleMode();
        return;
      }
    }
    this.selectedKey = Object.keys(this.selected)[0];
    this.starterNumber += 1;
    this.correctAnswer = this.selectedKey * this.starterNumber;
  }

  generateAnswers() {
    const answers = this.generateArrayOfAnswers(this.correctAnswer);
    this.answers.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const label = document.createElement('label');
      const check = document.createElement('input');
      const answer = document.createElement('span');

      label.for = `answer${i + 1}`;

      check.id = `answer${i + 1}`;
      check.type = 'radio';
      check.value = `${answers[i]}`;
      check.name = 'answer';
      check.addEventListener('change', (ev) => this.confirmAnswer(ev));

      answer.textContent = `${answers[i]}`;

      label.append(check);
      label.append(answer);

      this.answers.appendChild(label);
    }
  }

  confirmAnswer(ev) {
    if (+ev.target.value === this.correctAnswer) {
      this.totalPoints += 1;
      ev.target.parentElement.classList.toggle('correct');
    } else {
      ev.target.parentElement.classList.toggle('incorrect');
    }
    //this.startTimer();
    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
    clearInterval(this.timer);
  }

  pontuationModal() {
    const totalQuestions = this.selectedQuantity * 9;
    const percentage = (this.totalPoints * 100) / totalQuestions;

    this.percentage.textContent =
      String(percentage).length <= 2
        ? `${percentage}%`
        : `${percentage.toFixed(2)}%`;
    this.corrects.textContent = `${this.totalPoints}/${totalQuestions} correct(s)`;
  }

  toggleModal() {
    this.modal.classList.toggle('none');
  }

  generateArrayOfAnswers(correctAnswer) {
    const set = new Set();
    set.add(correctAnswer);
    while (set.size !== 4) {
      set.add(this.generateRange(correctAnswer + 1, correctAnswer + 10));
    }
    const array = Array.from(set);
    return this.shuffle(array);
  }

  generateRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  startTimer() {
    let time = 10 * 1000;
    this.timer = setInterval(() => {
      if (time < 0) {
        clearInterval(this.timer);
        this.selectAllAnswers();
        setTimeout(() => {
          this.nextQuestion();
        }, 1000);
        return;
      }
      document.querySelector('#time').textContent = `${time / 1000}`;
      time -= 1000;
    }, 1000);
  }

  selectAllAnswers() {
    for (let i = 1; i <= 4; i++) {
      const e = document.querySelector(`#answer${i}`);
      if (+e.value === this.correctAnswer) {
        e.parentElement.classList.toggle('correct');
      } else {
        e.parentElement.classList.toggle('incorrect');
      }
    }
  }
}

const numberGame = new NumberGame();
numberGame.start();
