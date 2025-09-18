const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Routers
const { router: orderRouter, setDatabase } = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 8080;
const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

// MongoDB connection
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db("Practo");
    console.log("✅ Connected to MongoDB");

    // Inject DB into routes
    setDatabase(db);

    // Mount routes
    app.use("/api/orders", orderRouter);

    // Health check
    app.get("/", (req, res) => {
      res.send("<h2>🩺 Practo API is running</h2>");
    });

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const users = await db.collection("users").find({}).toArray();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).send("Error fetching users");
      }
    });

    // Register user
    app.post("/register", async (req, res) => {
      const { userId, userName, password, email, age, phone } = req.body;

      if (!userId || !userName || !password || !email) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      try {
        const existingUser = await db.collection("users").findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
          userId,
          userName,
          password: hashedPassword,
          email: normalizedEmail,
          age: parseInt(age) || null,
          phone,
          createdAt: new Date(),
        };

        await db.collection("users").insertOne(user);
        console.log("✅ User registered:", user);

        res.status(201).json({ success: true, message: "User registered successfully" });
      } catch (err) {
        console.error("❌ Registration error:", err.message);
        res.status(500).json({ success: false, message: "Server error during registration" });
      }
    });

    // Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      const user = await db.collection("users").findOne({ email: normalizedEmail });
      if (!user) return res.json({ success: false, message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

      const { password: _, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    });

    // Get account info
    app.post("/account", async (req, res) => {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });

      const normalizedEmail = email.trim().toLowerCase();

      try {
        const account = await db.collection("users").findOne({ email: normalizedEmail });
        const profile = await db.collection("profiles").findOne({ email: normalizedEmail });

        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        const { password, ...safeAccount } = account;
        const user = { ...safeAccount, ...profile };
        res.status(200).json({ success: true, user });
      } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // Update profile
    app.post("/update-profile", async (req, res) => {
      const { email, profile } = req.body;
      if (!email || !profile) {
        return res.status(400).json({ success: false, message: "Missing email or profile data" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      try {
        await db.collection("profiles").updateOne(
          { email: normalizedEmail },
          { $set: profile },
          { upsert: true }
        );
        res.status(200).json({ success: true, message: "Profile updated successfully" });
      } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Global error handlers
process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection:", err);
});