const onLogin = async () => {
  const username = document.querySelector(`#login-name`).value.trim();
  const password = document.querySelector(`#login-password`).value.trim();

  if (!username || !password) {
    throw new Error("All fields are required");
  }

  const data = { username, password };
  console.log("Login data:", data);

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
    console.log(`Response: `, content);
  } catch (error) {
    console.error(`Error: `, error);
  }

  //   window.location.href = "../registration-form/register.html"; // go to TO DO page
};
