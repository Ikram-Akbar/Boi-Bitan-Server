const { ObjectId } = require("mongodb");
const client = require("../db/connect");

const booksCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);

exports.getAllBooks = async (req, res) => {
  try {
    const books = await booksCollection.find({}).toArray();
    res.send(books);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch books." });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    res.send(book);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch the book." });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = req.body;
    const result = await booksCollection.insertOne(book);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add book." });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBook = req.body;
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBook },
      { upsert: true }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update book." });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await booksCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete book." });
  }
};
