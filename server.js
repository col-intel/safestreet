import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import basicAuth from 'basic-auth';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
  initializeDatabase, 
  getDb, 
  getAllIncidents, 
  getIncidentsByStatus, 
  createIncident, 
  updateIncidentStatus, 
  getAdminIncidents 
} from './db-adapter.js';

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
  
  // Use environment variables for credentials
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'safestreet';
  
  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }
  
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite'
  });
});

// Routes
app.get('/api/incidents', async (req, res) => {
  try {
    const { status } = req.query;
    let incidents;
    
    if (status) {
      incidents = await getIncidentsByStatus(status);
    } else {
      incidents = await getAllIncidents();
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
    
    const result = await createIncident({
      id, 
      date, 
      time, 
      location, 
      freguesia, 
      description, 
      type, 
      severity, 
      reporterName, 
      status: 'pending', 
      createdAt
    });
    
    res.status(201).json({ id: result.id, message: 'Incident reported successfully' });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Admin routes (protected)
app.get('/api/admin/incidents', adminAuth, async (req, res) => {
  try {
    const incidents = await getAdminIncidents();
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
    
    await updateIncidentStatus(id, status);
    res.json({ message: 'Incident status updated successfully' });
  } catch (error) {
    console.error('Error updating incident status:', error);
    res.status(500).json({ error: 'Failed to update incident status' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // In Vercel, static files are handled by the vercel.json configuration
  // This is just a fallback
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Initialize database
let dbInitialized = false;

// Middleware to ensure DB is initialized before handling requests
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to initialize database:', err);
    });
}

// For Vercel serverless functions
export default app; 