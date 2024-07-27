class Task {
  constructor(title = 'untitled', completed = false) {
    this.id = Date.now();
    this.title = title;
    this.completed = completed;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }
  setTitle(title) {
    this.title = title;
    return this;
  }

  getCompleted() {
    return this.completed;
  }
  setCompleted(completed) {
    this.completed = completed;
  }
}

class TaskStorage {
  constructor(key = 'tasks') {
    this.key = key;
  }

  store(task) {
    if (!this.isValidStorage(this.storage)) return;

    this.storage.setItem(this.key, task);
  }

  retrieve() {
    if (!this.isValidStorage(this.storage)) return;

    return this.storage.getItem(this.key);
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setupStorage(storage) {
    switch (storage) {
      case 'local':
        this.storage = localStorage;
        return this;
      case 'session':
        this.storage = sessionStorage;
        return this;
    }
  }

  isValidStorage(storage) {
    return storage && storage instanceof Storage;
  }
}

class HTMLHandler {
  select(element) {
    return document.querySelector(element);
  }
  selectAll(elements) {
    return document.querySelectorAll(elements);
  }

  addClass(element, className) {
    element.classList.add(className);
    return this;
  }
  removeClass(element, className) {
    element.classList.remove(className);
    return this;
  }
  toggleClass(element, className) {
    element.classList.toggle(className);
    return this;
  }

  create(element) {
    return document.createElement(element);
  }

  setup(element) {
    this.element = element;
    return this;
  }

  setEvent(eventType, fn) {
    if (!this.element) return;

    this.element.addEventListener(eventType, (ev) => fn(ev));
    return this;
  }

  setAttributes(attributes) {
    if (!this.element) return;

    Object.entries(attributes).forEach(([k, v]) => {
      this.element[k] = v;
    });

    return this;
  }
}

class TaskComponentHandler extends HTMLHandler {
  constructor() {
    super();
    this.taskField = this.select('#field');
    this.addTaskButton = this.select('#add-btn');
    this.editTaskButton = this.select('#edit-btn');
    this.cancelTaskEditButton = this.select('#cancel-btn');
    this.tasksContainer = this.select('#tasks');
    this.noTasksImageContainer = this.select('#image-container');
  }

  setupTaskFieldEvent(eventType, fn) {
    this.setup(this.taskField).setEvent(eventType, (ev) => fn(ev));
    return this;
  }

  setupAddTaskButtonEvent(eventType, fn) {
    this.setup(this.addTaskButton).setEvent(eventType, (ev) => fn(ev));
    return this;
  }

  setupCheckTaskEvent(eventType, fn) {
    const checkboxes = this.selectAll('.check');

    checkboxes.forEach((el) => {
      el.addEventListener(eventType, (ev) => fn(ev));
    });

    return this;
  }

  setupEditTaskModeEvent(eventType, fn) {
    const editButtons = this.selectAll('.edit-btns');

    editButtons.forEach((el) => {
      el.addEventListener(eventType, (ev) => fn(ev));
    });

    return this;
  }

  setupCancelEditTaskModeEvent(eventType, fn) {
    this.setup(this.cancelTaskEditButton).setEvent(eventType, (ev) => fn(ev));
    return this;
  }

  setupEditTaskEvent(eventType, fn) {
    this.setup(this.editTaskButton).setEvent(eventType, (ev) => fn(ev));
    return this;
  }

  setupDeleteTaskEvent(eventType, fn) {
    const deleteButtons = this.selectAll('.delete-btns');

    deleteButtons.forEach((el) => {
      el.addEventListener(eventType, (ev) => fn(ev));
    });

    return this;
  }

  focusOnTaskField() {
    this.taskField.focus();
    return this;
  }

  getValueFromTaskField() {
    return this.taskField.value;
  }

  setValueForTaskField(value) {
    this.taskField.value = value;
    return this;
  }

  toggleVisibleComponentsEditMode() {
    this.toggleClassForComponents(
      [
        'addTaskButton',
        'editTaskButton',
        'cancelTaskEditButton',
        '.edit-btns',
        '.delete-btns',
      ],
      'none'
    );
    return this;
  }

