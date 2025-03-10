import { Router } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt
export const login = async (req, res) => {
    console.log("Login request received", req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({ message: "Internal server error: Missing JWT secret" });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    return res.json({ token });
};
const router = Router();
router.post("/login", login);
export default router;
