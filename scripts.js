// Selecting elements
const taskList = document.getElementById('task-list');
const completedList = document.getElementById('completed-list');
const taskInput = document.getElementById('task-input');
const timerInput = document.getElementById('timer-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');
const inProgressSection = document.getElementById('in-progress-section');
const completedSection = document.getElementById('completed-section');

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
    const timerValue = timerInput.value.trim();

    if (taskText !== '') {
        createTaskElement(taskText, taskList, true, timerValue);

        // Clear the input fields
        taskInput.value = '';
        timerInput.value = '';

        // Save the task to local storage
        storedTasks.push({ text: taskText, timer: timerValue });
        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        updateTaskSectionsVisibility();
    }
}

// Function to clear all tasks
function clearTasks() {
    clearList(taskList, storedTasks, 'tasks');
    clearList(completedList, storedCompletedTasks, 'completedTasks');

    updateTaskSectionsVisibility();
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
    const taskIndex = storageArray.findIndex(task => task.text === taskText);
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
    showAllTasks(taskList);
    hideAllTasks(completedList);
}

// Function to filter completed tasks
function filterCompletedTasks() {
    showAllTasks(completedList);
    hideAllTasks(taskList);
}

// Helper functions to show and hide tasks
function showAllTasks(list) {
    list.querySelectorAll('.task-item').forEach((task) => {
        task.style.display = 'flex';
    });
}

function hideAllTasks(list) {
    list.querySelectorAll('.task-item').forEach((task) => {
        task.style.display = 'none';
    });
}

// Initialize the tasks on page load
function initializeTasks() {
    for (const { text, timer } of storedTasks) {
        createTaskElement(text, taskList, true, timer);
    }

    for (const { text, timer } of storedCompletedTasks) {
        createTaskElement(text, completedList, false, timer);
    }

    updateTaskSectionsVisibility();
}

// Create a task element
function createTaskElement(taskText, list, showCompleteButton = true, timerValue = null) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item', 'flex', 'justify-between', 'items-center', 'p-2', 'border', 'rounded', 'mb-2', 'bg-gray-100');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        ${timerValue ? `<span class="timer ml-4">${timerValue}:00</span>` : ''}
        ${showCompleteButton ? '<button class="complete-button px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Complete</button>' : ''}
        <button class="delete-button px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
    `;
    list.appendChild(taskItem);

    // Add event listener to the delete button
    const deleteButton = taskItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        list.removeChild(taskItem);
        removeFromLocalStorage(showCompleteButton ? storedTasks : storedCompletedTasks, taskText, showCompleteButton ? 'tasks' : 'completedTasks');
        updateTaskSectionsVisibility();
    });

    if (showCompleteButton) {
        // Add event listener to the complete button
        const completeButton = taskItem.querySelector('.complete-button');
        completeButton.addEventListener('click', () => {
            list.removeChild(taskItem);
            completedList.appendChild(taskItem);

            // Move the task to the "Completed" section in local storage
            storedCompletedTasks.push({ text: taskText, timer: timerValue });
            localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));

            removeFromLocalStorage(storedTasks, taskText, 'tasks');
            updateTaskSectionsVisibility();
        });

        // Start the timer countdown if a timer value is provided
        if (timerValue) {
            startTimer(taskItem.querySelector('.timer'), timerValue);
        }
    }
}

// Function to start the timer countdown
function startTimer(timerElement, timerValue) {
    let totalTime = timerValue * 60; // Convert minutes to seconds

    const timerInterval = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = 'Time\'s up!';
        } else {
            totalTime--;
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

// Function to update visibility of task sections
function updateTaskSectionsVisibility() {
    inProgressSection.style.display = taskList.children.length ? 'block' : 'none';
    completedSection.style.display = completedList.children.length ? 'block' : 'none';
}

// Initialize tasks on page load
initializeTasks();
