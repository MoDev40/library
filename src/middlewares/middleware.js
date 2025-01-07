import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import User from "../models/User.js";

export function auth(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token is not valid" });
      }

      req.user = decoded.user;

      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id);

    if (user.role !== "admin") {
      return res.status(401).json({ message: "User is not Admin" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "User is not Admin" });
  }
};
