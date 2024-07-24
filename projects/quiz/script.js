class QuestionHandler {
  constructor() {
    this.questions = undefined;
  }

  async getQuestions(uri) {
    await this.fetchQuestions(uri);
    return this.questions;
  }

  async fetchQuestions(uri) {
    try {
      const response = await fetch(uri);
      this.questions = await response.json();
    } catch (error) {
      return error;
    }
  }
}

class ComponentHandler {
  static select(element) {
    return document.querySelector(element);
  }
  static selectAll(elements) {
    return document.querySelectorAll(elements);
  }

  static enableButton(button) {
    button.disabled = false;
  }
  static disableButton(button) {
    button.disabled = true;
  }
}

class EventHandler {
  constructor(element) {
    this.element = element;
  }

  setEvent(eventType, fn) {
    this.element.addEventListener(eventType, (ev) => fn(ev));
  }

  setEvents(eventType, fn) {
    this.element.forEach((el) => {
      el.addEventListener(eventType, (ev) => fn(ev));
    });
  }
}

class QuizComponent {
  static instance = null;

  constructor() {
    if (QuizComponent.instance) {
      return QuizComponent.instance;
    }
    this.currentQuestion = ComponentHandler.select('#question');
    this.questionsCounter = ComponentHandler.select('#steps');

    this.answersSelector = ComponentHandler.selectAll('.answer');
    this.trueSelector = ComponentHandler.select('#true');
    this.falseSelector = ComponentHandler.select('#false');

    this.leftButton = ComponentHandler.select('#leftButton');
    this.rightButton = ComponentHandler.select('#rightButton');

    this.confirmButton = ComponentHandler.select('#confirm');
    this.restartButton = ComponentHandler.select('#restart');

    this.continueButton = ComponentHandler.select('#continue');

    this.resultsModal = ComponentHandler.select('#modal');

    QuizComponent.instance = this;
  }

  showCurrentAndTotalQuestions(questionIndex, totalQuestions) {
    this.questionsCounter.innerHTML = `${questionIndex}/${totalQuestions}`;
    return this;
  }

  showCurrentQuestion(questionNumber, currentQuestion) {
    this.currentQuestion.innerHTML = `${questionNumber}. ${currentQuestion}`;
    return this;
  }

  chooseTrueEvent(fn) {
    new EventHandler(this.trueSelector).setEvent('change', (ev) => fn(ev));
  }

  chooseFalseEvent(fn) {
    new EventHandler(this.falseSelector).setEvent('change', (ev) => fn(ev));
  }

  confirmAnswersEvent(fn) {
    new EventHandler(this.confirmButton).setEvent('click', (ev) => fn(ev));
  }

  continueEvent(fn) {
    new EventHandler(this.continueButton).setEvent('click', (ev) => fn(ev));
  }

  addSelectedClassToAnswerById(id) {
    this.removeSelectedClassFromSelectors();
    ComponentHandler.select(`#${id}`).parentElement.classList.add('selected');
  }

  removeSelectedClassFromSelectors() {
    this.answersSelector.forEach((el) =>
      el.parentElement.classList.remove('selected')
    );
    return this;
  }

  resetSelectedAnswers() {
    this.answersSelector.forEach((el) => {
      el.checked = false;
    });
    return this;
  }

  checkAnswerComponentById(id) {
    ComponentHandler.select(`#${id}`).checked = true;
    return this;
  }

  rightButtonClickEvent(fn) {
    new EventHandler(this.rightButton).setEvent('click', (ev) => fn(ev));
  }

  leftButtonClickEvent(fn) {
    new EventHandler(this.leftButton).setEvent('click', (ev) => fn(ev));
  }

  enableDisableLeftButton(questionIndex) {
    if (questionIndex === 0) {
      ComponentHandler.disableButton(this.leftButton);
      return;
    }

    ComponentHandler.enableButton(this.leftButton);
  }

  toggleRightButtonVisibility(questionIndex, totalQuestions) {
    if (questionIndex === totalQuestions - 1) {
      this.rightButton.classList.add('none');
      return;
    }

    this.rightButton.classList.remove('none');
  }

  toggleConfirmButtonVisibility(questionIndex, totalQuestions) {
    if (questionIndex === totalQuestions - 1) {
      this.showConfirmButton();
      return;
    }

    this.hideConfirmButton();
  }

  hideConfirmButton() {
    this.confirmButton.classList.add('none');
    return this;
  }

  showConfirmButton() {
    this.confirmButton.classList.remove('none');
    return this;
  }

