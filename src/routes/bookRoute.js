import { auth, isAdmin } from "../middlewares/middleware.js";
import Book from "../models/book.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", auth, isAdmin, async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const book = new Book({ title, author, year });
    await book.save();
    res.status(201).json({ message: "Book saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;
    await Book.findAndUpdateById(id, { title, author, year });
    res.status(200).json({ message: "book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/delete/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findAndDeleteById(id);
    res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
