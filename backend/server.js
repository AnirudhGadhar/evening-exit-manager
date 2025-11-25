const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const schedule = require('node-schedule');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Schedule auto-clear at 6 PM daily
schedule.scheduleJob('0 18 * * *', async () => {
  try {
    await pool.query('DELETE FROM vehicles');
    console.log('🕒 Auto-cleared all vehicles at 6 PM');
  } catch (error) {
    console.error('Error in auto-clear:', error);
  }
});

// Routes

// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY entry_time DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by number
app.get('/api/vehicles/:vehicleNumber', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM vehicles WHERE vehicle_number = ?',
      [req.params.vehicleNumber]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new vehicle
app.post('/api/vehicles', async (req, res) => {
  try {
    const { vehicleNumber, ownerName, vehicleType, phoneNumber } = req.body;
    
    // Check if vehicle already exists
    const [existing] = await pool.query(
      'SELECT * FROM vehicles WHERE vehicle_number = ?',
      [vehicleNumber]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Vehicle already parked' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO vehicles (vehicle_number, owner_name, vehicle_type, phone_number) VALUES (?, ?, ?, ?)',
      [vehicleNumber, ownerName, vehicleType, phoneNumber || null]
    );
    
    res.status(201).json({
      id: result.insertId,
      vehicleNumber,
      ownerName,
      vehicleType,
      phoneNumber,
      entryTime: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove vehicle
app.delete('/api/vehicles/:vehicleNumber', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM vehicles WHERE vehicle_number = ?',
      [req.params.vehicleNumber]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as total FROM vehicles');
    const [cars] = await pool.query('SELECT COUNT(*) as count FROM vehicles WHERE vehicle_type = "Car"');
    const [bikes] = await pool.query('SELECT COUNT(*) as count FROM vehicles WHERE vehicle_type = "Bike"');
    const [trucks] = await pool.query('SELECT COUNT(*) as count FROM vehicles WHERE vehicle_type = "Truck"');
    
    res.json({
      total: total[0].total,
      cars: cars[0].count,
      bikes: bikes[0].count,
      trucks: trucks[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all vehicles (manual trigger)
app.delete('/api/vehicles', async (req, res) => {
  try {
    await pool.query('DELETE FROM vehicles');
    res.json({ message: 'All vehicles cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
