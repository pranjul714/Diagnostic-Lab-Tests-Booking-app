const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
let db;

function setDatabase(database) {
  db = database;
}

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 📝 Place a new diagnostic order
router.post("/", upload.single("prescription"), async (req, res) => {
  try {
    const { name, phone, tests, email, doctorName, prescriptionDate } = req.body;

    console.log("Incoming order:", {
      name,
      phone,
      tests,
      email,
      doctorName,
      prescriptionDate,
    });
    console.log("Uploaded file:", req.file?.path);

    if (!name || !phone || !email || !req.file) {
      return res.status(400).json({ error: "Missing required fields or file" });
    }

    const parsedTests = Array.isArray(tests)
      ? tests
      : tests?.split(",").map((t) => t.trim()).filter(Boolean);

    if (!parsedTests || parsedTests.length === 0) {
      return res.status(400).json({ error: "No valid tests found in input" });
    }

    const order = {
      name,
      phone,
      email: email.trim().toLowerCase(),
      doctorName,
      prescriptionDate,
      tests: parsedTests,
      prescriptionPath: req.file.path,
      prescriptionUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      status: "Pending",
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(order);
    console.log("✅ Order inserted:", order);

    res.status(201).json({
      message: "Order placed successfully",
      extractedTests: parsedTests,
    });
  } catch (err) {
    console.error("❌ Order placement error:", err.message, err.stack);
    res.status(500).json({ error: err.message || "Failed to place order" });
  }
});

// 📥 Fetch orders by email
router.get("/by-email/:email", async (req, res) => {
  try {
    const email = req.params.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const orders = await db.collection("orders").find({ email }).toArray();
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message, err.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = { router, setDatabase };