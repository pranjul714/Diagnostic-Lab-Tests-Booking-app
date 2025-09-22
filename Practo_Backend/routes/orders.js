const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const SendMail = require("../utils/mailer");
require("dotenv").config();

const router = express.Router();
let db;

function setDatabase(database) {
  db = database;
}

// 📁 Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 📦 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// 🧠 Fallback keyword-to-test mapping
const keywordTestMap = {
  metformin: ["HbA1c", "Fasting Glucose", "PPBS"],
  fatigue: ["CBC", "Thyroid Profile"],
  thirst: ["Fasting Glucose", "HbA1c"],
  diabetes: ["HbA1c", "FBS", "PPBS"],
  thyroid: ["TSH", "T3", "T4"],
  anemia: ["Hemoglobin", "Iron Studies"],
  fever: ["CBC", "Malaria", "Dengue"],
  hypertension: ["Lipid Profile", "KFT"],
  cough: ["Chest X-Ray", "CBC"],
  jaundice: ["LFT", "Bilirubin"],
};

// 🔍 OCR logic
async function runOCR(filePath) {
  try {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (err) {
    console.error("OCR error:", err.message);
    return "";
  }
}

// 🧬 NLP extraction
async function extractMedicalEntities(text) {
  try {
    const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL;
    const response = await axios.post(NLP_SERVICE_URL, { text });
    return response.data;
  } catch (err) {
    console.error("NLP extraction error:", err.message);
    return { diagnoses: [], medications: [], symptoms: [] };
  }
}

// 🛡 Fallback matcher
function fallbackTestMatcher(text) {
  const lowerText = text.toLowerCase();
  const matchedTests = new Set();

  Object.entries(keywordTestMap).forEach(([keyword, tests]) => {
    if (lowerText.includes(keyword)) {
      tests.forEach((test) => matchedTests.add(test));
    }
  });

  return Array.from(matchedTests);
}

// 📤 Upload + extract route
router.post("/upload-prescription", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Prescription file is required" });

    const filePath = req.file.path;
    const extractedText = await runOCR(filePath);
    const entities = await extractMedicalEntities(extractedText);

    console.log("🔍 Extracted Entities:", entities);

    const autoTests = [
      ...(entities?.diagnoses || []),
      ...(entities?.symptoms || []),
      ...(entities?.medications || []),
    ];

    const suggestedTests = autoTests.length ? autoTests : fallbackTestMatcher(extractedText);

    res.status(200).json({ extractedText, entities, suggestedTests });
  } catch (err) {
    console.error("❌ Extraction error:", err.message);
    res.status(500).json({ error: "Failed to extract entities from prescription" });
  }
});

// 📝 Place order route
router.post("/", upload.single("prescription"), async (req, res) => {
  try {
    const { name, phone, tests, email, doctorName, prescriptionDate } = req.body;

    if (!name || !phone || !email || !req.file) {
      return res.status(400).json({ error: "Missing required fields or file" });
    }

    const parsedTests = Array.isArray(tests)
      ? tests
      : tests?.split(",").map((t) => t.trim()).filter(Boolean);

    if (!parsedTests || !parsedTests.length) {
      return res.status(422).json({ error: "No valid tests found in input" });
    }

    const baseUrl = process.env.REACT_APP_API_URL || `${req.protocol}://${req.get("host")}`;
    const prescriptionUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const order = {
      name,
      phone,
      email: email.trim().toLowerCase(),
      doctorName,
      prescriptionDate,
      tests: parsedTests,
      prescriptionPath: req.file.path,
      prescriptionUrl,
      status: "Pending",
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(order);

    const mailText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🩺  Diagnostic Test Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${name.trim().toUpperCase()},

We’re pleased to inform you that your diagnostic test booking has been **successfully confirmed**.  
Thank you for trusting us with your healthcare needs.

📋 **Booking Details**
──────────────────────
• **Tests**: ${parsedTests.join(", ")}
• **Booking ID**: ${order._id}
• **Date**: ${prescriptionDate || "Not specified"}
• **Doctor**: ${doctorName || "Not specified"}

📌 **Important Information**
────────────────────────────
Please bring:
- A valid government-issued ID
- Your prescription (if applicable)

If you have any questions or need to reschedule, our support team is here to help.  
📞 Contact: +91-XXXXXXXXXX

We look forward to serving you and ensuring a smooth testing experience.

Warm regards,  
**Diagnostic Booking Team**  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    SendMail(email, "Diagnostic Test Booking Confirmation", mailText);

    res.status(201).json({ message: "Order placed successfully", extractedTests: parsedTests });
  } catch (err) {
    console.error("❌ Order placement error:", err.message);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// 📥 Fetch orders by email
router.get("/by-email/:email", async (req, res) => {
  try {
    const email = req.params.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const orders = await db.collection("orders").find({ email }).toArray();
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = { router, setDatabase };