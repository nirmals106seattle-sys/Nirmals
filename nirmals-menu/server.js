// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- Middleware --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// -------------------- Rate Limiter --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests, please try again later.",
});
app.use("/api/apply", limiter);

// -------------------- Uploads --------------------
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  },
});

// -------------------- Menu API --------------------
app.get("/api/menu", (req, res) => {
  const menuPath = path.join(__dirname, "menu.json");
  if (!fs.existsSync(menuPath)) {
    return res
      .status(404)
      .json({ success: false, message: "Menu file not found" });
  }
  const menuData = fs.readFileSync(menuPath, "utf8");
  res.setHeader("Content-Type", "application/json");
  res.send(menuData);
});

// -------------------- Contact Form --------------------
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // adjust if using GoDaddy/Outlook
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Nirmals Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
});

// -------------------- Career Application Form --------------------
app.post("/api/apply", upload.single("resume"), async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    mobileno,
    age,
    city,
    position,
    salary,
    date,
    gender,
    experience,
    additional_info,
  } = req.body;

  const errors = [];
  if (!first_name) errors.push("First name is required");
  if (!last_name) errors.push("Last name is required");
  if (!email) errors.push("Email is required");
  if (!mobileno) errors.push("Mobile number is required");
  if (!position) errors.push("Position is required");

  if (!req.file) errors.push("Resume is required");

  if (errors.length) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ success: false, message: errors.join(", ") });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // adjust if using GoDaddy
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Nirmals Careers" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Career Application: ${first_name} ${last_name}`,
      text: `Name: ${first_name} ${last_name}
Email: ${email}
Mobile: ${mobileno}
Age: ${age}
City: ${city}
Position: ${position}
Expected Salary: ${salary}
Start Date: ${date}
Gender: ${gender}
Experience: ${experience} years
Additional Info: ${additional_info || "N/A"}`,
      attachments: [{ filename: req.file.originalname, path: req.file.path }],
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Error sending application email:", err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Failed to submit application. Please try again later.",
    });
  }
});

// -------------------- Catering Form --------------------
app.post("/api/catering", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Nirmals Catering" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Catering Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Catering request sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending catering request." });
  }
});

// -------------------- Cleanup Old Files --------------------
const FOUR_MONTHS = 1000 * 60 * 60 * 24 * 30 * 4;
function cleanupOldFiles() {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return console.error("Error reading uploads folder:", err);
    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error("Error getting file stats:", err);
        if (now - stats.birthtimeMs > FOUR_MONTHS) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
            else console.log("Deleted old file:", file);
          });
        }
      });
    });
  });
}
setInterval(cleanupOldFiles, 1000 * 60 * 60 * 24);
cleanupOldFiles();

// -------------------- Serve index.html --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
