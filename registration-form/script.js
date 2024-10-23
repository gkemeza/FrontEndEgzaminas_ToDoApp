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
  } catch (error) {
    console.error(`Error: `, error);
  }

  //   window.location.href = "../registration-form/register.html"; // go to TO DO page
};
