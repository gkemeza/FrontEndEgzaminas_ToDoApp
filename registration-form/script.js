const onSubmit = async () => {
  const username = document.querySelector(`#name`).value.trim();
  const password = document.querySelector(`#password`).value.trim();
  const email = document.querySelector(`#email`).value.trim();

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

    const content = await response.json();
    console.log(`Response: `, content);
  } catch (error) {
    console.error(`Error: `, error);
  }

  //   window.location.href = "../registration-form/register.html"; // go to TO DO page
};
