const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'parking_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, phone_number) VALUES (?, ?, ?, ?)',
      [email, password_hash, full_name, phone_number || null]
    );

    const token = jwt.sign({ id: result.insertId, email, role: 'user' }, JWT_SECRET);
    res.status(201).json({ token, user: { id: result.insertId, email, full_name, role: 'user' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, ip_address } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    await pool.query(
      'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)',
      [email, ip_address || null, users.length > 0]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VEHICLES ROUTES

app.get('/api/vehicles', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vehicles', authenticateToken, async (req, res) => {
  try {
    const { vehicle_number, vehicle_type, model, color } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM vehicles WHERE vehicle_number = ?', [vehicle_number]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Vehicle already registered' });
    }

    const [result] = await pool.query(
      'INSERT INTO vehicles (user_id, vehicle_number, vehicle_type, model, color) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, vehicle_number, vehicle_type, model || null, color || null]
    );

    res.status(201).json({ id: result.insertId, vehicle_number, vehicle_type, model, color });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PARKING SLOTS ROUTES

app.get('/api/parking-slots', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parking_slots ORDER BY slot_number');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/parking-slots/available', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM parking_slots WHERE is_occupied = FALSE';
    const params = [];
    
    if (type) {
      query += ' AND slot_type = ?';
      params.push(type);
    }
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PARKING SESSIONS ROUTES

app.get('/api/parking-sessions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ps.*, v.vehicle_number, v.vehicle_type, s.slot_number 
       FROM parking_sessions ps
       JOIN vehicles v ON ps.vehicle_id = v.id
       JOIN parking_slots s ON ps.slot_id = s.id
       WHERE ps.user_id = ? AND ps.status = 'active'
       ORDER BY ps.entry_time DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/parking-sessions', authenticateToken, async (req, res) => {
  try {
    const { vehicle_id, slot_id } = req.body;
    
    const [slot] = await pool.query('SELECT is_occupied FROM parking_slots WHERE id = ?', [slot_id]);
    if (slot.length === 0) return res.status(404).json({ error: 'Slot not found' });
    if (slot[0].is_occupied) return res.status(400).json({ error: 'Slot already occupied' });

    const [result] = await pool.query(
      'INSERT INTO parking_sessions (vehicle_id, slot_id, user_id) VALUES (?, ?, ?)',
      [vehicle_id, slot_id, req.user.id]
    );

    await pool.query('UPDATE parking_slots SET is_occupied = TRUE WHERE id = ?', [slot_id]);

    res.status(201).json({ id: result.insertId, message: 'Parking session started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/parking-sessions/:id/exit', authenticateToken, async (req, res) => {
  try {
    const [session] = await pool.query(
      'SELECT slot_id FROM parking_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (session.length === 0) return res.status(404).json({ error: 'Session not found' });

    await pool.query(
      'UPDATE parking_sessions SET exit_time = NOW(), status = "completed" WHERE id = ?',
      [req.params.id]
    );

    await pool.query('UPDATE parking_slots SET is_occupied = FALSE WHERE id = ?', [session[0].slot_id]);

    res.json({ message: 'Vehicle exited successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOTIFICATIONS ROUTES

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STATS ROUTE

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [activeSessions] = await pool.query(
      'SELECT COUNT(*) as count FROM parking_sessions WHERE user_id = ? AND status = "active"',
      [req.user.id]
    );
    const [totalVehicles] = await pool.query(
      'SELECT COUNT(*) as count FROM vehicles WHERE user_id = ?',
      [req.user.id]
    );
    const [availableSlots] = await pool.query(
      'SELECT COUNT(*) as count FROM parking_slots WHERE is_occupied = FALSE'
    );

    res.json({
      activeSessions: activeSessions[0].count,
      totalVehicles: totalVehicles[0].count,
      availableSlots: availableSlots[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
