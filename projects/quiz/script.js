const quiz = [
  { id: 1, question: 'Is the bubble sort algorithm O(n)?', answer: 'false' },
  { id: 2, question: 'Are binary trees graphs as well?', answer: 'true' },
  { id: 3, question: 'Are binary trees always O(log n)?', answer: 'false' },
  { id: 4, question: 'Hash tables are O(1) for lookup?', answer: 'true' },
];
class Quiz {
  constructor() {
    this.question = document.querySelector('#question');
    this.answers = document.querySelectorAll('.answer');
    this.corrects = document.querySelector('#corrects');
    this.steps = document.querySelector('#steps');
    this.leftButton = document.querySelector('#moveLeft');
    this.rightButton = document.querySelector('#moveRight');
    this.confirmButton = document.querySelector('#confirm');
    this.restartButton = document.querySelector('#restart');
    this.continueButton = document.querySelector('#continue');
    this.modal = document.querySelector('#modal');
    this.percentage = document.querySelector('#percentage');

    this.quiz = quiz;
    this.selected = {};
    this.selectedElements = {};
    this.currentQuestion = 0;
    this.correct = 0;
    this.answered = false;
  }

  start() {
    this.set(this.currentQuestion);
    this.events();
  }

  events() {
    this.answers.forEach((answer) => {
      answer.addEventListener('change', (ev) => this.answer(ev));
    });
    this.leftButton.addEventListener('click', () => this.moveLeft());
    this.rightButton.addEventListener('click', () => this.moveRight());
    this.confirmButton.addEventListener('click', () => this.confirmAnswers());
    this.restartButton.addEventListener('click', () => this.restartQuiz());
    this.continueButton.addEventListener('click', () => this.toggleModal());
  }

  set(index) {
    this.question.textContent = `${index + 1} . ${this.quiz[index].question}`;
    this.steps.textContent = `${index + 1}/${this.quiz.length}`;
    this.toggleDisabled();
    this.toggleSelected();
    if (this.answered) {
      this.disableToggleButtons();
      this.displayRightAndWrong();
      this.corrects.textContent = `${this.correct}/${this.quiz.length}`;
      this.percentage.textContent = `${this.calculatePercentage()}%`;
    }
  }

  answer(ev) {
    this.selected[this.currentQuestion] = ev.target.value;
    this.toggleDisabled();
    this.toggleSelected();
  }

  confirmAnswers() {
    for (const [key, value] of Object.entries(this.selected)) {
      if (this.quiz[key].answer === value) {
        this.correct += 1;
      }
    }
    this.answered = true;
    this.restartButton.classList.toggle('none');
    this.confirmButton.classList.toggle('none');
    //this.displayRightAndWrong();
    this.toggleModal();
    this.set(this.currentQuestion);
  }

  restartQuiz() {
    this.selected = {};
    this.currentQuestion = 0;
    this.correct = 0;
    this.answered = false;
    this.restartButton.classList.toggle('none');
    this.answers.forEach((e) => (e.disabled = false));
    this.set(this.currentQuestion);
  }

  moveLeft() {
    this.currentQuestion -= 1;
    this.set(this.currentQuestion);
  }

  moveRight() {
    this.currentQuestion += 1;
    this.set(this.currentQuestion);
  }

  toggleDisabled() {
    if (this.currentQuestion <= 0) {
      this.leftButton.disabled = true;
    } else {
      this.leftButton.disabled = false;
    }
    if (this.currentQuestion >= this.quiz.length - 1) {
      this.rightButton.classList.add('none');
      if (!this.answered) this.confirmButton.classList.remove('none');
      if (this.answered) this.restartButton.classList.remove('none');
      if (this.questionsAreAnswered()) {
        this.confirmButton.disabled = false;
      } else {
        this.confirmButton.disabled = true;
      }
    } else {
      this.rightButton.classList.remove('none');
      this.confirmButton.classList.add('none');
      this.restartButton.classList.add('none');
    }
  }

  toggleSelected() {
    const selected = this.selected[this.currentQuestion];
    this.removeSelected();
    if (selected) {
      document.querySelector(`#${selected}`).checked = true;
      document
        .querySelector(`#${selected}`)
        .parentElement.classList.add('selected');
    } else {
      this.resetSelected();
    }
  }

  removeSelected() {
    document
      .querySelector('#true')
      .parentElement.classList.remove('selected', 'incorrect', 'correct');
    document
      .querySelector('#false')
      .parentElement.classList.remove('selected', 'incorrect', 'correct');
  }

  disableToggleButtons() {
    this.answers.forEach((e) => (e.disabled = true));
  }

  toggleModal() {
    this.modal.classList.toggle('none');
  }

  calculatePercentage() {
    const percent = (this.correct * 100) / this.quiz.length;
    if (String(percent).length < 4) return percent;
    return percent.toFixed(2);
  }

  resetSelected() {
    document.querySelector('#true').checked = false;
    document.querySelector('#false').checked = false;
  }

  questionsAreAnswered() {
    return Object.keys(this.selected).length === this.quiz.length;
  }

  displayRightAndWrong() {
    // after confirm display right and wrong
    const k = this.selected[this.currentQuestion];
    this.removeSelected();
    if (k === this.quiz[this.currentQuestion].answer) {
      document.querySelector(`#${k}`).parentElement.classList.add('correct');
    } else {
      document.querySelector(`#${k}`).parentElement.classList.add('incorrect');
    }
  }
}

const q = new Quiz();
q.start();
