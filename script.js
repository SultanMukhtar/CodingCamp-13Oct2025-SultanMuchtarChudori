const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const shortcutBtn = document.getElementById("shortcutBtn");
const popup = document.getElementById("shortcutPopup");
const closePopup = document.getElementById("closePopup");

let tasks = [];

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
  progressPercent.textContent = progress + "%";
}

function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value;
  const search = searchInput.value.toLowerCase();

  tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter(task => task.name.toLowerCase().includes(search))
    .forEach((task, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.date}</td>
        <td class="status">${task.completed ? "Completed" : "Pending"}</td>
        <td>
          <button class="action retask" onclick="retask(${index})">↻</button>
          <button class="action complete" onclick="completeTask(${index})">✔</button>
          <button class="action delete" onclick="deleteTask(${index})">🗑</button>
        </td>
      `;
      taskList.appendChild(row);
    });

  updateStats();
}

function addTask() {
  const name = taskInput.value.trim();
  const date = dueDate.value;

  if (!name || !date) return alert("Please enter task name and due date!");
  tasks.push({ name, date, completed: false });
  taskInput.value = "";
  dueDate.value = "";
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function completeTask(index) {
  tasks[index].completed = true;
  renderTasks();
}

function retask(index) {
  tasks[index].completed = false;
  renderTasks();
}

function deleteAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

deleteAllBtn.addEventListener("click", deleteAll);
addTaskBtn.addEventListener("click", addTask);
filterSelect.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);

// Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "n") taskInput.focus();
  if (e.ctrlKey && e.key === "f") searchInput.focus();
  if (e.ctrlKey && e.key === "a") {
    filterSelect.value = "all";
    renderTasks();
  }
  if (e.key === "Escape") {
    taskInput.value = "";
    searchInput.value = "";
  }
  if (e.key === "Enter" && document.activeElement === taskInput) addTask();
});

// Popup
shortcutBtn.addEventListener("click", () => popup.style.display = "flex");
closePopup.addEventListener("click", () => popup.style.display = "none");

renderTasks();
