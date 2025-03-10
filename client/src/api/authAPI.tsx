import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    // Make a POST request to the login route
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo), // Send user info (username, password)
    });

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.');
    }

    // Parse the response to get the token
    const data = await response.json();

    // Assuming the token is returned in the response body
    const { token } = data;

    // Store the token in localStorage (or any other secure place)
    localStorage.setItem('token', token);

    return token; // You can return the token if needed
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while logging in.');
  }
};

export { login };
