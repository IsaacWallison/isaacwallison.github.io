(() => {
  const quizComponent = document.querySelector('#quiz');
  const question = document.querySelector('#question');
  const questionNumber = document.querySelector('#question-number');
  const answerComponents = document.querySelectorAll('.answer');
  const leftButton = document.querySelector('#left-button');
  const rightButton = document.querySelector('#right-button');
  const confirmButton = document.querySelector('#confirm-button');
  const continueButton = document.querySelector('#continue-button');
  const restartButton = document.querySelector('#restart-button');
  const resultsModal = document.querySelector('#results-modal');

  const state = {
    questions: [],
    currentQuestion: 0,
    getTotalQuestions() {
      return this.questions.length;
    },
    getCurrentQuestion() {
      return this.questions[this.currentQuestion];
    },
  };

  const answers = {};

  async function init() {
    await getQuestions();
    updateState();
    addListeners();
  }

  function handleEvents(e) {
    if (e.target.classList.contains('button-icon')) {
      e.target.closest('button').click();
    }
    const { id } = e.target;
    switch (id) {
      case 'true':
      case 'false':
        chooseAnswer(e);
        return;
      case 'left-button':
        moveLeft();
        return;
      case 'right-button':
        moveRight();
        return;
      case 'confirm-button':
        confirmAnswers();
        return;
      case 'restart-button':
        restart();
        return;
    }
  }

  function addListeners() {
    quizComponent.addEventListener('click', (e) => {
      handleEvents(e);
    });
    continueButton.addEventListener('click', closeResultsModal);
  }

  function randomize(values) {
    const randomValues = Array.from(values);

    randomValues.forEach((_, i) => {
      const random = Math.floor(Math.random() * randomValues.length);
      const temp = randomValues[i];
      randomValues[i] = randomValues[random];
      randomValues[random] = temp;
    });

    return randomValues;
  }

  async function getQuestions(numberOfQuestions = 5) {
    const response = await fetch('questions.json');
    const questions = await response.json();
    const randomQuestions = randomize(questions);
    const totalQuestions = randomQuestions.splice(0, numberOfQuestions);

    state.questions = totalQuestions;
  }

  function setCurrentQuestion() {
    const currentQuestion = state.getCurrentQuestion();
    question.innerHTML = `${state.currentQuestion + 1}. ${
      currentQuestion.question
    }`;
  }

  function setQuestionNumber() {
    const totalQuestions = state.getTotalQuestions();
    questionNumber.innerHTML = `${state.currentQuestion + 1}/${totalQuestions}`;
  }

  function setLeftButtonState() {
    state.currentQuestion > 0
      ? (leftButton.disabled = false)
      : (leftButton.disabled = true);
  }

  function setRightButtonState() {
    if (!answers.confirmed) {
      handleRightAndConfirmButtonVisibility();
      return;
    }

    handleRightAndRestartButtonVisibility();
  }

  function handleRightAndConfirmButtonVisibility() {
    if (isLastQuestionVisible()) {
      confirmButton.classList.remove('none');
      rightButton.classList.add('none');

      return;
    }

    if (!isVisible(rightButton) && isVisible(confirmButton)) {
      confirmButton.classList.add('none');
      rightButton.classList.remove('none');
    }
  }

  function handleRightAndRestartButtonVisibility() {
    if (isLastQuestionVisible()) {
      restartButton.classList.remove('none');
      rightButton.classList.add('none');

      return;
    }

    if (!isVisible(rightButton) && isVisible(restartButton)) {
      restartButton.classList.add('none');
      rightButton.classList.remove('none');
    }
  }

  function updateState() {
    setCurrentQuestion();
    setQuestionNumber();
    setLeftButtonState();
    setRightButtonState();
    setSelectedAnswerState();
    setRightAndWrongQuestions();
  }

  function chooseAnswer(e) {
    const answer = e.target.id;

    removeAllSelectedAnswerClasses();
    e.target.closest('label').classList.add('selected');

    isAnswerCorrect(answer)
      ? (answers[state.currentQuestion] = { isCorrect: true, answer: answer })
      : (answers[state.currentQuestion] = { isCorrect: false, answer: answer });

    if (isAllQuestionsAnswered()) {
      confirmButton.disabled = false;
    }
  }

  function moveLeft() {
    state.currentQuestion--;
    updateState();
  }

  function moveRight() {
    state.currentQuestion++;
    updateState();
  }

  function setSelectedAnswerState() {
    if (!answers[state.currentQuestion]) {
      answerComponents.forEach((answer) => {
        answer.checked = false;
        answer.closest('label').classList.remove('selected');
      });
      return;
    }
    const id = answers[state.currentQuestion].answer;
    const component = document.querySelector(`#${id}`);

    component.checked = true;

    removeAllSelectedAnswerClasses();
    component.closest('label').classList.add('selected');
  }

  function removeAllSelectedAnswerClasses() {
    answerComponents.forEach((component) => {
      component.closest('label').classList.remove('selected');
    });
  }

  function confirmAnswers() {
    answers.totalCorrect = 0;
    answers.confirmed = true;

    Object.values(answers).forEach((answer) => {
      if (answer.isCorrect) {
        answers.totalCorrect++;
      }
    });

    confirmButton.classList.add('none');
    restartButton.classList.remove('none');

    openResultsModal();
    setRightAndWrongQuestions();
  }

  function restart() {
    resetQuestions();
    resetAnswers();
    removeSelectedClasses();
    removeRightAndWrongClasses();
    handleRightAndConfirmButtonVisibility();
    handleRightAndRestartButtonVisibility();
    disableButton(confirmButton);
    updateState();
  }

  function resetQuestions() {
    (async () => {
      state.currentQuestion = 0;
      await getQuestions();
    })();
  }

  function resetAnswers() {
    Object.keys(answers).forEach((k) => {
      delete answers[k];
    });
  }

  function openResultsModal() {
    document.querySelector('#corrects').innerHTML = `${
      answers.totalCorrect
    }/${state.getTotalQuestions()}`;

    document.querySelector('#percentage').innerHTML =
      answers.totalCorrect === 0
        ? 'This is absolutely normal, try again.'
        : `You got ${calculatePercentageOfAnswersCorrect()}% of answers correct out of total.`;

    resultsModal.classList.add('modal');
    resultsModal.showModal();
  }

  function closeResultsModal() {
    resultsModal.classList.remove('modal');
    resultsModal.close();
  }

  function setRightAndWrongQuestions() {
    if (!answers.confirmed) return;

    removeRightAndWrongClasses();

    const answerVisible = answers[state.currentQuestion];
    const component = document
      .querySelector(`#${answerVisible.answer}`)
      .closest('label');

    if (answerVisible.isCorrect) {
      component.classList.add('correct');

      return;
    }

    component.classList.add('incorrect');
  }

  function removeRightAndWrongClasses() {
    answerComponents.forEach((component) => {
      component.closest('label').classList.remove('correct');
      component.closest('label').classList.remove('incorrect');
    });
  }

  function removeSelectedClasses() {
    answerComponents.forEach((component) => {
      component.closest('label').classList.remove('selected');
    });
  }

  function disableButton(button) {
    button.disabled = true;
  }

  function calculatePercentageOfAnswersCorrect() {
    const totalQuestions = state.getTotalQuestions();
    const totalCorrect = answers.totalCorrect;

    return Math.floor((totalCorrect * 100) / totalQuestions);
  }

  function isAnswerCorrect(answer) {
    return answer === state.getCurrentQuestion().answer;
  }

  function isLastQuestionVisible() {
    return state.currentQuestion === state.getTotalQuestions() - 1;
  }

  function isAllQuestionsAnswered() {
    return Object.keys(state.questions).length === Object.keys(answers).length;
  }

  function isVisible(component) {
    return !component.classList.contains('none');
  }

  init();
})();
