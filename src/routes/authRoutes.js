import express from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/utils.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, role = "user" } = req.body;

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword, name, role });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = { user: user._id };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "12h",
    });

    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
