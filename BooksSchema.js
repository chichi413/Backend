const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  booktitle: { type: String, required: true },
  PubYear: Number,
  author: String,
  Topic: String,
  formate: String,
});

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Book || mongoose.model("Book", BookSchema, "booksCollection");
