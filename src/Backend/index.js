const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vible_blog'
});


app.post('/api/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const checkSql = "SELECT * FROM registration WHERE username = ? OR email = ?";
  db.query(checkSql, [username, email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(409).json({ message: "Username or Email already exists" });

    const sql = 'INSERT INTO registration (username, email, password, confirm_password) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, password, confirmPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

   const adminUsername = "viblyblog";
  const adminPassword = "Admin@123";

  if (username === adminUsername && password === adminPassword) {
    return res.status(200).json({
      message: "Admin login successful",
      isAdmin: true,
    });
  }


  const sql = 'SELECT * FROM registration WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (result.length > 0) {
      const user = result[0];
      return res.status(200).json({
        message: 'Login success',
        isAdmin: false,
        userId: user.id,
        username: user.username,
        email: user.email
      });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  });
});


app.post('/api/blogs', upload.single('image'), (req, res) => {
  const { title, content, category, registerid } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content || !image || !category || !registerid) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const cleanBlogContent = String(content).replace(/<[^>]*>/g, "");

  const sql = 'INSERT INTO blogpost (title, content, image, category, registerid) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, cleanBlogContent, image, category, registerid], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: 'Blog post created successfully' });
  });
});

app.get('/blogs', (req, res) => {
  const category = req.query.category;

  let query = "SELECT * FROM blogpost";
  let queryParams = [];

  if (category && category !== 'All') {
    query += " WHERE category = ?";
    queryParams.push(category);
  }

  query += " ORDER BY date DESC";

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Error fetching blogs' });
    }
    res.json(result);
  });
});

app.get("/api/blog/:id", (req, res) => {
  const blogId = req.params.id;
  const sql = "SELECT * FROM blogpost WHERE blogid = ?";

  db.query(sql, [blogId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(result);
  });
});


app.get("/api/myblog", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = "SELECT * FROM blogpost WHERE registerid = ? ORDER BY date DESC";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(result);
  });
});

app.delete('/api/myblog/:id', (req, res) => {
  const blogId = req.params.id;
  const sql = "DELETE FROM blogpost WHERE blogid = ?";

  db.query(sql, [blogId], (err, result) => {
    if (err) return res.status(500).json({ message: "Delete failed", error: err });
    res.status(200).json({ message: "Blog deleted successfully" });
  });
});

app.put('/api/myblog/:id', upload.single('image'), (req, res) => {
  const blogId = req.params.id;
  const { title, content, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = image
    ? "UPDATE blogpost SET title = ?, content = ?, category = ?, image = ? WHERE blogid = ?"
    : "UPDATE blogpost SET title = ?, content = ?, category = ? WHERE blogid = ?";

  const params = image
    ? [title, content, category, image, blogId]
    : [title, content, category, blogId];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    res.status(200).json({ message: "Blog updated successfully" });
  });
});

app.get('/api/myblog/:id', (req, res) => {
  const blogId = req.params.id;
  const sql = "SELECT * FROM blogpost WHERE blogid = ?";
  db.query(sql, [blogId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(result[0]);
  });
});



app.post("/api/author", upload.single("profile_picture"), (req, res) => {
  const { F_Name, L_Name, dob, address, registerid } = req.body;
  const profile_picture = req.file ? req.file.filename : null;

  const checkSql = "SELECT * FROM author WHERE registerid = ?";
  db.query(checkSql, [registerid], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length > 0) {
      // update
      const updateSql = `
        UPDATE author 
        SET F_Name = ?, L_Name = ?, dob = ?, address = ?, profile_picture = ?
        WHERE registerid = ?`;
      db.query(updateSql, [F_Name, L_Name, dob, address, profile_picture, registerid], (err) => {
        if (err) return res.status(500).json({ message: "Update error" });
        return res.status(200).json({ message: "Profile updated" });
      });
    } else {
      // insert
      const insertSql = `
        INSERT INTO author (F_Name, L_Name, dob, address, profile_picture, registerid)
        VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(insertSql, [F_Name, L_Name, dob, address, profile_picture, registerid], (err) => {
        if (err) return res.status(500).json({ message: "Insert error" });
        return res.status(200).json({ message: "Profile created" });
      });
    }
  });
});

app.get('/search', (req, res) => {
  const query = req.query.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: "Search query is required" });
  }

  const sql = "SELECT * FROM blogpost WHERE title LIKE ? ORDER BY date DESC";
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Search failed" });
    }

    res.status(200).json(result);
  });
});

app.get('/search', (req, res) => {
  const query = req.query.query;
  const sql = "SELECT * FROM blogs WHERE title LIKE ?";
  db.query(sql, [`%${query}%`], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


app.listen(8081, () => {
  console.log('Server running on http://localhost:8081');
});
