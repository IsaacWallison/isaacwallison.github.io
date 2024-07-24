class RandomNumberGenerator {
  generateRandomNumber(number) {
    return Math.floor(Math.random() * (number + 1));
  }

  generateRandomNumberRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  shuffle(enumerable) {
    const vector = Array.from(enumerable);
    let count = 0;

    while (count < vector.length) {
      const randomIndex = this.generateRandomNumber(vector.length - 1);
      const temp = vector[count];
      vector[count] = vector[randomIndex];
      vector[randomIndex] = temp;

      count++;
    }

    return vector;
  }

  generateUniqueSetOfNumbers(options) {
    const set = new Set();

    if (options.number) set.add(options.number);

    if (!options.length) options.length = 4;

    while (set.size < options.length) {
      const randomNumber = this.generateRandomNumberRange(
        options.min,
        options.max
      );
      set.add(randomNumber);
    }

    return this.shuffle(set);
  }
}

class ComponentBuilder {
  constructor(component) {
    this.component = this.handleComponent(component);
  }

  build() {
    return this.component;
  }

  event(eventType, fn) {
    this.component.addEventListener(eventType, fn);
    return this;
  }

  set(attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      this.component[k] = v;
    });
    return this;
  }

  handleComponent(component) {
    return component instanceof Element
      ? component
      : document.createElement(component);
  }
}

class ActionsHandler {
  _instance = null;
  constructor() {
    if (ActionsHandler._instance) {
      return ActionsHandler._instance;
    }

    this.selectedTableNumbers = {};
    this.userResponse = undefined;

    this.currentNumberToAskUser = 1;
    this.latestNumberToAskUser = 9;

    this.corrects = 0;
    this.total = undefined;

    ActionsHandler._instance = this;
  }

  setSelectedTableNumber(number) {
    this.selectedTableNumbers[number] = number;
  }

  removeSelectedTableNumber(number) {
    delete this.selectedTableNumbers[number];
  }

  atLeastOneNumberSelected() {
    return Object.keys(this.selectedTableNumbers).length >= 1;
  }

  getTotalNumbersSelected() {
    return Object.keys(this.selectedTableNumbers).length;
  }

  setUserResponse(number) {
    this.userResponse = number;
    return this;
  }

  updateCorrects() {
    this.corrects++;
    return this;
  }

  getCorrects() {
    return this.corrects;
  }

  setTotal(totalNumbersSelected) {
    this.total = totalNumbersSelected;
    return this;
  }

  getTotal() {
    return this.total;
  }

  getTotalNumbersToAskUser() {
    return this.getTotalNumbersSelected() * this.latestNumberToAskUser;
  }

  isAnswerCorrect() {
    if (+this.calculateAnswer() === +this.userResponse) {
      return true;
    }
    return false;
  }

  getSelectedTableNumbers() {
    return this.selectedTableNumbers;
  }

  getFirstNumberOfTable() {
    return Number(Object.values(this.selectedTableNumbers)[0]);
  }

  calculateAnswer() {
    const answer = this.getFirstNumberOfTable() * this.currentNumberToAskUser;

    return answer;
  }

  nextQuestion() {
    this.handleNumberAskedToUser();
    this.currentNumberToAskUser++;
    if (this.isTableNumberListEmpty()) {
      new EventHandler().calculateResults();
      this.reset();

      return;
    }
    this.generateQuestion();
  }

  reset() {
    this.currentNumberToAskUser = 1;
    this.corrects = 0;
  }

  generateQuestion() {
    new QuestionHandler().updateQuestion(this.currentNumberToAskUser);
    new AnswerHandler().generateAnswers();
  }

  handleNumberAskedToUser() {
    if (this.isAnswerCorrect()) {
      this.updateCorrects();
    }
    if (this.currentNumberToAskUser === this.latestNumberToAskUser) {
      this.removeSelectedTableNumber(this.getFirstNumberOfTable());
      this.currentNumberToAskUser = 1;
    }
  }

