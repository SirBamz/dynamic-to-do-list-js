document.addEventListener('DOMContentLoaded', () => {
    // Select DOM Elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    /**
     * Function to add a new task to the list.
     * @param {string} taskText - The text content of the task.
     * @param {boolean} save - Whether to save the task to Local Storage (default is true).
     */
    function addTask(taskText, save = true) {
        // If taskText is provided as an argument, use it directly.
        // Otherwise, retrieve and trim from the input field.
        const currentTaskText = taskText ? taskText.trim() : taskInput.value.trim();

        // Check if taskText is not empty
        if (currentTaskText === "") {
            // Using a simple alert for demonstration, as per instructions.
            // In a real application, a custom modal or message display would be preferred.
            if (!taskText) { // Only alert if triggered by user input, not on initial load
                alert('Please enter a task!');
            }
            return; // Stop the function if the input is empty
        }

        // Create a new list item (li) for the task
        const listItem = document.createElement('li');
        listItem.textContent = currentTaskText;

        // Create a remove button for the task
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Add a class for styling if needed

        // Assign an onclick event to the remove button
        // When clicked, it removes its parent (the li element) from the taskList
        removeButton.onclick = function() {
            taskList.removeChild(listItem);
            // Update Local Storage after removing the task
            updateLocalStorageOnRemove(currentTaskText);
        };

        // Append the remove button to the list item
        listItem.appendChild(removeButton);

        // Append the new list item to the task list (ul)
        taskList.appendChild(listItem);

        // Clear the input field after adding the task, but only if it was added via the input (not from loadTasks)
        if (save) {
            taskInput.value = '';
            // Save the new task to Local Storage
            updateLocalStorageOnAdd(currentTaskText);
        }
    }

    /**
     * Function to load tasks from Local Storage.
     * It populates the task list on page load.
     */
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(taskText => addTask(taskText, false)); // 'false' indicates not to save again to Local Storage
    }

    /**
     * Helper function to update Local Storage when a task is added.
     * @param {string} newTaskText - The text of the task to add to storage.
     */
    function updateLocalStorageOnAdd(newTaskText) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.push(newTaskText);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    /**
     * Helper function to update Local Storage when a task is removed.
     * @param {string} removedTaskText - The text of the task to remove from storage.
     */
    function updateLocalStorageOnRemove(removedTaskText) {
        let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Filter out the removed task. If multiple tasks have the same text, it removes only the first occurrence.
        // For a more robust solution, tasks might need unique IDs.
        const index = storedTasks.indexOf(removedTaskText);
        if (index > -1) {
            storedTasks.splice(index, 1);
        }
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }


    // Attach Event Listeners
    // Add task when the "Add Task" button is clicked
    addButton.addEventListener('click', () => addTask()); // Call addTask without arguments for user input

    // Add task when the "Enter" key is pressed in the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask(); // Call addTask without arguments for user input
        }
    });

    // Load tasks from Local Storage when the page loads
    loadTasks();
});