  toggleVisibilityNoTasksImageContainer(visibility) {
    if (visibility === 'none') {
      this.addClass(this.noTasksImageContainer, 'none');
      return this;
    }
    this.removeClass(this.noTasksImageContainer, 'none');
    return this;
  }

  createComponentAndSetAttributes(component, attributes) {
    const HTMLComponent = this.create(component);
    this.setup(HTMLComponent).setAttributes(attributes);

    return HTMLComponent;
  }

  buildLiForTask() {
    return this.createComponentAndSetAttributes('li', {
      className: 'd-flex space-between task-li',
    });
  }

  buildCheckboxForTask(task) {
    return this.createComponentAndSetAttributes('input', {
      type: 'checkbox',
      className: 'check',
      checked: task.completed,
      id: task.id,
    });
  }

  buildLabelForTask(task) {
    return this.createComponentAndSetAttributes('label', {
      textContent: task.title,
      className: 'd-flex gap-1 align-center flex-reverse',
    });
  }

  buildDivForTask() {
    return this.createComponentAndSetAttributes('div', {
      className: 'd-flex gap-1',
    });
  }

  buildEditButtonForTask(task) {
    return this.createComponentAndSetAttributes('button', {
      className: 'edit-btns btn-sm',
      id: task.id,
    });
  }

  buildDeleteButtonForTask(task) {
    return this.createComponentAndSetAttributes('button', {
      className: 'delete-btns btn-sm',

      id: task.id,
    });
  }

  buildEditIconForTask(task) {
    return this.createComponentAndSetAttributes('i', {
      className: 'fas fa-edit edit-btns',
      id: task.id,
    });
  }

  buildDeleteIconForTask(task) {
    return this.createComponentAndSetAttributes('i', {
      className: 'fas fa-remove',
      id: task.id,
    });
  }

  buildComponentForTask(task) {
    const li = this.buildLiForTask();
    const checkbox = this.buildCheckboxForTask(task);
    const label = this.buildLabelForTask(task);
    const div = this.buildDivForTask();
    const editButton = this.buildEditButtonForTask(task);
    const deleteButton = this.buildDeleteButtonForTask(task);

    const editIcon = this.buildEditIconForTask(task);
    const deleteIcon = this.buildDeleteIconForTask(task);

    label.appendChild(checkbox);

    div.appendChild(editButton);
    div.appendChild(deleteButton);

    li.appendChild(label);
    li.appendChild(div);

    editButton.appendChild(editIcon);
    deleteButton.appendChild(deleteIcon);

    this.tasksContainer.appendChild(li);
  }

  toggleClassForComponents(components, className) {
    components.forEach((component) => {
      if (this[component]) {
        this.toggleClass(this[component], className);
      } else {
        this.toggleSelectedComponentsClass(component, className);
      }
    });
  }

  toggleSelectedComponentsClass(component, className) {
    const selectedComponents = this.selectAll(component);

    if (selectedComponents.length) {
      selectedComponents.forEach((selectedComponent) => {
        this.toggleClass(selectedComponent, className);
      });
    }
  }

  clearTasksContainer() {
    this.tasksContainer.innerHTML = '';
    return this;
  }

  clearTaskField() {
    this.taskField.value = '';
    return this;
  }
}

class TaskApp {
  constructor(
    taskComponentHandler = new TaskComponentHandler(),
    taskStorage = new TaskStorage()
  ) {
    this.taskComponentHandler = taskComponentHandler;
    this.taskStorage = taskStorage;
  }

  start() {
    this.taskComponentHandler.focusOnTaskField();

    this.events();

    this.fetchAndBuildTasks();
  }

  events() {
    this.taskComponentHandler
      .setupTaskFieldEvent('change', (ev) => this.getValueFromTaskField(ev))
      .setupAddTaskButtonEvent('click', () => this.createTask())
      .setupCancelEditTaskModeEvent('click', (ev) =>
        this.cancelEditTaskModeEvent(ev)
      )
      .setupEditTaskEvent('click', (ev) => this.editTaskEvent(ev));
  }

