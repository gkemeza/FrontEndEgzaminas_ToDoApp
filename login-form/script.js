const displayUserNotFoundError = () => {
  removeUserNotFoundError();
  const div = document.createElement("div");
  div.classList.add("error-container", "userNotFound");

  div.innerHTML = `
    <h1 class="error-title">User Not Found!</h1>
    <a href="" class="tryAgain-button">Try again</a>
  `;

  document.body.append(div);
};

const removeUserNotFoundError = () => {
  const div = document.querySelector(".userNotFound");
  if (div) {
    div.remove();
  }
};

const onLogin = async () => {
  const username = document.querySelector(`#login-name`).value.trim();
  const password = document.querySelector(`#login-password`).value.trim();

  if (!username || !password) {
    displayEmptyFieldsError();
    throw new Error("All fields are required");
  }

  const data = { username, password };
  console.log("Login data:", data);

  try {
    const url = `https://localhost:7171/api/Auth?username=${username}&password=${password}`;
    const response = await fetch(url, {
      method: `GET`,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // User not found
      if (response.status === 404) {
        displayUserNotFoundError();
        throw new Error(`User Not Found!`);
      } else {
        removeUserNotFoundError();
        const errorData = await response.text();
        throw new Error(`Authentication failed: ${errorData}`);
      }
    }

    const content = await response.json();
    sessionStorage.setItem("UserId", content.id);
    sessionStorage.setItem("Username", content.userName);

    window.location.href = "../todo-app/todo.html"; // go to TO DO page
  } catch (error) {
    console.error("Fetch", error);
    return;
  }
};

const displayWrongPasswordError = () => {
  removeWrongPasswordError();
  const div = document.createElement("div");
  div.classList.add("error-container", "wrongPassword");

  div.innerHTML = `
    <h1 class="error-title">Wrong password!</h1>
    <a href="" class="tryAgain-button">Try again</a>
  `;

  document.body.append(div);
};

const removeWrongPasswordError = () => {
  const div = document.querySelector(".wrongPassword");
  if (div) {
    div.remove();
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

const togglePasswordVisibility = () => {
  const passwordField = document.getElementById("login-password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};
