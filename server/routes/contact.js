const express = require("express");
require("dotenv").config();
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../models/User");

// MongoDB schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/contact
router.post("/:username", async (req, res) => {
  console.log("Contact form hit:", req.body);

  try {
    const { username } = req.params;
    const { name, email, message } = req.body;

    // Save contact message to MongoDB
    const contact = new Contact({ name, email, message });
    await contact.save();

    const portfolioHolder = await User.findOne({username}); // fetch one user document
const recipientEmail = portfolioHolder.email;

    // Prepare email options
    const mailOptions = {
      from: `${email}`,  // sender address
      to: recipientEmail,                        // receiver address (portfolio holder)
      subject: `New contact form message from ${name}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Still respond success because message is saved; optionally respond with warning
        return res.status(500).json({ error: "Message saved but failed to send email." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Message received and email sent." });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