  restartEvent(fn) {
    new EventHandler(this.restartButton).setEvent('click', (ev) => fn(ev));
  }

  toggleRestartButtonVisibility(questionIndex, totalQuestions) {
    if (questionIndex === totalQuestions - 1) {
      this.showRestartButton();
      return;
    }

    this.hideRestartButton();
  }

  showRestartButton() {
    this.restartButton.classList.remove('none');
    return this;
  }

  hideRestartButton() {
    this.restartButton.classList.add('none');
    return this;
  }

  enableDisableConfirmButton(totalQuestionsAnswered, totalQuestions) {
    if (totalQuestionsAnswered === totalQuestions) {
      ComponentHandler.enableButton(this.confirmButton);
      return;
    }

    ComponentHandler.disableButton(this.confirmButton);
  }

  showResultsModal() {
    this.resultsModal.classList.remove('none');
    return this;
  }

  hideResultsModal() {
    this.resultsModal.classList.add('none');
    return this;
  }

  showTotalCorrectAnswers(totalCorrects, totalAnswers) {
    this.resultsModal.querySelector(
      '#corrects'
    ).innerHTML = `${totalCorrects}/${totalAnswers}`;
  }

  showPercentageOfAnswersCorrect(percentage) {
    const percentageComponent = this.resultsModal.querySelector('#percentage');

    if (percentage === 0) {
      percentageComponent.innerHTML = 'This is absolutely normal. Try again.';
      return;
    }

    percentageComponent.innerHTML = `This is ${percentage}% of questions that are correct.`;
  }

  removeCorrectIncorrectClasses() {
    this.answersSelector.forEach((answer) => {
      const answerComponent = answer.parentElement;
      answerComponent.classList.remove('correct');
      answerComponent.classList.remove('incorrect');
    });
  }

  addCorrectClassById(id) {
    this.removeCorrectIncorrectClasses();
    ComponentHandler.select(`#${id}`).parentElement.classList.add('correct');
  }

  addIncorrectClassById(id) {
    this.removeCorrectIncorrectClasses();
    ComponentHandler.select(`#${id}`).parentElement.classList.add('incorrect');
  }
}

class QuizHandler {
  constructor() {
    this.quizResource = undefined;
    this.questions = undefined;

    this.questionIndex = 0;
    this.totalQuestions = 0;

    this.choosedAnswers = {};

    this.answersConfirmed = false;
  }

  start() {
    this.getQuestions().then((response) => {
      this.questions = response;
      this.totalQuestions = response.length;
      this.updateState();
      this.startQuiz();
    });
  }

  setQuizResource(resource) {
    this.resource = resource;
    return this;
  }

  getQuestions() {
    return new QuestionHandler().getQuestions(this.resource);
  }

  startQuiz() {
    this.showCurrentQuestion();
    this.showCurrentAndTotalQuestions();

    this.chooseTrueEvent();
    this.chooseFalseEvent();
    this.confirmAnswersEvent();
    this.continueEvent();
    this.restartEvent();

    this.incrementQuestionIndex();
    this.decrementQuestionIndex();
  }

  chooseTrueEvent() {
    const quizComponent = new QuizComponent();

    quizComponent.chooseTrueEvent((ev) => {
      this.choosedAnswers[this.questions[this.questionIndex].id] = [
        ev.target.id,
        ev.target.value,
      ];

      this.enableDisableConfirmButton();
      this.handleAnswerCheckedState(ev.target.id);
    });
  }

  chooseFalseEvent() {
    const quizComponent = new QuizComponent();

    quizComponent.chooseFalseEvent((ev) => {
      this.choosedAnswers[this.questions[this.questionIndex].id] = [
        ev.target.id,
        ev.target.value,
      ];

      this.enableDisableConfirmButton();
      this.handleAnswerCheckedState(ev.target.id);
    });
  }

  confirmAnswersEvent() {
    new QuizComponent().confirmAnswersEvent(() => {
      this.answersConfirmed = true;

      new QuizComponent().showResultsModal();

      const totalAnswersCorrect = this.calculateCorrectAnswers();

      new QuizComponent().showTotalCorrectAnswers(
        totalAnswersCorrect,
        this.totalQuestions
      );
      new QuizComponent().showPercentageOfAnswersCorrect(
        this.calculatePercentageOfAnswersCorrect(totalAnswersCorrect)
      );
    });
  }

