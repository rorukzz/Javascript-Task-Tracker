// Selecting elements
const taskList = document.getElementById('task-list');
const completedList = document.getElementById('completed-list');
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');

// Load tasks from local storage
const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// Event listener for adding tasks
addButton.addEventListener('click', addTask);

// Event listener for clearing all tasks
clearButton.addEventListener('click', clearTasks);

// Event listener for filtering tasks
filterAllButton.addEventListener('click', filterAllTasks);
filterActiveButton.addEventListener('click', filterActiveTasks);
filterCompletedButton.addEventListener('click', filterCompletedTasks);

// Event listener for adding tasks when Enter key is pressed
taskInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});



// Function to add a task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-button">Complete</button>
            <button class="delete-button">Delete</button>
        `;
        taskList.appendChild(taskItem);

        // Clear the input field
        taskInput.value = '';

        // Save the task to local storage
        storedTasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        // Add event listener to the delete button
        const deleteButton = taskItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            removeFromLocalStorage(storedTasks, taskText, 'tasks');
        });

        // Add event listener to the complete button
        const completeButton = taskItem.querySelector('.complete-button');
        completeButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            taskItem.removeChild(completeButton);
            completedList.appendChild(taskItem);

            // Move the task to the "Completed" section in local storage
            storedCompletedTasks.push(taskText);
            localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));

            removeFromLocalStorage(storedTasks, taskText, 'tasks');
        });
    }
}

// Function to clear all tasks
function clearTasks() {
    clearList(taskList, storedTasks, 'tasks');
    clearList(completedList, storedCompletedTasks, 'completedTasks');
}

// Function to clear a list of tasks and update local storage
function clearList(list, storageArray, storageKey) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    storageArray.length = 0;
    localStorage.removeItem(storageKey);
}

// Function to remove a task from local storage
function removeFromLocalStorage(storageArray, taskText, storageKey) {
    const taskIndex = storageArray.indexOf(taskText);
    if (taskIndex !== -1) {
        storageArray.splice(taskIndex, 1);
        localStorage.setItem(storageKey, JSON.stringify(storageArray));
    }
}

// Function to filter all tasks
function filterAllTasks() {
    showAllTasks(taskList);
    showAllTasks(completedList);
}

// Function to filter active tasks
function filterActiveTasks() {
    hideCompletedTasks(taskList);
    showAllTasks(completedList);
}

// Function to filter completed tasks
function filterCompletedTasks() {
    hideActiveTasks(taskList);
    showAllTasks(completedList);
}

// Helper functions to show and hide tasks
function showAllTasks(list) {
    list.querySelectorAll('.task-item').forEach((task) => {
        task.style.display = 'block';
    });
}

function hideActiveTasks(list) {
    list.querySelectorAll('.task-item').forEach((task) => {
        task.style.display = 'none';
    });
}

function hideCompletedTasks(list) {
    list.querySelectorAll('.task-item').forEach((task) => {
        task.style.display = 'block';
    });
}

// Initialize the tasks on page load
function initializeTasks() {
    for (const taskText of storedTasks) {
        createTaskElement(taskText, taskList);
    }

    for (const taskText of storedCompletedTasks) {
        createTaskElement(taskText, completedList, false);
    }
}

// Create a task element
function createTaskElement(taskText, list, showCompleteButton = true) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        ${showCompleteButton ? '<button class="complete-button">Complete</button>' : ''}
        <button class="delete-button">Delete</button>
    `;
    list.appendChild(taskItem);

    // Add event listener to the delete button
    const deleteButton = taskItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        list.removeChild(taskItem);
        removeFromLocalStorage(showCompleteButton ? storedTasks : storedCompletedTasks, taskText, showCompleteButton ? 'tasks' : 'completedTasks');
    });

    if (showCompleteButton) {
        // Add event listener to the complete button
        const completeButton = taskItem.querySelector('.complete-button');
        completeButton.addEventListener('click', () => {
            list.removeChild(taskItem);
            taskItem.removeChild(completeButton);
            completedList.appendChild(taskItem);

            // Move the task to the "Completed" section in local storage
            storedCompletedTasks.push(taskText);
            localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));

            removeFromLocalStorage(storedTasks, taskText, 'tasks');
        });
    }
}

// Initialize tasks on page load
initializeTasks();
