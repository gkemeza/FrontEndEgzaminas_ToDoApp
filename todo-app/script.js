const showName = () => {
  const header = document.querySelector("#greeting");
  const username = sessionStorage.getItem("Username");
  header.innerHTML += ` ${username}`;
};

const openUpdateForm = (task) => {
  removeUnneededForms();

  const form = document.createElement("form");
  form.id = "update-form";

  // Convert date string to YYYY-MM-DD format for input?
  const formattedDate = new Date(task.endDate).toLocaleDateString();
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

  // remove?
  if (Object.values(updatedTask).some((value) => !value)) {
    displayEmptyFieldsError();
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
      removeUpdateForm();
    }
    showExistingTasks(); // Refresh the task list
  } catch (error) {
    // change to a div window?
    alert(`Error updating task: ${error.message}`);
  }
};

const deleteTask = async (taskId) => {
  removeUnneededForms();
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
    // change to a div window?
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
    const taskContainer = document.createElement("div");
    taskContainer.id = "task-container";
    const userTasks = allTasks.filter((task) => task.userId === `${userId}`);

    if (!userTasks.length) {
      const h3 = document.querySelector(".toDo-empty");
      h3.innerHTML = "No tasks!";
    } else {
      const h3 = document.querySelector(".toDo-empty");
      h3.innerHTML = "";
      userTasks.forEach((task) => {
        const date = new Date(task.endDate).toLocaleDateString();

        const taskElement = document.createElement("div");
        taskElement.className = "task-card";
        taskElement.innerHTML = `
        <h3>${task.type}</h3>
        <p>${task.content}</p>
        <p>Due: ${date}</p>
        <button onclick="openUpdateForm(${JSON.stringify(task).replace(
          /"/g,
          "&quot;"
        )})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;

        taskContainer.append(taskElement);
      });
    }

    tasksDiv.replaceChildren(); // remove existing tasks?
    tasksDiv.append(taskContainer);
  } catch (error) {
    console.error("Detailed error:", error);
  }
};

const createTask = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  const form = event.target; // Get reference to the form

  const userId = sessionStorage.getItem("UserId");
  const type = document.querySelector(`#todo-type`).value.trim();
  const content = document.querySelector(`#todo-content`).value.trim();
  const endDate = document.querySelector(`#todo-endDate`).value.trim();

  const data = { userId, type, content, endDate };
  console.log("Task data:", data);

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
    removeCreateForm();
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
