import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Assumes token is in the format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    return;
    // Add user data to the request object
    req.user = (decoded as JwtPayload); // Adding decoded token to req.user

    next(); // Proceed to the next middleware or route handler
  });
  return;
};