  isTableNumberListEmpty() {
    if (!this.atLeastOneNumberSelected()) {
      return true;
    }
    return false;
  }
}

class TableNumberHandler {
  getTableNumbers() {
    return document.querySelectorAll('.chooseable-number');
  }

  toggleTableNumberSelected() {
    const tableNumbers = this.getTableNumbers();
    const startButton = new StartButtonHandler();

    tableNumbers.forEach((el) => {
      el.addEventListener('click', (ev) => {
        const { parentElement: selectableComponent, value } = ev.target;
        selectableComponent.classList.toggle('selected');

        this.handleSelectAndUnselect(selectableComponent, value);

        startButton.toggleDisabled();
      });
    });
  }

  isSelected(selectableComponent) {
    return selectableComponent.classList.contains('selected');
  }

  handleSelectAndUnselect(selectableComponent, value) {
    if (this.isSelected(selectableComponent)) {
      new ActionsHandler().setSelectedTableNumber(value);
    } else {
      new ActionsHandler().removeSelectedTableNumber(value);
    }
  }

  unSelectAllTableNumbers() {
    const tableNumbers = this.getTableNumbers();
    tableNumbers.forEach((el) => {
      const { parentElement: selectableComponent } = el;
      selectableComponent.classList.remove('selected');
    });

    new StartButtonHandler().toggleDisabled();
  }
}

class StartButtonHandler {
  constructor() {
    this.started = false;
  }

  getStartButton() {
    return document.querySelector('#startButton');
  }

  toggleDisabled() {
    const startButton = this.getStartButton();
    const atLeastOneNumberSelected =
      new ActionsHandler().atLeastOneNumberSelected();

    if (!atLeastOneNumberSelected) {
      startButton.disabled = true;

      return;
    }

    startButton.disabled = false;
    this.addStartGameEvent(startButton);
  }

  addStartGameEvent(startButton) {
    const unstartedBoard = document.querySelector('#table-board');
    const startedBoard = document.querySelector('#quiz-board');

    startButton.addEventListener('click', () => {
      unstartedBoard.classList.add('none');
      startedBoard.classList.remove('none');

      new ActionsHandler()
        .setTotal(new ActionsHandler().getTotalNumbersToAskUser())
        .generateQuestion();

      new Timer().startTimer();
    });
  }
}

class QuestionHandler {
  updateQuestion(currentNumberToAskUser) {
    const number = new ActionsHandler().getFirstNumberOfTable();
    document.querySelector(
      '#question'
    ).innerHTML = `${number} x ${currentNumberToAskUser}`;
  }
}

class AnswerHandler {
  getAnswersContainer() {
    return document.querySelector('#answers');
  }

  appendToAnswersContainer(component) {
    const answersContainer = this.getAnswersContainer();

    answersContainer.append(component);
  }

  clearAnswersContainer() {
    const answersContainer = this.getAnswersContainer();

    answersContainer.innerHTML = '';
  }

  generateAnswers() {
    this.clearAnswersContainer();
    const correctAnswer = new ActionsHandler().calculateAnswer();

    new RandomNumberGenerator()
      .generateUniqueSetOfNumbers({
        min: correctAnswer + 1,
        max: correctAnswer + 5,
        number: correctAnswer,
      })
      .forEach((number) => {
        this.generateAnswerComponent(number);
      });
  }

  generateAnswerComponent(number) {
    const label = new ComponentBuilder('label')
      .set({
        for: number,
      })
      .build();

    const input = new ComponentBuilder('input')
      .set({
        type: 'checkbox',
        className: 'number answer',
        value: number,
        id: number,
      })
      .event('change', (ev) => new EventHandler().selectAnswer(ev))
      .build();

    const span = new ComponentBuilder('span')
      .set({
        innerHTML: number,
      })
      .build();

    label.append(input);
    label.append(span);

    this.appendToAnswersContainer(label);
  }

