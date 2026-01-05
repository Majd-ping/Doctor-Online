// 1️⃣ Import packages
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 2️⃣ Create Express app
const app = express();
app.use(cors({
  origin: [
    "https://majd-ping.github.io",
    "http://localhost:3000",
    "http://localhost:5000"
  ],
  credentials: true
}));
app.use(express.json()); // Important to parse JSON

// 3️⃣ Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "doctor_online",
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL connected");
  }
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GET all services
app.get('/api/services', (req, res) => {
  db.query('SELECT id, title, description FROM services ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, services: results });
  });
});

// GET all doctors
app.get('/api/discussions', (req, res) => {
  db.query('SELECT d.id, d.topic, u.name, DATE_FORMAT(d.created_at, "%Y-%m-%d %H:%i") as date FROM discussions d LEFT JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, discussions: results });
  });
});

// POST new discussion
app.post('/api/discussions', (req, res) => {
  try {
    const { topic, user_id } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    db.query('INSERT INTO discussions (user_id, topic) VALUES (?, ?)', [user_id || null, topic], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      return res.status(201).json({ success: true, message: 'Discussion posted', id: result.insertId });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all posts
app.get('/api/posts', (req, res) => {
  db.query('SELECT id, title, author, category, summary, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM posts ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, posts: results });
  });
});

// GET post by id
app.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, title, author, category, content, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, post: results[0] });
  });
});

// DELETE a post (only for admins/doctors)
app.delete('/api/posts/:id', (req, res) => {
  try {
    const postId = req.params.id;
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    // Check if user is a doctor or admin (can delete posts)
    if (role !== 'Doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can delete posts' });
    }

    // Delete the post (comments will be deleted automatically via CASCADE)
    db.query('DELETE FROM posts WHERE id = ?', [postId], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      return res.json({ success: true, message: 'Post deleted successfully' });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET comments for a post
app.get('/api/comments/:postId', (req, res) => {
  const postId = req.params.postId;
  db.query('SELECT c.id, c.text, u.name, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i") as date FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC', [postId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, comments: results });
  });
});

// POST a new comment
app.post('/api/comments/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const { text, user_id } = req.body;

    if (!text || !user_id) {
      return res.status(400).json({ success: false, message: 'Text and user_id are required' });
    }

    db.query('INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)', [postId, user_id, text], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      return res.status(201).json({ success: true, message: 'Comment added successfully', commentId: result.insertId });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE a comment
app.delete('/api/comments/:commentId', (req, res) => {
  try {
    const { commentId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    // Check if user owns the comment or is admin
    db.query('SELECT user_id FROM comments WHERE id = ?', [commentId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      if (results[0].user_id !== user_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
      }

      // Delete the comment
      db.query('DELETE FROM comments WHERE id = ?', [commentId], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        return res.json({ success: true, message: 'Comment deleted successfully' });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST contact message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    db.query('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      return res.status(201).json({ success: true, message: 'Message sent successfully' });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all doctors
app.get('/api/doctors', (req, res) => {
  db.query('SELECT d.id, u.name, d.specialization, d.experience, d.fees, d.availability FROM doctors d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, doctors: results });
  });
});

// GET single doctor
app.get('/api/doctors/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT d.id, u.name, d.specialization, d.experience, d.fees, d.availability FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Doctor not found' });
    return res.json({ success: true, doctor: results[0] });
  });
});

// POST new appointment
app.post('/api/appointments', (req, res) => {
  try {
    const { doctor_id, patient_id, appointment_date, appointment_time } = req.body;
    if (!doctor_id || !patient_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    db.query('INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)', 
      [doctor_id, patient_id, appointment_date, appointment_time, 'pending'], 
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        return res.status(201).json({ success: true, message: 'Appointment booked', id: result.insertId });
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET appointments for patient
app.get('/api/appointments/patient/:patient_id', (req, res) => {
  const patient_id = req.params.patient_id;
  db.query('SELECT a.id, a.appointment_date, a.appointment_time, a.status, u.name as doctor_name, d.specialization FROM appointments a JOIN doctors d ON a.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = ? ORDER BY a.appointment_date DESC', [patient_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, appointments: results });
  });
});

// GET appointments for doctor
app.get('/api/appointments/doctor/:doctor_id', (req, res) => {
  const doctor_id = req.params.doctor_id;
  db.query('SELECT a.id, a.appointment_date, a.appointment_time, a.status, u.name as patient_name FROM appointments a JOIN users u ON a.patient_id = u.id WHERE a.doctor_id = ? ORDER BY a.appointment_date DESC', [doctor_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    return res.json({ success: true, appointments: results });
  });
});

// UPDATE appointment status
app.put('/api/appointments/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      return res.json({ success: true, message: 'Appointment updated' });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4️⃣ Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check if email already exists
    db.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (result.length > 0) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into database
      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: "Server error" });
          return res.status(201).json({ success: true, message: "User registered successfully" });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 5️⃣ Login API
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (result.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({ success: true, message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 6️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

