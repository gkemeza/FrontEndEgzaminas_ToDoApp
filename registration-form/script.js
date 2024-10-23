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

const onRegister = async () => {
  const username = document.querySelector(`#signin-name`).value.trim();
  const password = document.querySelector(`#signin-password`).value.trim();
  const email = document.querySelector(`#signin-email`).value.trim();

  if (!username || !password || !email) {
    throw new Error("All fields are required");
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
      const errorData = await response.text();
      console.error("Server error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // use login fetch to get user id
    await saveIdAndUsername(username, password);

    window.location.href = "../todo-app/todo.html"; // go to TO DO page
  } catch (error) {
    console.error(`Error: `, error);
    return;
  }
};
