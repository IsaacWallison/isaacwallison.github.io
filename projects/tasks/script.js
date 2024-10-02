(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
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
const l = (e) => document.querySelector(e),
  g = (e) => document.querySelectorAll(e),
  d = {
    element: l('#task-title'),
    getValue() {
      return this.element.value;
    },
    setValue(e) {
      this.element.value = e;
    },
  },
  u = (e, t) => {
    g(e).forEach((n) => {
      const a = n;
      a.disabled = t;
    });
  };
var i = ((e) => (
  (e.All = 'all'), (e.Complete = 'complete'), (e.Incomplete = 'incomplete'), e
))(i || {});
const o = { taskToBeEdited: null, isRemovingTask: !1, searchedTasks: 'all' },
  k = () => {
    d.setValue(''),
      (o.taskToBeEdited = null),
      l("button[data-event='add-task']").classList.remove('none'),
      l('#edit-buttons').classList.add('none'),
      u("button[data-event='edit-mode']", !1),
      u("button[data-event='delete-task']", !1);
  },
  c = {
    getTask(e) {
      return this.getAll().find((a) => a.id === e);
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
        case i.All:
          return this.getAll();
        case i.Complete:
          return this.getCompleted();
        case i.Incomplete:
          return this.getIncompleted();
        default:
          return this.getAll();
      }
    },
    setTask(e) {
      const t = this.getAll();
      t.push(e), this.setTasks(t);
    },
    setTasks(e) {
      localStorage.setItem('tasks', JSON.stringify(e));
    },
    updateTitle(e, t) {
      const a = this.getAll().map((s) => (s.id === e && (s.title = t), s));
      this.setTasks(a);
    },
    toggleComplete(e) {
      const n = this.getAll().map(
        (a) => (a.id === e && (a.completed = !a.completed), a)
      );
      this.setTasks(n);
    },
  },
  p = (e) => `
    <li class="task flex">
      <label class="flex stretch align-center">
        <input type="checkbox" data-event="toggle-complete" data-id="${e.id}" ${
    e.completed && 'checked'
  }/>
        <span>${e.title}</span> 
      </label>

      <div class="flex">
        <button class="btn fas fa-edit" data-id="${
          e.id
        }" data-event="edit-mode"></button>
        <button class="btn fas fa-close" data-id="${
          e.id
        }" data-event="delete-task"></button>
      </div>
    </li>
`,
  T = () => {
    g('button[data-search]').forEach((e) =>
      e.classList.remove('btn--selected')
    ),
      l(`button[data-search="${o.searchedTasks}"]`).classList.add(
        'btn--selected'
      );
  },
  m = (e) => {
    const t = l('#no-tasks');
    t.classList.add('none'), e.length || t.classList.remove('none');
    const n = l('#tasks');
    (n.innerHTML = ''),
      e.forEach((a) => {
        n.insertAdjacentHTML('beforeend', p(a));
      }),
      T();
  },
  h = () => {
    const e = d.getValue();
    e.trim() &&
      o.taskToBeEdited &&
      (c.updateTitle(o.taskToBeEdited.id, e), k(), m(c.getAll()));
  },
  v = (e) => {
    u('button[data-search]', !1),
      (o.searchedTasks === i.All || o.searchedTasks === i.Incomplete) &&
        (l('#tasks').insertAdjacentHTML('beforeend', p(e)),
        l('#no-tasks').classList.add('none')),
      T();
  },
  b = () => {
    const e = d.getValue();
    if (!e.trim()) return;
    const t = { id: Date.now(), title: e, completed: !1 };
    d.setValue(''), c.setTask(t), v(t);
  },
  L = (e) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.dataset.event) return;
      switch (e.target.dataset.event) {
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
            e.target.dataset.search === 'all' && (o.searchedTasks = i.All),
            e.target.dataset.search === 'complete' &&
              (o.searchedTasks = i.Complete),
            e.target.dataset.search === 'incomplete' &&
              (o.searchedTasks = i.Incomplete),
            m(c.getTasks());
          return;
      }
    }
  },
  A = (e) => {
    if (o.isRemovingTask) return;
    const n = c.getAll().filter((a) => a.id !== e);
    c.setTasks(n),
      l(`button[data-id="${e}"]`)
        .closest('li')
        .classList.add('remove-animation'),
      (o.isRemovingTask = !0),
      setTimeout(() => {
        m(c.getTasks()), (o.isRemovingTask = !1);
      }, 1e3);
  },
  E = (e) => {
    const t = c.getTask(e);
    t &&
      (d.setValue(t.title),
      d.element.focus(),
      (o.taskToBeEdited = t),
      l("button[data-event='add-task']").classList.add('none'),
      l('#edit-buttons').classList.remove('none'),
      u("button[data-event='edit-mode']", !0),
      u("button[data-event='delete-task']", !0));
  },
  y = (e) => {
    c.toggleComplete(e), m(c.getTasks());
  },
  I = (e) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.dataset.event || !e.target.dataset.id) return;
      switch (e.target.dataset.event) {
        case 'delete-task':
          A(+e.target.dataset.id);
          return;
        case 'edit-mode':
          E(+e.target.dataset.id);
          return;
        case 'toggle-complete':
          y(+e.target.dataset.id);
          return;
      }
    }
  };
window.onload = () => {
  const e = c.getTasks();
  m(e);
};
l('#task-form').addEventListener('click', L);
l('#tasks').addEventListener('click', I);
