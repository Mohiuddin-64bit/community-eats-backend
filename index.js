const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("communityEats");
    const collection = db.collection("users");

    // User Registration
    app.post("/register", async (req, res) => {
      const { name, email, password } = req.body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({ name, email, password: hashedPassword });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    });

    // User Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // ==============================================================
    // WRITE YOUR CODE HERE
    // ==============================================================

    // POST Supplies
    app.post("/supplies", async (req, res) => {
      try {
        const db = client.db("communityEats");
        const suppliesCollection = db.collection("allSupplies");

        const { imageLink, title, category, quantity, description } = req.body;

        if (!imageLink || !title || !category || !quantity || !description) {
          return res
            .status(400)
            .json({ message: "Not enough data to create Supplies" });
        }

        await suppliesCollection.insertOne({
          imageLink,
          category,
          title,
          quantity,
          description,
        });

        res.status(201).json({
          success: true,
          message: "Supplies added successfully",
        });
      } catch (error) {
        console.error("Error adding Supplies details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET All Supplies
    app.get("/supplies", async (req, res) => {
      try {
        const db = client.db("communityEats");
        const suppliesCollection = db.collection("allSupplies");

        const supplies = await suppliesCollection.find().toArray();

        res.json(supplies);
      } catch (error) {
        console.error("Error fetching Supplies:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET Single Supplies
    app.get("/supplies/:id", async (req, res) => {
      try {
        const db = client.db("communityEats");
        const suppliesCollection = db.collection("allSupplies");

        const suppliesId = req.params.id;

        const idToFind = new ObjectId(suppliesId);

        // Find the Supplies by its ID
        const supplies = await suppliesCollection.findOne({ _id: idToFind });

        if (!supplies) {
          return res.status(404).json({ message: "supplies not found" });
        }

        res.json(supplies);
      } catch (error) {
        console.error("Error fetching supplies:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update Single Supplies
    app.patch("/supplies/:id", async (req, res) => {
      try {
        const db = client.db("communityEats");
        const suppliesCollection = db.collection("allSupplies");

        const suppliesId = req.params.id;

        const idToUpdate = new ObjectId(suppliesId);

        // Check if the supplies exists
        const existingSupplies = await suppliesCollection.findOne({
          _id: idToUpdate,
        });1
        if (!existingSupplies) {
          return res.status(404).json({ message: "supplies not found" });
        }
        // Update the supplies with new data from the request body
        const { imageLink, title, category, quantity, description } = req.body;
        const updateSupplies = {
          imageLink,
          title,
          category,
          quantity,
          description,
        };
        await suppliesCollection.updateOne(
          { _id: idToUpdate },
          { $set: updateSupplies }
        );
        res.json({ success: true, message: "supplies updated successfully" });
      } catch (error) {
        console.error("Error updating supplies:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // DELETE supplies
    app.delete("/supplies/:id", async (req, res) => {
      try {
        const db = client.db("communityEats");
        const suppliesCollection = db.collection("allSupplies");

        const suppliesId = req.params.id;

        const idToDelete = new ObjectId(suppliesId);

        // Check if the Supplies exists
        const Supplies = await suppliesCollection.findOne({ _id: idToDelete });

        if (!Supplies) {
          return res.status(404).json({ message: "Supplies not found" });
        }

        // Delete the Supplies
        await suppliesCollection.deleteOne({ _id: idToDelete });

        res.json({ success: true, message: "Supplies deleted successfully" });
      } catch (error) {
        console.error("Error deleting Supplies:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
