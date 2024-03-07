class TaskManager {
  constructor() {
    this.tasksContainer = document.querySelector('#tasks');
    this.addTaskButton = document.querySelector('#addBtn');
    this.cancelEditButton = document.querySelector('#cancelBtn');
    this.editTaskButton = document.querySelector('#editBtn');
    this.taskField = document.querySelector('#field');
    this.zeroTasks = document.querySelector('#zeroTasks');
    this.editButtons = []; // toggle visibility
    this.editMode = false;
    this.editId = null;
    this.editTask = null;
    this.event = null;
    this.value = '';
    this.tasks = this.getTasks() || [];
  }

  start() {
    this.generateLists();
    this.events();
  }

  events() {
    this.taskField.addEventListener('change', (ev) => this.handleChange(ev));
    this.cancelEditButton.addEventListener('click', (ev) =>
      this.cancelEdit(ev)
    );
    this.addTaskButton.addEventListener('click', () => this.addTask());
    this.editTaskButton.addEventListener('click', () => this.confirmEdit());
  }

  handleChange(ev) {
    this.value = ev.target.value;
    this.event = ev;
  }

  addTask() {
    if (!this.value || !this.value.trim()) return;

    const task = {
      id: Date.now(),
      task: this.value,
      completed: false,
    };

    this.setTask(task);
    this.zeroTasks.classList.add('none');

    const li = this.createLi(task);
    this.addToContainer(li);

    this.value = '';
    this.event.target.value = '';
  }

  confirmEdit() {
    if (!this.value || !this.value.trim()) return;
    if (this.value === this.editTask.task) {
      this.toggleButtons();
      this.reset();
      return;
    }
    this.editTask.task = this.value;
    this.tasks = this.tasks.map((task) => {
      return task.id === this.editTask.id ? { ...this.editTask } : task;
    });
    document.querySelector(`#taskContent${this.editId}`).textContent =
      this.value;
    this.update(this.tasks);
    this.toggleButtons();
    this.reset();
  }

  toggleEditMode(ev) {
    this.editMode = true;
    this.editId = ev.target.dataset.id;
    this.editTask = this.getTaskById(+this.editId);
    this.taskField.value = this.editTask ? this.editTask.task : 'Error';
    this.value = this.editTask.task || '';
    this.taskField.focus();

    this.toggleButtons();
  }

  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.taskField.value = '';

    this.toggleButtons();
  }

  createLi(task) {
    const li = document.createElement('li');
    const field = document.createElement('input');
    const div = document.createElement('div');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    li.setAttribute('data-id', task.id);
    li.classList.add('d-flex', 'gap-1', 'align-center');

    field.setAttribute('type', 'checkbox');
    field.addEventListener('change', (ev) => this.toggleComplete(ev));
    field.setAttribute('data-id', task.id);
    field.checked = task.completed;

    div.textContent = task.task;
    div.id = `taskContent${task.id}`;

    editButton.setAttribute('data-id', task.id);
    editButton.addEventListener('click', (ev) => this.toggleEditMode(ev));
    editButton.textContent = 'Edit';
    editButton.classList.add('right', 'btn', 'btn-sm', 'hover-blue');
    this.editButtons.push(editButton);

    deleteButton.setAttribute('data-id', task.id);
    deleteButton.textContent = 'Remove';
    deleteButton.classList.add(
      'right',
      'btn',
      'btn-sm',
      'hover-orange',
      `${!task.completed && 'none'}`
    );
    deleteButton.id = `deleteButton${task.id}`;
    deleteButton.addEventListener('click', (ev) => this.removeTask(ev));

    li.appendChild(field);
    li.appendChild(div);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  addToContainer(element) {
    this.tasksContainer.appendChild(element);
  }

  generateLists() {
    if (!this.tasks.length) {
      this.zeroTasks.classList.remove('none');
      return;
    }
    this.zeroTasks.classList.add('none');
    this.tasks.forEach((task) => {
      const li = this.createLi(task);
      this.addToContainer(li);
    });
  }

  toggleComplete(ev) {
    if (this.editMode) this.cancelEdit();
    const id = ev.target.dataset.id;
    const tasks = this.tasks.map((task) => {
      return task.id === +id
        ? { ...task, completed: !task.completed }
        : { ...task };
    });
    this.tasks = tasks;
    this.update(tasks);
    document.querySelector(`#deleteButton${id}`).classList.toggle('none');
  }

  removeTask(ev) {
    const taskId = +ev.target.dataset.id;
    const element = ev.target.parentElement;
    if (this.tasks.length > 1) element.classList.add('removal');
    this.tasks = this.tasks.filter((task) => {
      return task.id !== taskId;
    });
    this.update(this.tasks);
    setTimeout(() => {
      element.remove();
      if (!this.tasks.length) this.zeroTasks.classList.remove('none');
    }, 500);
  }

  setTask(task) {
    this.tasks.push(task);
    this.update(this.tasks);
  }

  getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || null;
    return tasks;
  }

  getTaskById(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) return null;
    return task;
  }

  update(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  toggleButtons() {
    this.addTaskButton.classList.toggle('none');
    this.cancelEditButton.classList.toggle('none');
    this.editTaskButton.classList.toggle('none');
    this.editButtons.forEach((button) => {
      button.classList.toggle('none');
    });
  }

  reset() {
    this.value = '';
    this.taskField.value = '';
    this.event = null;
    this.editId = null;
    this.editTask = null;
    this.editMode = false;
  }
}

const tasks = new TaskManager();
tasks.start();
