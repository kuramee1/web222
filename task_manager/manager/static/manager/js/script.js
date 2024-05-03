document.addEventListener("DOMContentLoaded", function () {
    const addTaskForm = document.getElementById('addTaskForm');

    addTaskForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const completed = false;

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

  const toggleCompletedButton = document.querySelector(`button[data-task-id="${taskId}"][class*="toggle-completed-button"]`);
  console.log('Toggle completed button:', toggleCompletedButton);

  if (toggleCompletedButton) {
    const classes = toggleCompletedButton.classList;
    console.log('Before toggling:', classes);
    classes.toggle('completed');
    classes.toggle('not-completed');
    console.log('After toggling:', classes);
  }
}

    function renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = `${task.title} - ${task.description} ${task.completed ? '(Completed)' : '(Not Completed)'}`;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            taskItem.appendChild(deleteButton);

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

            const toggleCompletedButton = document.createElement('button');
            toggleCompletedButton.classList.add('toggle-completed-button');
            toggleCompletedButton.textContent = 'Toggle Completed';
            toggleCompletedButton.addEventListener('click', () => toggleCompleted(task.id));
            taskItem.appendChild(toggleCompletedButton);

            taskList.appendChild(taskItem);
        });
    }

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

    fetchTasks();

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
