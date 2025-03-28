import { auth, isAdmin } from "../middlewares/middleware.js";
import Book from "../models/book.js";
import express from "express";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.status(200).json(book);
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

router.put("/edit/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;
    await Book.findByIdAndUpdate(id, { title, author, year });
    res.status(200).json({ message: "book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/delete/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
