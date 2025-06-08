const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// console.log("from my env: ",process.env)

//middleware :
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8emp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const booksCollection = client.db("bookstoreDB").collection("all-books");

    // Get all books
    app.get("/api/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const books = await cursor.toArray();
      res.send(books);
    });

    // Get specific book by ID
    app.get("/api/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const book = await booksCollection.findOne(query);
      res.send(book);
    });

    app.post("/api/books", async (req, res) => {
      const book = req.body;
      console.log("Received book data:", book);
      const result = await booksCollection.insertOne(book);
      res.status(200).send(result);
    });

    // Update a book by id :
    app.put("/api/books/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          author: updatedBook.author,
          bookId: updatedBook.bookId,
          bookName: updatedBook.bookName,
          category: updatedBook.category,
          image: updatedBook.image,
          publisher: updatedBook.publisher,
          rating: updatedBook.rating,
          review: updatedBook.review,
          tags: updatedBook.tags,
          totalPages: updatedBook.totalPages,
          yearOfPublishing: updatedBook.yearOfPublishing,
        },
      };
      const result = await booksCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //delete a book by id
    app.delete("/api/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();F
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
