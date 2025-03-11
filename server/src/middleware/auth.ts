import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the structure of the JWT payload
interface JwtPayload {
  username: string;
}

// Middleware function to authenticate the token
export const authenticateToken = (
  req: Request,  // Request object
  res: Response, // Response object
  next: NextFunction // Next middleware function
) => {
  
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // If the authorization header exists, extract the token
  if (authHeader) {
    // The token is usually in the format "Bearer <token>", so we split to get the token part
    const token = authHeader.split(" ")[1];

    // Get the secret key for verifying the JWT (from environment variables)
    const secretKey = process.env.JWT_SECRET_KEY || "";

    // Verify the token using the secret key
    jwt.verify(token, secretKey, (err, user) => {
      // If the token is invalid or expired, return a 403 Forbidden status
      if (err) {
        return res.sendStatus(403);
      }

      // Attach the decoded user information (payload) to the request object
      req.user = user as JwtPayload;

      // Proceed to the next middleware function or route handler
      return next();
    });
  } else {
    // If there's no authorization header, return a 401 Unauthorized status
    res.sendStatus(401);
  }
};
