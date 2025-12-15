const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  booktitle: {
    type: String,
    required: true,
  },
  PubYear: Number,
  author: String,
  Topic: String,
  formate: String,
});

module.exports = mongoose.model(
  "Book",
  BookSchema,
  "booksCollection"
);

const Books = require("./BooksSchema");
const connectDB = require("./MongoDBConnect");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is default");
});

app.get("/about", async (req, res) => {
  try {
    const count = await Books.countDocuments();
    res.json({
      message: "mongodb express React and mongoose app, React runs in another application",
      totalBooks: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to count documents", details: err.message });
  }
});

app.get("/allbooks", async (req, res) => {
  const d = await Books.find();
  return res.json(d);
});

app.get("/getbook/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Books.findById(id);

    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.json(book);
  } catch (err) {
    return res.status(400).json({ error: "Invalid id or query error", details: err.message });
  }
});

app.post("/addbooks", async (req, res) => {
  try {
    const newbook = new Books(req.body);
    await newbook.save();
    res.status(200).json({ message: "book added successfully" });
  } catch (err) {
    res.status(400).json({ error: "adding new book failed", details: err.message });
  }
});

app.post("/updatebook/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Build update object
    const update = {
      booktitle: req.body.booktitle,
      PubYear: req.body.PubYear,
      author: req.body.author,
      Topic: req.body.Topic,
      formate: req.body.formate,
    };

    // Remove undefined fields so you don’t overwrite existing values
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    const updatedBook = await Books.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ error: "Book not found" });

    return res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update book", details: err.message });
  }
});

app.post("/deleteBook/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBook = await Books.findByIdAndDelete(id);

    if (!deletedBook) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ message: "Book Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book", details: err.message });
  }
});

(async () => {
  await connectDB();
  app.listen(3000, () => console.log("✅ Server running on port 3000"));
})();
