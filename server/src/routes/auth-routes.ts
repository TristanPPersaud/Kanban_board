import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt for password hashing

// Login handler function
export const login = async (req: Request, res: Response) => {
  // Log the login request details
  console.log("Login request received", req.body);

  // Destructure the username and password from the request body
  const { username, password } = req.body;

  // Find the user in the database by username
  const user = await User.findOne({ where: { username } });

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the hashed password in the database
  const passwordIsValid = await bcrypt.compare(password, user.password);

  // If the password doesn't match, return an error
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Get the secret key from environment variables for signing the JWT
  const secretKey = process.env.JWT_SECRET_KEY;

  // If the secret key is missing, return a server error
  if (!secretKey) {
    return res.status(500).json({ message: "Internal server error: Missing JWT secret" });
  }

  // Generate a JWT token with the username and set it to expire in 1 hour
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

  // Return the token in the response
  return res.json({ token });
};

// Define the router and attach the login route
const router = Router();
router.post("/login", login);

// Export the router to be used in the application
export default router;