  continueEvent() {
    new QuizComponent().continueEvent(() => {
      new QuizComponent()
        .hideResultsModal()
        .hideConfirmButton()
        .showRestartButton();

      this.handleCorrectIncorrectClasses();
    });
  }

  restartEvent() {
    new QuizComponent().restartEvent(() => {
      this.reset();
      this.updateState();

      new QuizComponent().hideRestartButton().removeCorrectIncorrectClasses();
    });
  }

  incrementQuestionIndex() {
    new QuizComponent().rightButtonClickEvent(() => {
      this.questionIndex++;
      this.updateState();
    });
  }

  decrementQuestionIndex() {
    new QuizComponent().leftButtonClickEvent(() => {
      this.questionIndex--;
      this.updateState();
    });
  }

  showCurrentQuestion() {
    const questionNumber = this.questionIndex + 1;
    const currentQuestion = this.questions[this.questionIndex];

    new QuizComponent().showCurrentQuestion(
      questionNumber,
      currentQuestion.question
    );
  }

  showCurrentAndTotalQuestions() {
    new QuizComponent().showCurrentAndTotalQuestions(
      this.questionIndex + 1,
      this.totalQuestions
    );
  }

  handleSelectedAnswers() {
    if (this.isCurrentQuestionAnswered()) {
      const [componentId] = this.choosedAnswers[this.getCurrentQuestionId()];

      this.handleAnswerCheckedState(componentId);

      return;
    }

    new QuizComponent()
      .resetSelectedAnswers()
      .removeSelectedClassFromSelectors();
  }

  handleAnswerCheckedState(id) {
    new QuizComponent()
      .checkAnswerComponentById(id)
      .addSelectedClassToAnswerById(id);
  }

  handleCorrectIncorrectClasses() {
    if (!this.answersConfirmed) return;

    const currentQuestion = this.getCurrentQuestion();
    const componentId = this.choosedAnswers[currentQuestion.id][1];

    if (this.isAnswerCorrect(currentQuestion)) {
      new QuizComponent().addCorrectClassById(componentId);
      return;
    }

    new QuizComponent().addIncorrectClassById(componentId);
  }

  enableDisableLeftButton() {
    new QuizComponent().enableDisableLeftButton(this.questionIndex);
  }

  toggleRightButtonVisibility() {
    new QuizComponent().toggleRightButtonVisibility(
      this.questionIndex,
      this.totalQuestions
    );
  }

  toggleConfirmButtonVisibility() {
    if (this.answersConfirmed) return;

    new QuizComponent().toggleConfirmButtonVisibility(
      this.questionIndex,
      this.totalQuestions
    );
  }

  toggleRestartButtonVisibility() {
    if (!this.answersConfirmed) return;

    new QuizComponent().toggleRestartButtonVisibility(
      this.questionIndex,
      this.totalQuestions
    );
  }

  enableDisableConfirmButton() {
    new QuizComponent().enableDisableConfirmButton(
      this.getTotalQuestionsAnswered(),
      this.totalQuestions
    );
  }

  updateState() {
    this.showCurrentAndTotalQuestions();
    this.showCurrentQuestion();

    this.handleSelectedAnswers();
    this.handleCorrectIncorrectClasses();

    this.enableDisableLeftButton();
    this.enableDisableConfirmButton();

    this.toggleRightButtonVisibility();
    this.toggleConfirmButtonVisibility();
    this.toggleRestartButtonVisibility();
  }

  reset() {
    this.choosedAnswers = {};
    this.answersConfirmed = false;
    this.questionIndex = 0;
    this.updateState();

    new QuizComponent().hideRestartButton().removeCorrectIncorrectClasses();
  }

  getTotalQuestionsAnswered() {
    return Object.keys(this.choosedAnswers).length;
  }

  isCurrentQuestionAnswered() {
    return this.choosedAnswers[this.getCurrentQuestionId()];
  }

  isAnswerCorrect(question) {
    return this.choosedAnswers[question.id][1] === question.answer;
  }

  getCurrentQuestion() {
    return this.questions[this.questionIndex];
  }

  getCurrentQuestionId() {
    return this.getCurrentQuestion().id;
  }

  calculateCorrectAnswers() {
    let totalCorrect = 0;
    this.questions.forEach((question) => {
      if (this.isAnswerCorrect(question)) {
        totalCorrect += 1;
      }
    });
    return totalCorrect;
  }

  calculatePercentageOfAnswersCorrect(totalAnswersCorrect) {
    return (totalAnswersCorrect * 100) / this.totalQuestions;
  }
}

new QuizHandler().setQuizResource('questions.json').start();
