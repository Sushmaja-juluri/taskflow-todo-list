
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const themeToggle = document.getElementById("themeToggle");
const emptyState = document.getElementById("emptyState");

const TASKS_KEY = "todoListTasks";
const THEME_KEY = "todoListTheme";

let tasks = [];
let editingTaskId = null;

// Get today's date in local YYYY-MM-DD format.
function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Generate a unique task ID.
function createId() {
    if (typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Load existing tasks, including tasks from the previous version.
function loadTasks() {
    try {
        const saved = localStorage.getItem(TASKS_KEY);

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            )
            .map(task => ({
                id: typeof task.id === "string"
                    ? task.id
                    : createId(),

                text: task.text.slice(0, 200),

                completed: task.completed,

                // Existing tasks without a priority default to Medium.
                priority: ["High", "Medium", "Low"].includes(task.priority)
                    ? task.priority
                    : "Medium",

                // Older tasks may not have a due date.
                dueDate: typeof task.dueDate === "string" &&
                    /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)
                    ? task.dueDate
                    : ""
            }));
    } catch (error) {
        console.error("Unable to load tasks:", error);
        message.textContent =
            "Saved tasks could not be read. Check the browser console.";
        return [];
    }
}

// Save tasks to LocalStorage.
function saveTasks() {
    try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Unable to save tasks:", error);
        message.textContent =
            "Could not save changes. Browser storage may be unavailable or full.";
        return false;
    }
}

// Determine whether an unfinished task is overdue.
function isOverdue(task) {
    return Boolean(
        !task.completed &&
        task.dueDate &&
        task.dueDate < getToday()
    );
}

// Format a date without a timezone shift.
function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

// Create a task element safely.
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
        li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priority = document.createElement("span");
    priority.className =
        `priority-badge priority-${task.priority.toLowerCase()}`;
    priority.textContent = `${task.priority} priority`;

    meta.appendChild(priority);

    if (task.dueDate) {
        const due = document.createElement("span");
        due.className = "due-badge";

        if (isOverdue(task)) {
            due.classList.add("overdue");
            due.textContent = `Overdue · ${formatDate(task.dueDate)}`;
        } else if (!task.completed && task.dueDate === getToday()) {
            due.textContent = `Due today · ${formatDate(task.dueDate)}`;
        } else {
            due.textContent = `Due ${formatDate(task.dueDate)}`;
        }

        meta.appendChild(due);
    }

    content.appendChild(text);
    content.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "task-action";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${task.text}`);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-action delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    checkbox.addEventListener("change", function () {
        const oldValue = task.completed;
        task.completed = checkbox.checked;

        if (!saveTasks()) {
            task.completed = oldValue;
        }

        renderTasks();
    });

    editButton.addEventListener("click", function () {
        startEditing(task);
    });

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    return li;
}

// Render the tasks that match the current search and filters.
function renderTasks() {
    taskList.replaceChildren();

    const query = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(query);

        const matchesStatus =
            selectedStatus === "All" ||
            (selectedStatus === "Active" && !task.completed) ||
            (selectedStatus === "Completed" && task.completed) ||
            (selectedStatus === "Overdue" && isOverdue(task));

        const matchesPriority =
            selectedPriority === "All" ||
            task.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    const count = filteredTasks.length;
    document.getElementById("visibleTaskCount").textContent =
        `${count} ${count === 1 ? "task" : "tasks"}`;

    emptyState.classList.toggle("hidden", count > 0);

    if (count === 0) {
        if (tasks.length === 0) {
            emptyState.textContent =
                "No tasks yet. Add your first task above!";
        } else {
            emptyState.textContent =
                "No matching tasks. Try changing your search or filters.";
        }
    }

    updateDashboard();
}

// Update all dashboard statistics.
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(isOverdue).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("overdueTasks").textContent = overdue;

    document.getElementById("progressPercentage").textContent =
        `${percentage}%`;

    document.getElementById("progressBar").style.width =
        `${percentage}%`;

    const progressTrack = document.getElementById("progressTrack");
    progressTrack.setAttribute("aria-valuenow", percentage);
}

// Add a new task or save edits to an existing task.
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (!text) {
        message.textContent = "Please enter a task name.";
        taskInput.focus();
        return;
    }

    if (text.length > 200) {
        message.textContent = "Task names must be 200 characters or fewer.";
        return;
    }

    if (!["High", "Medium", "Low"].includes(priority)) {
        message.textContent = "Please select a valid priority.";
        return;
    }

    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        message.textContent = "Please select a valid due date.";
        return;
    }

    if (editingTaskId) {
        const task = tasks.find(item => item.id === editingTaskId);

        if (!task) {
            message.textContent = "That task could not be found.";
            resetForm();
            return;
        }

        const oldTask = { ...task };

        task.text = text;
        task.priority = priority;
        task.dueDate = dueDate;

        if (!saveTasks()) {
            Object.assign(task, oldTask);
            return;
        }

        message.textContent = "Task updated successfully!";
    } else {
        const newTask = {
            id: createId(),
            text,
            priority,
            dueDate,
            completed: false
        };

        tasks.push(newTask);

        if (!saveTasks()) {
            tasks.pop();
            return;
        }

        message.textContent = "Task added successfully!";
    }

    resetForm();
    renderTasks();
});

// Load an existing task into the form for editing.
function startEditing(task) {
    editingTaskId = task.id;

    taskInput.value = task.text;
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate || "";

    submitButton.textContent = "Save changes";
    cancelEditButton.classList.remove("hidden");

    message.textContent = "Editing task. Update the fields and save.";
    taskInput.focus();

    document.getElementById("taskForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Reset the form after adding, updating, or cancelling.
function resetForm() {
    taskForm.reset();
    editingTaskId = null;

    priorityInput.value = "Medium";
    submitButton.textContent = "+ Add task";
    cancelEditButton.classList.add("hidden");
}

cancelEditButton.addEventListener("click", function () {
    resetForm();
    message.textContent = "Editing cancelled.";
});

// Delete a task and save the change.
function deleteTask(id) {
    const previousTasks = tasks;
    tasks = tasks.filter(task => task.id !== id);

    if (!saveTasks()) {
        tasks = previousTasks;
        return;
    }

    if (editingTaskId === id) {
        resetForm();
    }

    message.textContent = "Task deleted.";
    renderTasks();
}

// Search and filters update the displayed list.
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

// Restore the selected theme.
function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark", dark);
    themeToggle.textContent = dark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );
}

function loadTheme() {
    try {
        return localStorage.getItem(THEME_KEY) === "dark"
            ? "dark"
            : "light";
    } catch (error) {
        return "light";
    }
}

themeToggle.addEventListener("click", function () {
    const nextTheme = document.body.classList.contains("dark")
        ? "light"
        : "dark";

    applyTheme(nextTheme);

    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
        console.error("Could not save theme preference:", error);
        message.textContent = "Theme changed, but the preference could not be saved.";
    }
});

// Start the application.
tasks = loadTasks();
applyTheme(loadTheme());
renderTasks();
