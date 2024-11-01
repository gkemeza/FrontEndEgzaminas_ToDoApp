const showName = () => {
  const header = document.querySelector("#greeting");
  const username = sessionStorage.getItem("Username");
  header.innerHTML += ` ${username}`;
};

const openUpdateForm = (task) => {
  removeUnneededForms();

  const form = document.createElement("form");
  form.id = "update-form";

  // Format as YYYY-MM-DD
  const formattedDate = new Date(task.endDate).toISOString().split("T")[0];
  console.log(formattedDate);

  form.innerHTML = `
    <h3>Update Task</h3>
    <input type="hidden" id="update-id" value="${task.id}">
    <br>
    <label for="update-type">Type</label>
    <input type="text" id="update-type" value="${task.type}" autocomplete="off">
    <br>
    <label for="update-content">Content</label>
    <input type="text" id="update-content" value="${task.content}" autocomplete="off">
    <br>
    <label for="update-endDate">End date</label>
    <input type="date" id="update-endDate" value="${formattedDate}">
    <br>
    <button type="submit">Update</button>
  `;

  form.addEventListener("submit", updateTask);
  document.body.append(form);
};

const updateTask = async (event) => {
  event.preventDefault();

  const taskId = document.querySelector("#update-id").value;
  const userId = sessionStorage.getItem("UserId");

  const updatedTask = {
    id: parseInt(taskId),
    userId,
    type: document.querySelector("#update-type").value.trim(),
    content: document.querySelector("#update-content").value.trim(),
    endDate: document.querySelector("#update-endDate").value,
  };
  console.log(updatedTask);

  if (areEmptyFields(updatedTask)) {
    return;
  }

  try {
    const url = `https://localhost:7171/api/ToDo/${taskId}`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    showExistingTasks(); // Refresh the task list
    removeUnneededForms();
  } catch (error) {
    alert(`Error updating task: ${error.message}`);
  }
};

const deleteTask = async (taskId) => {
  removeUnneededForms();
  if (!confirm("Are you sure you want to delete?")) {
    return;
  }
  try {
    const url = `https://localhost:7171/api/ToDo/${taskId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showExistingTasks(); // Refresh the task list
  } catch (error) {
    alert(`Error deleting task: ${error.message}`);
  }
};

const showExistingTasks = async () => {
  try {
    const url = `https://localhost:7171/api/ToDo`;
    const response = await fetch(url, {
      method: `GET`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allTasks = await response.json();
    const userId = sessionStorage.getItem("UserId");
    const tasksDiv = document.querySelector("#toDo-tasks");

    tasksDiv.replaceChildren(); // Remove existing tasks

    const userTasks = allTasks.filter((task) => task.userId === `${userId}`);

    const h3 = document.querySelector(".toDo-empty");
    if (!userTasks.length) {
      h3.innerHTML = "No tasks!";
      return;
    } else {
      h3.innerHTML = ""; // Remove message if tasks exist
    }

    // Create and append tasks
    const taskContainer = document.createElement("div");
    taskContainer.id = "task-container";

    userTasks.forEach((task) => {
      // Format as YYYY-MM-DD
      const formattedDate = new Date(task.endDate).toISOString().split("T")[0];

      const taskElement = document.createElement("div");
      taskElement.className = "task-card";
      taskElement.innerHTML = `
      <h3>${task.type}</h3>
      <p>${task.content}</p>
      <p>Due: ${formattedDate}</p>
      <button class="edit-button" onclick="openUpdateForm({id: '${task.id}', type: '${task.type}', content: '${task.content}', endDate: '${task.endDate}'})">Edit</button>
      <button class="delete-button" onclick="deleteTask(${task.id})">Delete</button>
    `;

      taskContainer.append(taskElement);
    });

    tasksDiv.append(taskContainer);
  } catch (error) {
    console.error("Detailed error:", error);
  }
};

const createTask = async (event) => {
  event.preventDefault(); // Prevent the default form submission

  const userId = sessionStorage.getItem("UserId");
  const type = document.querySelector(`#todo-type`).value.trim();
  const content = document.querySelector(`#todo-content`).value.trim();
  const endDate = document.querySelector(`#todo-endDate`).value.trim();

  const data = { userId, type, content, endDate };
  console.log("Task data:", data);

  if (areEmptyFields(data)) {
    return;
  }

  try {
    const url = `https://localhost:7171/api/ToDo`;
    const response = await fetch(url, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showExistingTasks(); // Refresh the task list
    removeUnneededForms();
  } catch (error) {
    console.error("Detailed error:", error);
    alert(`Error: ${error}`);
  }
};

const openCreateForm = () => {
  removeUnneededForms();

  const form = document.createElement("form");
  form.id = "toDo-form";
  form.innerHTML = `
    <h3>Add Task</h3>
    <br>
    <label for="todo-type">Type</label>
    <input type="text" name="todo-type" id="todo-type" autocomplete="off">
    <br>
    <label for="todo-content">Content</label>
    <input type="text" name="todo-content" id="todo-content" autocomplete="off">
    <br>
    <label for="todo-endDate">End date</label>
    <input type="date" name="todo-endDate" id="todo-endDate">
    <br>
    <button type="submit">Submit</button>
  `;

  // Add the form submit handler
  form.addEventListener("submit", createTask);
  document.querySelector("#toDo-options").append(form);
};

// Go to main page
const logOff = () => {
  window.location.href = `../main-page/index.html`;
};

// Remove create form if it exists
const removeCreateForm = () => {
  const form = document.getElementById("toDo-form");
  if (form) {
    form.remove();
  }
};

// Remove update form if it exists
const removeUpdateForm = () => {
  const form = document.getElementById("update-form");
  if (form) {
    form.remove();
  }
};

const areEmptyFields = (fields) => {
  console.log(fields);

  if (Object.values(fields).some((value) => !value)) {
    displayEmptyFieldsError();
    return true;
  }
};

const displayEmptyFieldsError = () => {
  removeEmptyFieldsError();
  const div = document.createElement("div");
  div.classList.add("error-container", "emptyFields");

  div.innerHTML = `
    <h1 class="error-title">All fields are required!</h1>
    <a href="" class="tryAgain-button">Try again</a>
  `;

  document.body.append(div);
};

const removeEmptyFieldsError = () => {
  const div = document.querySelector(".emptyFields");
  if (div) {
    div.remove();
  }
};

const removeUnneededForms = () => {
  removeCreateForm();
  removeUpdateForm();
  removeEmptyFieldsError();
};

const initialData = () => {
  showName();
  showExistingTasks();
};

window.onload = initialData;
