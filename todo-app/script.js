const showName = () => {
  const header = document.querySelector("h2");
  const username = sessionStorage.getItem("Username");
  header.innerHTML += ` ${username}`;
};

const showTasks = async () => {
  try {
    const url = `https://localhost:7171/api/ToDo`;
    const response = await fetch(url, {
      method: `GET`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    const userId = sessionStorage.getItem("UserId");
    const tasksDiv = document.querySelector("#toDo-tasks");
    const taskContainer = document.createElement("div");
    taskContainer.id = "task-container";

    tasks.forEach((task) => {
      if (task.userId === `${userId}`) {
        console.log(task);
        const date = new Date(task.endDate).toLocaleDateString();

        const taskElement = document.createElement("div");
        taskElement.className = "task-card";
        taskElement.innerHTML = `
        <h3>${task.type}</h3>
        <p>${task.content}</p>
        <p>Due: ${date}</p>
        <button onclick="updateTask(${task.id})">Update</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;

        taskContainer.append(taskElement);
      }
    });

    tasksDiv.replaceChildren(); // remove existing tasks?
    tasksDiv.append(taskContainer);
  } catch (error) {
    console.error("Detailed error:", error);
    alert(`Error loading tasks: ${error}`);
  }
};

const createTask = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  const form = event.target; // Get reference to the form

  const userId = sessionStorage.getItem("UserId");
  const type = document.querySelector(`#todo-type`).value.trim();
  const content = document.querySelector(`#todo-content`).value.trim();
  const endDate = document.querySelector(`#todo-endDate`).value.trim();

  if (!userId || !type || !content || !endDate) {
    alert("All fields are required");
    return;
  }

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

    form.reset(); // clear input fields
  } catch (error) {
    console.error("Detailed error:", error);
    alert(`Error: ${error}`);
  }
};

const openForm = () => {
  const form = document.createElement("form");
  form.innerHTML = `
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

const initialData = () => {
  showName();
  showTasks();
};

window.onload = initialData;
