const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ProjectDB'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database!');
});

// Create
app.post('/Flowers', (req, res) => {
  const { name, description, price, type } = req.body;
  const sql = 'INSERT INTO Flowers (name, description, price, type) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, description, price, type], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Added successfully!', id: result.insertId });
    }
  });
});

// Get 
app.get('/Flowers', (req, res) => {
  const sql = 'SELECT * FROM Flowers';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get by id
app.get('/Flowers/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM Flowers WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Flower not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// Update 
app.put('/flowers/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, price, type } = req.body;
  const sql = 'UPDATE Flowers SET name = ?, description = ?, price = ?, type = ? WHERE id = ?';
  db.query(sql, [name, description, price, type, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Flower not found' });
    } else {
      res.status(200).json({ message: 'Updated successfully!' });
    }
  });
});

// Delete 
app.delete('/Flowers/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM Flowers WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Flower not found' });
    } else {
      res.status(200).json({ message: 'Deleted successfully!' });
    }
  });
});

app.post('/checkout', (req, res) => {
  try {
    const { cart } = req.body;
    
    // Calculate total price
    const totalPrice = calculateTotalPrice(cart);
    
    res.json({ totalPrice });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Error during checkout' });
  }
});
