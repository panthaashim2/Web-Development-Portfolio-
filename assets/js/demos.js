/*
 * Demo logic for individual ePortfolio pages
 *
 * Each function is namespaced under window.demos and is invoked from the
 * corresponding HTML page.  The demos encapsulate all interactive
 * behaviour so the markup remains clean and semantic.
 */

window.demos = {};

/**
 * Full stack development demonstration
 *
 * Simulates a client sending a message to a server for validation and then
 * storing it in a “database”.  A timeline shows each step and a table
 * displays all stored records.  Messages are kept in memory only.
 */
window.demos.fullStackDemo = function fullStackDemo() {
  const form = document.getElementById('fs-form');
  const msgInput = document.getElementById('fs-message');
  const typeSelect = document.getElementById('fs-type');
  const logList = document.getElementById('fs-log');
  const tableBody = document.getElementById('fs-table-body');
  const clearBtn = document.getElementById('fs-clear');
  let db = [];
  let nextId = 1;

  function log(step) {
    const li = document.createElement('li');
    li.textContent = step;
    logList.appendChild(li);
    // Keep the newest entry visible
    logList.scrollTop = logList.scrollHeight;
  }

  function renderTable() {
    tableBody.innerHTML = '';
    db.forEach(record => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${record.id}</td><td>${record.message}</td><td>${record.type}</td><td>${record.timestamp}</td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInput.value.trim();
    const type = typeSelect.value;
    log(`Client: sending message "${message}" of type "${type}" to server…`);
    // Validate
    if (!message) {
      log('Server: validation failed – message cannot be empty.');
      announce('Message cannot be empty', 'assertive');
      return;
    }
    if (message.length < 3) {
      log('Server: validation failed – message is too short (minimum 3 characters).');
      announce('Message too short', 'assertive');
      return;
    }
    if (/[<>]/.test(message)) {
      log('Server: validation failed – message contains forbidden characters < or >.');
      announce('Forbidden characters detected', 'assertive');
      return;
    }
    // Passes validation
    log('Server: validation succeeded. Storing in database…');
    const record = {
      id: nextId++,
      message,
      type,
      timestamp: new Date().toLocaleString()
    };
    db.push(record);
    renderTable();
    log(`Database: stored message #${record.id}.`);
    announce('Message saved', 'polite');
    // Reset form
    msgInput.value = '';
    typeSelect.selectedIndex = 0;
    msgInput.focus();
  });

  clearBtn.addEventListener('click', () => {
    db = [];
    nextId = 1;
    renderTable();
    log('Database cleared.');
    announce('Database cleared', 'polite');
  });
};

/**
 * CSS demonstration
 *
 * Provides controls to toggle the site between light and dark themes, switch
 * the layout of a set of cards between grid and flexbox, and enable or
 * disable a simple animation.  Status messages are announced for
 * accessibility.
 */
window.demos.cssDemo = function cssDemo() {
  const themeBtn = document.getElementById('theme-toggle');
  const layoutBtn = document.getElementById('layout-toggle');
  const animBtn = document.getElementById('animation-toggle');
  const layoutContainer = document.getElementById('layout-demo');
  const items = layoutContainer.querySelectorAll('.layout-item');
  let darkMode = false;
  let flexLayout = false;
  let animationOn = false;

  themeBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
    themeBtn.textContent = darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme';
    announce(darkMode ? 'Dark theme enabled' : 'Light theme enabled', 'polite');
  });

  layoutBtn.addEventListener('click', () => {
    flexLayout = !flexLayout;
    if (flexLayout) {
      layoutContainer.style.display = 'flex';
      layoutContainer.style.flexWrap = 'wrap';
      layoutContainer.style.gap = '1rem';
    } else {
      layoutContainer.style.display = '';
      layoutContainer.style.flexWrap = '';
      layoutContainer.style.gap = '';
    }
    layoutBtn.textContent = flexLayout ? 'Switch to Grid Layout' : 'Switch to Flex Layout';
    announce(flexLayout ? 'Flex layout enabled' : 'Grid layout enabled', 'polite');
  });

  animBtn.addEventListener('click', () => {
    animationOn = !animationOn;
    items.forEach(item => {
      item.classList.toggle('animate', animationOn);
    });
    animBtn.textContent = animationOn ? 'Disable Animation' : 'Enable Animation';
    announce(animationOn ? 'Animation enabled' : 'Animation disabled', 'polite');
  });
};

/**
 * Bootstrap form validation demo
 *
 * When the validate button is clicked the form gains the `was-validated`
 * class so Bootstrap will display valid/invalid feedback styles.
 */
window.demos.bootstrapDemo = function bootstrapDemo() {
  const form = document.getElementById('bs-form');
  const validateBtn = document.getElementById('bs-validate');
  validateBtn.addEventListener('click', () => {
    form.classList.add('was-validated');
    announce('Form validation applied', 'polite');
  });
};

/**
 * JavaScript to‑do list demo
 *
 * Builds an accessible to‑do application with the ability to add tasks,
 * mark them complete, delete them and filter by status.  Tasks are
 * persisted to localStorage so they survive page reloads.
 */
window.demos.jsTodoApp = function jsTodoApp() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const filterButtons = {
    all: document.getElementById('filter-all'),
    active: document.getElementById('filter-active'),
    completed: document.getElementById('filter-completed')
  };
  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');
  const emptyState = document.getElementById('todo-empty');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let filter = 'all';

  function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function render() {
    // Filter tasks
    let filtered = tasks;
    if (filter === 'active') {
      filtered = tasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    }
    // Update counts
    countAll.textContent = tasks.length;
    countActive.textContent = tasks.filter(t => !t.completed).length;
    countCompleted.textContent = tasks.filter(t => t.completed).length;
    // Render list
    list.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.classList.remove('visually-hidden');
    } else {
      emptyState.classList.add('visually-hidden');
      filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item d-flex align-items-center justify-content-between';
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.checked = task.completed;
        checkbox.id = 'task-' + index;
        checkbox.addEventListener('change', () => {
          tasks[index].completed = checkbox.checked;
          save();
          render();
          announce(checkbox.checked ? 'Task completed' : 'Task marked active', 'polite');
        });
        // Label for text
        const label = document.createElement('label');
        label.setAttribute('for', 'task-' + index);
        label.textContent = task.text;
        if (task.completed) {
          label.style.textDecoration = 'line-through';
        }
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-link text-danger p-0 ms-2';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
          tasks.splice(index, 1);
          save();
          render();
          announce('Task deleted', 'assertive');
        });
        // Build list item
        const left = document.createElement('div');
        left.className = 'd-flex align-items-center';
        left.appendChild(checkbox);
        left.appendChild(label);
        const right = document.createElement('div');
        right.appendChild(deleteBtn);
        li.appendChild(left);
        li.appendChild(right);
        list.appendChild(li);
      });
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      save();
      render();
      input.value = '';
      input.focus();
      announce('Task added', 'polite');
    }
  });

  // Filter button events
  Object.keys(filterButtons).forEach(key => {
    filterButtons[key].addEventListener('click', () => {
      filter = key;
      // Highlight active button
      Object.values(filterButtons).forEach(btn => btn.classList.remove('active'));
      filterButtons[key].classList.add('active');
      render();
      announce('Showing ' + key + ' tasks', 'polite');
    });
  });

  // Initial render
  render();
};