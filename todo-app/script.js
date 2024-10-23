const showName = () => {
  const header = document.querySelector("header");
  const username = sessionStorage.getItem("Username");
  header.innerHTML += ` ${username}`;
};

const createTask = async () => {
  const userId = sessionStorage.getItem("UserId");
  const type = document.querySelector(`#todo-type`).value.trim();
  const content = document.querySelector(`#todo-content`).value.trim();
  const endDate = document.querySelector(`#todo-endDate`).value.trim();

  if (!userId || !type || !content || !endDate) {
    alert("All fields are required");
    throw new Error("All fields are required");
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

    const content = await response.text();
    alert(`Response: `, content);
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
    <button onclick="createTask()" id="submit-todo">Submit</button>
  `;
  document.body.append(form);
};

window.onload = showName;
