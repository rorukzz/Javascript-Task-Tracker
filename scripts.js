// Selecting elements
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');

// Event listener for adding tasks
addButton.addEventListener('click', addTask);

// Event listener for clearing all tasks
clearButton.addEventListener('click', clearTasks);

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
            <button class="delete-button">Delete</button>
        `;
        taskList.appendChild(taskItem);

        // Clear the input field
        taskInput.value = '';

        // Add event listener to the delete button
        const deleteButton = taskItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
        });
    }
}

// Function to clear all tasks
function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
}
 