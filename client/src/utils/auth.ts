import jwt_decode from 'jwt-decode';

class AuthService {
  // Get the decoded token (profile)
  getProfile() {
    const token = this.getToken();
    if (token) {
      return jwt_decode(token); // Decode the token and return the payload
    }
    return null; // If no token, return null
  }

  // Check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    // Check if a token exists and if it's valid (i.e., not expired)
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwt_decode(token);
      if (decoded.exp) {
        return Date.now() >= decoded.exp * 1000; // exp is in seconds, so multiply by 1000 to convert to milliseconds
      }
      return false; // No expiration means the token is not expired
    } catch (err) {
      return true; // If decoding fails, consider the token expired
    }
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token'); // Return the token stored in localStorage, or null if not found
  }

  // Log the user in by setting the token to localStorage and redirecting
  login(idToken: string) {
    localStorage.setItem('token', idToken); // Store the token in localStorage
    window.location.href = '/'; // Redirect to the home page
  }

  // Log the user out by removing the token and redirecting to the login page
  logout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to the login page
  }
}

export default new AuthService();
