const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const client = require("./src/db/connect");
const bookRoutes = require("./src/routes/books");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

async function runServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

    process.on("SIGINT", async () => {
      await client.close();
      console.log("🛑 MongoDB connection closed.");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}

runServer();
