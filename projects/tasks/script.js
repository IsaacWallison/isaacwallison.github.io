(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) a(s);
  new MutationObserver((s) => {
    for (const r of s)
      if (r.type === 'childList')
        for (const f of r.addedNodes)
          f.tagName === 'LINK' && f.rel === 'modulepreload' && a(f);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const r = {};
    return (
      s.integrity && (r.integrity = s.integrity),
      s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (r.credentials = 'include')
        : s.crossOrigin === 'anonymous'
        ? (r.credentials = 'omit')
        : (r.credentials = 'same-origin'),
      r
    );
  }
  function a(s) {
    if (s.ep) return;
    s.ep = !0;
    const r = n(s);
    fetch(s.href, r);
  }
})();
function l(t) {
  return document.querySelector(t);
}
function g(t) {
  return document.querySelectorAll(t);
}
const d = {
    element: l('#task-title'),
    getValue() {
      return this.element.value;
    },
    setValue(t) {
      this.element.value = t;
    },
    focus() {
      this.element.focus();
    },
    isEmpty() {
      return !this.getValue().trim().length;
    },
  },
  u = (t, e) => {
    g(t).forEach((n) => {
      const a = n;
      a.disabled = e;
    });
  };
var c = ((t) => (
  (t.All = 'all'), (t.Complete = 'complete'), (t.Incomplete = 'incomplete'), t
))(c || {});
const o = { taskToBeEdited: null, isRemovingTask: !1, searchedTasks: 'all' },
  k = () => {
    d.setValue(''),
      (o.taskToBeEdited = null),
      l("button[data-event='add-task']").classList.remove('none'),
      l('#edit-buttons').classList.add('none'),
      u("button[data-event='edit-mode']", !1),
      u("button[data-event='delete-task']", !1);
  },
  i = {
    getTask(t) {
      return this.getAll().find((a) => a.id === t);
    },
    getAll() {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    },
    getCompleted() {
      return this.getAll().filter((n) => n.completed);
    },
    getIncompleted() {
      return this.getAll().filter((n) => !n.completed);
    },
    getTasks() {
      switch (o.searchedTasks) {
        case c.All:
          return this.getAll();
        case c.Complete:
          return this.getCompleted();
        case c.Incomplete:
          return this.getIncompleted();
        default:
          return this.getAll();
      }
    },
    setTask(t) {
      const e = this.getAll();
      e.push(t), this.setTasks(e);
    },
    setTasks(t) {
      localStorage.setItem('tasks', JSON.stringify(t));
    },
    updateTitle(t, e) {
      const a = this.getAll().map((s) => (s.id === t && (s.title = e), s));
      this.setTasks(a);
    },
    toggleComplete(t) {
      const n = this.getAll().map(
        (a) => (a.id === t && (a.completed = !a.completed), a)
      );
      this.setTasks(n);
    },
  },
  p = (t) => `
    <li class="task flex">
      <label class="flex stretch align-center">
        <input type="checkbox" data-event="toggle-complete" data-id="${t.id}" ${
    t.completed && 'checked'
  }/>
        <span>${t.title}</span> 
      </label>

      <div class="flex">
        <button class="btn fas fa-edit" data-id="${
          t.id
        }" data-event="edit-mode"></button>
        <button class="btn fas fa-close" data-id="${
          t.id
        }" data-event="delete-task"></button>
      </div>
    </li>
`,
  T = () => {
    g('button[data-search]').forEach((t) =>
      t.classList.remove('btn--selected')
    ),
      l(`button[data-search="${o.searchedTasks}"]`).classList.add(
        'btn--selected'
      );
  },
  m = (t) => {
    const e = l('#no-tasks');
    e.classList.add('none'), t.length || e.classList.remove('none');
    const n = l('#tasks');
    (n.innerHTML = ''),
      t.forEach((a) => {
        n.insertAdjacentHTML('beforeend', p(a));
      }),
      T();
  },
  h = () => {
    const t = d.getValue();
    t.trim() &&
      o.taskToBeEdited &&
      (i.updateTitle(o.taskToBeEdited.id, t), k(), m(i.getAll()));
  },
  v = (t) => {
    u('button[data-search]', !1),
      (o.searchedTasks === c.All || o.searchedTasks === c.Incomplete) &&
        (l('#tasks').insertAdjacentHTML('beforeend', p(t)),
        l('#no-tasks').classList.add('none')),
      T();
  },
  b = () => {
    if (d.isEmpty()) return;
    const t = d.getValue(),
      e = { id: Date.now(), title: t, completed: !1 };
    d.setValue(''), d.focus(), i.setTask(e), v(e);
  },
  L = (t) => {
    if (t.target instanceof HTMLElement) {
      if (!t.target.dataset.event) return;
      switch (t.target.dataset.event) {
        case 'add-task':
          b();
          return;
        case 'cancel-edit':
          k();
          return;
        case 'confirm-edit':
          h();
          return;
        case 'list-all':
        case 'list-complete':
        case 'list-incomplete':
          k(),
            t.target.dataset.search === 'all' && (o.searchedTasks = c.All),
            t.target.dataset.search === 'complete' &&
              (o.searchedTasks = c.Complete),
            t.target.dataset.search === 'incomplete' &&
              (o.searchedTasks = c.Incomplete),
            m(i.getTasks());
          return;
      }
    }
  },
  A = (t) => {
    if (o.isRemovingTask) return;
    const n = i.getAll().filter((a) => a.id !== t);
    i.setTasks(n),
      l(`button[data-id="${t}"]`)
        .closest('li')
        .classList.add('remove-animation'),
      (o.isRemovingTask = !0),
      setTimeout(() => {
        m(i.getTasks()), (o.isRemovingTask = !1);
      }, 1e3);
  },
  E = (t) => {
    const e = i.getTask(t);
    e &&
      (d.setValue(e.title),
      d.element.focus(),
      (o.taskToBeEdited = e),
      l("button[data-event='add-task']").classList.add('none'),
      l('#edit-buttons').classList.remove('none'),
      u("button[data-event='edit-mode']", !0),
      u("button[data-event='delete-task']", !0));
  },
  y = (t) => {
    i.toggleComplete(t), m(i.getTasks());
  },
  I = (t) => {
    if (t.target instanceof HTMLElement) {
      if (!t.target.dataset.event || !t.target.dataset.id) return;
      switch (t.target.dataset.event) {
        case 'delete-task':
          A(+t.target.dataset.id);
          return;
        case 'edit-mode':
          E(+t.target.dataset.id);
          return;
        case 'toggle-complete':
          y(+t.target.dataset.id);
          return;
      }
    }
  },
  O = l('#task-title');
window.onload = () => {
  const t = i.getTasks();
  O.focus(), m(t);
};
l('#task-form').addEventListener('click', L);
l('#tasks').addEventListener('click', I);
