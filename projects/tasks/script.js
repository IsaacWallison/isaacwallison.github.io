(() => {
  const tasksComponent = document.querySelector('#tasks-component');
  const addTaskButton = document.querySelector('#task-add');
  const cancelEditButton = document.querySelector('#cancel-edit');
  const confirmEditButton = document.querySelector('#confirm-edit');
  const tasksContainer = document.querySelector('#tasks-container');

  const state = {
    tasks: [],
    taskToEdit: null,
  };

  const taskField = {
    component: document.querySelector('#task-field'),
    getValue() {
      return this.component.value;
    },
    setValue(value) {
      this.component.value = value;
    },
    focus() {
      this.component.focus();
    },
    isEmpty() {
      return !this.getValue().trim();
    },
  };

  const taskRepository = {
    getTask(taskId) {
      const tasks = this.getTasks();
      const taskFound = tasks.find((task) => {
        return task.id === taskId;
      });

      return taskFound;
    },
    getTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    },
    setTask(task) {
      const tasks = this.getTasks();
      tasks.push(task);

      this.setTasks(tasks);
      return tasks;
    },
    setTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
  };

  function init() {
    renderTasks();
    setListener();

    taskField.focus();
  }

  function handleEvents(e) {
    if (e.target.classList.contains('button-icon')) {
      e.target.closest('button').click();
    }
    const event = e.target.dataset.event;
    const taskId = +e.target.dataset.id;

    switch (event) {
      case 'add':
        createTask();
        return;
      case 'toggleCompleted':
        toggleCompleted(taskId);
        return;
      case 'editMode':
        startEditMode(taskId);
        return;
      case 'cancelEdit':
        cancelEditMode();
        return;
      case 'confirmEdit':
        confirmEdit();
        return;
      case 'delete':
        deleteTask(taskId);
        return;
      case 'completeTasks':
        completeTasks();
        return;
      case 'deleteTasks':
        deleteTasks();
        return;
    }
  }

  function setListener() {
    tasksComponent.addEventListener('click', handleEvents);
  }

  function createTask() {
    if (taskField.isEmpty()) return;

    const task = {
      id: Date.now(),
      title: taskField.getValue(),
      completed: false,
    };

    taskField.setValue('');
    taskField.focus();

    taskRepository.setTask(task);

    buildListComponent(task);
  }

  function deleteTask(taskId) {
    const tasks = taskRepository.getTasks();
    const updatedTasks = tasks.filter((task) => {
      return task.id !== taskId;
    });

    taskRepository.setTasks(updatedTasks);

    renderTasks(updatedTasks);
  }

  function deleteTasks() {
    taskRepository.setTasks([]);

    renderTasks([]);
  }

  function confirmEdit() {
    if (taskField.isEmpty()) return;

    const taskId = state.taskToEdit.id;
    const tasks = taskRepository.getTasks();
    const value = taskField.getValue();
    const updatedTasks = tasks.map((task) => {
      return task.id === taskId ? { ...task, title: value } : task;
    });

    state.taskToEdit = null;

    taskField.setValue('');

    taskRepository.setTasks(updatedTasks);

    renderTasks(updatedTasks);

    toggleEditModeButtonsVisible();
    setEditModeButtonsDisabled(false);
  }

  function startEditMode(taskId) {
    state.taskToEdit = taskRepository.getTask(taskId);
    taskField.setValue(state.taskToEdit.title);

    taskField.focus();

    toggleEditModeButtonsVisible();
    setEditModeButtonsDisabled(true);
  }

  function cancelEditMode() {
    state.taskToEdit = null;
    taskField.setValue('');

    toggleEditModeButtonsVisible();
    setEditModeButtonsDisabled(false);
  }

  function toggleEditModeButtonsVisible() {
    [addTaskButton, cancelEditButton, confirmEditButton].forEach((button) =>
      button.classList.toggle('none')
    );
  }

  function setEditModeButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('.btn-disable');
    buttons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function toggleCompleted(taskId) {
    const tasks = taskRepository.getTasks();
    const updatedTasks = tasks.map((task) => {
      return task.id === taskId
        ? { ...task, completed: !task.completed }
        : task;
    });

    taskRepository.setTasks(updatedTasks);
  }

  function completeTasks() {
    const tasks = taskRepository.getTasks();
    const updatedTasks = tasks.map((task) => {
      task.completed = true;
      return task;
    });

    taskRepository.setTasks(updatedTasks);
    renderTasks(updatedTasks);
  }

  function renderTasks(tasks) {
    tasksContainer.innerHTML = '';

    const tasksOrFetch = tasks || taskRepository.getTasks();

    tasksOrFetch.forEach(buildListComponent);
  }

  function buildListComponent(task) {
    tasksContainer.insertAdjacentHTML(
      'beforeend',
      `
      <li class="list-item flex">
        <label class="d-flex gap-1 align-center f-w">
          <input type="checkbox" data-event="toggleCompleted" data-id="${
            task.id
          }" ${task.completed && 'checked'}/>
          <span>${task.title}</span>
        </label>

        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-disable" data-event="editMode" data-id="${
            task.id
          }">
            <i class="fas fa-edit button-icon"></i>
          </button>
          <button class="btn btn-sm btn-disable" data-event="delete" data-id="${
            task.id
          }">
            <i class="fas fa-close button-icon"></i>
          </button>
        </div>
      </li>
      `
    );
  }

  init();
})();
