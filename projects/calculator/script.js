class Calculator {
  constructor() {
    this.select = (element) => document.querySelector(element);
    this.selectAll = (elements) => document.querySelectorAll(elements);
    this.screen = this.select('#screen');
    this.numberButtons = this.selectAll('.numbers');
    this.symbolButtons = this.selectAll('.symbols');
    this.equalsButton = this.select('#equals');
    this.clearButton = this.select('#clear');
    this.leftButton = this.select('#leftButton');
    this.parenthesesButton = this.select('#parentheses');
    // this.rightButton = this.select('#rightButton');
    this.currentNumber = '';
    this.calculation = '';
    this.value = '';
    this.result = null;
    this.operators = [];
    this.history = [];
    this.signals = ['*', '-', '+', '%', '/', '.', 'x', '÷', ','];
    this.operatorsRegex = /x|\-|\+|\%|\/|÷/;
    this.srcdoc = `<div style="font-family: sans-serif; position: absolute; right: 10px; bottom: 10px; font-weight: 600;">{VALUE}</div>`;
  }

  start() {
    this.events();
  }

  events() {
    this.parenthesesButton.addEventListener('click', () =>
      this.enterParentheses()
    );
    this.numberButtons.forEach((button) =>
      button.addEventListener('click', (ev) => this.enterNumber(ev))
    );
    this.symbolButtons.forEach((button) => {
      button.addEventListener('click', (ev) => this.enterSymbol(ev));
    });
    this.equalsButton.addEventListener('click', () => this.calculate());
    this.clearButton.addEventListener('click', () => this.clearScreen());
    this.leftButton.addEventListener('click', () => this.historyLeft());
    // this.rightButton.addEventListener('click', () => this.historyRight());
  }

  calculate() {
    if (this.value.length <= 1 || !this.value.match(this.operatorsRegex))
      return;

    this.result = eval(this.calculation);
    this.screen.srcdoc = this.srcdoc.replace(
      '{VALUE}',
      this.result.toLocaleString('pt')
    );
    this.value = String(this.result);
    this.calculation = String(this.result);
    this.result = null;
    this.history = [];
  }

  historyLeft() {
    if (!this.value) return;
    if (this.operators.includes(this.value[this.value.length - 1])) {
      this.operators.pop();
      if (!this.operators.length) {
        this.currentNumber = this.value.replace(',', '.');
      } else {
        const operator = this.operators.pop();
        this.currentNumber = this.value.slice(
          this.value.lastIndexOf(operator) + 1
        );
      }
    }
    this.history.push(this.value[this.value.length - 1]);
    this.value = this.removeLastCharacter(this.value);
    this.currentNumber = this.removeLastCharacter(this.currentNumber);
    this.calculation = this.removeLastCharacter(this.calculation);
    this.display(this.value);
  }

  // historyRight() {
  //   if (!this.history.length) return;
  //   const value = this.history.pop();
  //   this.value += value;
  //   this.calculation = value;
  //   this.display(this.value);
  // }

  clearScreen() {
    this.reset();
    this.display(this.value);
  }

  enterNumber(ev) {
    this.currentNumber += ev.target.value;

    this.value += ev.target.value;

    this.calculation += ev.target.value;

    if (
      this.value.length > 1 &&
      this.value.startsWith('0') &&
      !this.signals.includes(this.value[1])
    ) {
      this.value = this.value.slice(1);
      this.calculation = this.calculation.slice(1);
    }

    this.display(this.value);
  }

  enterSymbol(ev) {
    if (!this.value) return;
    if (ev.target.value === ',' && this.currentNumber.includes('.')) return;
    if (this.signals.includes(this.value[this.value.length - 1])) return;
    if (ev.target.value === ',') {
      this.currentNumber += ev.target.dataset.value;
    } else {
      this.operators.push(ev.target.value);
      this.currentNumber = '';
    }

    this.value += ev.target.value;

    if (ev.target.dataset.value) this.calculation += ev.target.dataset.value;
    else this.calculation += ev.target.value;

    this.display(this.value);
  }

  enterParentheses() {
    if (!this.value) {
      this.value += '(';
      this.calculation += '(';
      this.display(this.value);
      return;
    }
    if (this.value.includes('(') && !this.value.includes(')')) {
      this.value += ')';
      this.calculation += ')';
    } else {
      if (this.operatorsRegex.test(this.value[this.value.length - 1])) {
        this.value += '(';
        this.calculation += '(';
      } else {
        this.value += ')';
        this.calculation += ')';
      }
    }
    this.display(this.value);
  }

  removeLastCharacter(value) {
    return value.slice(0, -1);
  }

  reset() {
    this.value = '';
    this.currentNumber = '';
    this.calculation = '';
    this.result = null;
  }

  count(value, character) {
    const regex = new RegExp(character, 'g');
    return (value.match(regex) || []).length;
  }

  countOperators(value) {
    return this.count(value, this.operatorsRegex);
  }

  display(value) {
    this.screen.srcdoc = this.srcdoc.replace('{VALUE}', value);
  }
}

const calculator = new Calculator();
calculator.start();
