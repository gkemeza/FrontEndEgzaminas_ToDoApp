const onRegister = async () => {
  const username = document.querySelector(`#signin-name`).value.trim();
  const password = document.querySelector(`#signin-password`).value;
  const email = document.querySelector(`#signin-email`).value.trim();

  if (!username || !password || !email) {
    displayEmptyFieldsError();
    return;
  }

  // Validations
  try {
    passwordValidation(password);
    emailValidation(email);
  } catch (error) {
    return; // Stop further execution on validation failure
  }

  const data = { username, password, email };
  console.log("Sending data:", data);

  try {
    const url = `https://localhost:7171/api/Auth`;
    const response = await fetch(url, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // User exists
      if (response.status === 400) {
        displayUserExistsError();
        throw new Error(`User exists!`);
      } else {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // Use login fetch to get user id
    await saveIdAndUsername(username, password);

    window.location.href = "../todo-app/todo.html"; // go to TO DO page
  } catch (error) {
    console.error(`Error: `, error);
    return;
  }
};

const saveIdAndUsername = async (username, password) => {
  try {
    const url = `https://localhost:7171/api/Auth?username=${username}&password=${password}`;
    const response = await fetch(url, {
      method: `GET`,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.json();
    sessionStorage.setItem("UserId", content.id);
    sessionStorage.setItem("Username", content.userName);
  } catch (error) {
    console.error(`Error: `, error);
    throw error;
  }
};

const displayWrongPasswordError = () => {
  removeWrongPasswordError();
  const div = document.createElement("div");
  div.classList.add("error-container", "wrongPassword");

  div.innerHTML = `
    <h1 class="error-title">Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character!</h1>
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

const displayWrongEmailError = () => {
  removeWrongEmailError();
  const div = document.createElement("div");
  div.classList.add("error-container", "wrongEmail");

  div.innerHTML = `
    <h1 class="error-title">Invalid email!</h1>
    <a href="" class="tryAgain-button">Try again</a>
  `;

  document.body.append(div);
};

const removeWrongEmailError = () => {
  const div = document.querySelector(".wrongEmail");
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

const displayUserExistsError = () => {
  removeUserExistsError();
  const div = document.createElement("div");
  div.classList.add("error-container", "userExists");

  div.innerHTML = `
    <h1 class="error-title">User already exists!</h1>
    <a href="" class="tryAgain-button">Try again</a>
  `;

  document.body.append(div);
};

const removeUserExistsError = () => {
  const div = document.querySelector(".userExists");
  if (div) {
    div.remove();
  }
};

const passwordValidation = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasDigit = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    !(
      password.length >= minLength &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password) &&
      hasDigit.test(password) &&
      hasSpecialChar.test(password)
    )
  ) {
    displayWrongPasswordError();
    throw new Error("Invalid password!");
  }
};

const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    displayWrongEmailError();
    throw new Error("Invalid email");
  }
};

const togglePasswordVisibility = () => {
  const passwordField = document.getElementById("signin-password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};
