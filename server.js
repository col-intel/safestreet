import express from 'express';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import basicAuth from 'basic-auth';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Auth Middleware
const adminAuth = (req, res, next) => {
  const user = basicAuth(req);
  
  // Replace with your own credentials or use environment variables
  const username = 'admin';
  const password = 'safestreet';
  
  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }
  
  next();
};

// Database setup
let db;

async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      freguesia TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      reporterName TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL
    )
  `);
  
  console.log('Database initialized');
}

// Routes
app.get('/api/incidents', async (req, res) => {
  try {
    const { status } = req.query;
    let incidents;
    
    if (status) {
      incidents = await db.all('SELECT * FROM incidents WHERE status = ? ORDER BY date DESC, time DESC', status);
    } else {
      incidents = await db.all('SELECT * FROM incidents ORDER BY date DESC, time DESC');
    }
    
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    const { 
      date, time, location, freguesia, description, type, severity, reporterName 
    } = req.body;
    
    // Validate required fields
    if (!date || !time || !location || !freguesia || !description || !type || !severity || !reporterName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    await db.run(
      'INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, date, time, location, freguesia, description, type, severity, reporterName, 'pending', createdAt]
    );
    
    res.status(201).json({ id, message: 'Incident reported successfully' });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Admin routes (protected)
app.get('/api/admin/incidents', adminAuth, async (req, res) => {
  try {
    const incidents = await db.all('SELECT * FROM incidents ORDER BY createdAt DESC');
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents for admin:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

app.put('/api/admin/incidents/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Incident status updated successfully' });
  } catch (error) {
    console.error('Error updating incident status:', error);
    res.status(500).json({ error: 'Failed to update incident status' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
  }); 