  setupGeneratedTaskComponentEvents() {
    this.taskComponentHandler
      .setupCheckTaskEvent('change', (ev) => this.toggleCompleted(ev))
      .setupDeleteTaskEvent('click', (ev) => this.deleteTask(ev))
      .setupEditTaskModeEvent('click', (ev) => this.editTaskModeEvent(ev));
  }

  fetchAndBuildTasks() {
    this.taskComponentHandler.clearTasksContainer();

    const tasksCollection = this.getTasks();

    if (!tasksCollection.length) {
      this.taskComponentHandler.toggleVisibilityNoTasksImageContainer();
      return;
    }

    tasksCollection.map((task) => {
      this.taskComponentHandler.buildComponentForTask(task);
    });

    this.setupGeneratedTaskComponentEvents();
    this.taskComponentHandler.toggleVisibilityNoTasksImageContainer('none');
  }

  getValueFromTaskField(ev) {
    this.title = ev.target.value;
  }

  createTask() {
    if (!this.isValidTitle()) return;

    const newTask = new Task(this.title);

    this.storeTask(newTask);

    this.clearTaskFieldAndTitle();

    this.taskComponentHandler.focusOnTaskField();

    this.fetchAndBuildTasks();
  }

  storeTask(task) {
    const tasksCollection = this.getTasks();

    tasksCollection.push(task);

    this.storeTasks(tasksCollection);
  }

  storeTasks(tasks) {
    this.taskStorage.store(this.encodeJSON(tasks));
  }

  getTasks() {
    return this.decodeJSON(this.taskStorage.retrieve()) || [];
  }

  getTaskById(id) {
    const tasksCollection = this.getTasks();

    const taskResource = tasksCollection.find((task) => {
      return task.id === id;
    });

    return taskResource;
  }

  updateTask(taskResource) {
    const tasksCollection = this.getTasks();

    const updatedTasks = tasksCollection.map((task) => {
      return taskResource.id === task.id ? { ...taskResource } : { ...task };
    });

    this.storeTasks(updatedTasks);
  }

  toggleCompleted(ev) {
    const taskId = +ev.target.id;

    const task = this.getTaskById(taskId);

    task.completed = !task.completed;

    this.updateTask(task);
  }

  editTaskEvent() {
    const valueFromTaskField =
      this.taskComponentHandler.getValueFromTaskField();

    if (!valueFromTaskField.trim()) return;

    const task = this.getTaskById(this.taskToEditId);
    task.title = valueFromTaskField;

    this.updateTask(task);

    this.clearTaskFieldAndTitle();

    this.cancelEditTaskModeEvent();

    this.fetchAndBuildTasks();
  }

  deleteTask(ev) {
    const taskId = +ev.target.id;

    const tasksCollection = this.getTasks();

    const updatedTasks = tasksCollection.filter((task) => {
      return task.id !== taskId;
    });

    this.storeTasks(updatedTasks);

    this.fetchAndBuildTasks();
  }

  editTaskModeEvent(ev) {
    ev.stopPropagation();

    this.taskToEditId = +ev.target.id;
    const task = this.getTaskById(this.taskToEditId);

    this.taskComponentHandler
      .setValueForTaskField(task.title)
      .focusOnTaskField()
      .toggleVisibleComponentsEditMode();
  }

  cancelEditTaskModeEvent() {
    this.taskComponentHandler
      .toggleVisibleComponentsEditMode()
      .clearTaskField();
  }

  clearTaskFieldAndTitle() {
    this.title = '';
    this.taskComponentHandler.clearTaskField();
  }

  isTasksCollectionEmpty() {
    return !this.getTasks().length;
  }

  isValidTitle() {
    return this.title && this.title.trim();
  }

  encodeJSON(tasks) {
    return JSON.stringify(tasks);
  }

  decodeJSON(tasks) {
    return JSON.parse(tasks);
  }
}

const taskStorageLocal = new TaskStorage().setupStorage('local');

new TaskApp(new TaskComponentHandler(), taskStorageLocal).start();
