const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using Gmail SMTP
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 */
async function SendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"Diagnostic Booking Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
}

module.exports = SendMail;