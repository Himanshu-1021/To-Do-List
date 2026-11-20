
// Get HTML elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Array to store todos
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editId = null;

// Save todos in Local Storage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Display todos on the webpage
function displayTodos() {

    todoList.innerHTML = "";

    todos.forEach(function(todo) {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        checkbox.addEventListener("change", function() {
            toggleComplete(todo.id);
        });

        const span = document.createElement("span");
        span.textContent = todo.text;
        span.className = "task-text";

        if (todo.completed) {
            span.classList.add("completed");
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {
            editTodo(todo.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

    });

    updateStats();
}

// Add a new todo
function addTodo() {

    const text = todoInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {

        const todo = todos.find(function(item) {
            return item.id === editId;
        });

        if (todo) {
            todo.text = text;
        }

        editId = null;
        addBtn.textContent = "Add Task";

    } else {

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
    }

    todoInput.value = "";

    saveTodos();
    displayTodos();
}

// Edit an existing todo
function editTodo(id) {

    const todo = todos.find(function(item) {
        return item.id === id;
    });

    if (todo) {
        todoInput.value = todo.text;
        editId = id;
        addBtn.textContent = "Update Task";
        todoInput.focus();
    }
}

// Delete a todo
function deleteTodo(id) {

    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });

    if (editId === id) {
        editId = null;
        todoInput.value = "";
        addBtn.textContent = "Add Task";
    }

    saveTodos();
    displayTodos();
}

// Mark todo as completed or pending
function toggleComplete(id) {

    const todo = todos.find(function(item) {
        return item.id === id;
    });

    if (todo) {
        todo.completed = !todo.completed;
    }

    saveTodos();
    displayTodos();
}

// Update task statistics
function updateStats() {

    totalTasks.textContent = todos.length;

    const completed = todos.filter(function(todo) {
        return todo.completed;
    }).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = todos.length - completed;
}

// Button event
addBtn.addEventListener("click", addTodo);

// Enter key event
todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// Display saved todos when page loads
displayTodos();