  selectAllAnswersWhenTimeout() {
    const answers = document.querySelectorAll('.answer');
    answers.forEach((el) => {
      const { parentElement: selectableComponent } = el;

      if (+el.value === new ActionsHandler().calculateAnswer()) {
        selectableComponent.classList.add('correct');
      } else {
        selectableComponent.classList.add('incorrect');
      }
    });
  }
}

class EventHandler {
  selectAnswer(ev) {
    const { parentElement: selectableComponent, value } = ev.target;
    const actionsHandler = new ActionsHandler();

    actionsHandler.setUserResponse(value);

    this.handleCorrectAndIncorrectAnswer(selectableComponent);

    setTimeout(() => {
      new ActionsHandler().nextQuestion();
      new Timer().startTimer();
    }, 1000);
  }

  closeResultsModal() {
    const unstartedBoard = document.querySelector('#table-board');
    const resultsModal = document.querySelector('#modal');

    unstartedBoard.classList.remove('none');
    resultsModal.classList.add('none');
  }

  openResultsModal() {
    const startedBoard = document.querySelector('#quiz-board');
    const resultsModal = document.querySelector('#modal');

    startedBoard.classList.add('none');
    resultsModal.classList.remove('none');
  }

  continueEvent() {
    const continueButton = document.querySelector('#continue');

    continueButton.addEventListener('click', () => {
      this.closeResultsModal();
      new TableNumberHandler().unSelectAllTableNumbers();
    });
  }

  calculateResults() {
    this.openResultsModal();
    this.updatePercentage();
    this.updateTotal();
    this.continueEvent();
  }

  calculatePercentage() {
    const corrects = new ActionsHandler().getCorrects();

    const total = new ActionsHandler().getTotal();

    const result = Math.floor((corrects * 100) / total);

    return result;
  }

  updatePercentage() {
    const percentage = document.querySelector('#percentage');

    percentage.innerHTML = `${this.calculatePercentage()}%`;
  }

  updateTotal() {
    const total = document.querySelector('#corrects');

    const actionsHandler = new ActionsHandler();

    total.innerHTML = `${actionsHandler.getCorrects()} of ${actionsHandler.getTotal()} correct(s)`;
  }

  handleCorrectAndIncorrectAnswer(selectableComponent) {
    if (new ActionsHandler().isAnswerCorrect()) {
      selectableComponent.classList.add('correct');
    } else {
      selectableComponent.classList.add('incorrect');
    }
  }
}

class Timer {
  _instance = null;
  constructor() {
    if (Timer._instance) {
      return Timer._instance;
    }

    this.timerComponent = document.querySelector('#time');
    this.seconds = 10;
    this.timer = null;

    Timer._instance = this;
  }

  startTimer(time = 10) {
    this.stopTimer(this.timer);

    this.seconds = this.setSecondsToMiliseconds(time);

    this.setTimer(this.seconds);

    this.handleTimerComponent();

    this.timer = setInterval(() => {
      this.handleTimerComponent();
      this.handleTimeout();

      this.setTimer(this.seconds);
      this.seconds = this.updateTime(this.seconds);
    }, 1000);
  }

  handleTimerComponent() {
    const fiveMiliseconds = 5 * 1000;
    if (this.seconds <= fiveMiliseconds) {
      this.timerComponent.classList.remove('timer-blue');
    } else {
      this.timerComponent.classList.add('timer-blue');
    }
  }

  handleTimeout() {
    if (this.seconds <= 0) {
      new AnswerHandler().selectAllAnswersWhenTimeout();
      clearInterval(this.timer);
    }
  }

  updateTime(time) {
    return time - 1000;
  }

  setSecondsToMiliseconds(seconds) {
    return seconds * 1000;
  }

  setTimer(time) {
    this.timerComponent.innerHTML = `${this.setMilisecondsToSeconds(time)}`;
  }

  setMilisecondsToSeconds(ms) {
    return ms / 1000;
  }

  stopTimer(timer) {
    if (timer) {
      return clearInterval(timer);
    }
  }
}

class TableGame {
  start() {
    new TableNumberHandler().toggleTableNumberSelected();
  }
}

new TableGame().start();
