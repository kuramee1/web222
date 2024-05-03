document.addEventListener("DOMContentLoaded", function () {
    // Get form for creating a new task
    const addTaskForm = document.getElementById('addTaskForm');

    // Event listener for adding a new task
    addTaskForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get input values
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const completed = false; // Set completed status to false by default

        // Send POST request to create a new task
        fetch('/create-task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: completed,
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
              }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Task created with ID:', data.id);
                fetchTasks();
            })
            .catch(error => {
                console.error('Error creating task:', error);
            });
    });

    // Function to delete a task
    function deleteTask(taskId) {
        fetch(`/delete-task/${taskId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log('Task deleted with ID:', taskId);
                    fetchTasks();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    }

    // Function to update a task
    function updateTask(taskId, newDescription) {
        fetch(`/update-task/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                description: newDescription,
            }),
        })
            .then(response => {
                if (response.ok) {
                    console.log('Task updated with ID:', taskId);
                    fetchTasks();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    }

    // Function to toggle completed status of a task
function toggleCompleted(taskId) {
  fetch(`/toggle-completed/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
  })
   .then(response => {
      if (response.ok) {
        console.log('Task completed status toggled with ID:', taskId);
        fetchTasks();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
   .catch(error => {
      console.error('Error toggling task completed status:', error);
    });

  // Get the toggle completed button for the task
  const toggleCompletedButton = document.querySelector(`button[data-task-id="${taskId}"][class*="toggle-completed-button"]`);
  console.log('Toggle completed button:', toggleCompletedButton);

  // Toggle the CSS class for the button based on the completed status
  if (toggleCompletedButton) {
    const classes = toggleCompletedButton.classList;
    console.log('Before toggling:', classes);
    classes.toggle('completed');
    classes.toggle('not-completed');
    console.log('After toggling:', classes);
  }
}

    // Function to render tasks
    function renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = `${task.title} - ${task.description} ${task.completed ? '(Completed)' : '(Not Completed)'}`;

            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            taskItem.appendChild(deleteButton);

            // Add update button
            const updateButton = document.createElement('button');
            updateButton.classList.add('update-button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => {
                const newDescription = prompt('Enter a new description:');
                if (newDescription) {
                    updateTask(task.id, newDescription);
                }
            });
            taskItem.appendChild(updateButton);

            // Add toggle completed button
            const toggleCompletedButton = document.createElement('button');
            toggleCompletedButton.classList.add('toggle-completed-button');
            toggleCompletedButton.textContent = 'Toggle Completed';
            toggleCompletedButton.addEventListener('click', () => toggleCompleted(task.id));
            taskItem.appendChild(toggleCompletedButton);

            taskList.appendChild(taskItem);
        });
    }

    // Function to fetch tasks from the back-end
    function fetchTasks() {
        return fetch('/get-tasks/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(tasks => {
                console.log('Tasks fetched:', tasks);
                renderTasks(tasks);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }

    // Function to get CSRF token
    function getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('csrftoken=')) {
                return cookie.substring('csrftoken='.length, cookie.length);
            }
        }
        return '';
    }

    // Initialize fetchTasks
    fetchTasks();

    // Add event listener to toggle completed button
    document.addEventListener('DOMContentLoaded', function () {
        const toggleCompletedButtons = document.querySelectorAll('.toggle-completed-button');
        toggleCompletedButtons.forEach(button => {
            button.addEventListener('click', function () {
                const taskId = button.getAttribute('data-task-id');
                toggleCompleted(taskId);
            });
        });
    });
});
