// Direct database connection module that bypasses @vercel/postgres
import pg from 'pg';

let pgPool;

export async function initializeDirectDb() {
  if (!pgPool) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }
    
    pgPool = new pg.Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      // Add connection timeout and retry options
      connectionTimeoutMillis: 5000,
      query_timeout: 10000,
      statement_timeout: 10000,
      idle_in_transaction_session_timeout: 10000
    });
    
    // Test the connection
    try {
      const client = await pgPool.connect();
      try {
        const result = await client.query('SELECT NOW()');
        console.log('Direct PostgreSQL connection test successful:', result.rows[0]);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to initialize direct PostgreSQL connection:', error);
      throw error;
    }
  }
  
  return pgPool;
}

export async function query(text, params) {
  if (!pgPool) {
    await initializeDirectDb();
  }
  
  const client = await pgPool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getDirectIncidentsByStatus(status) {
  const result = await query('SELECT * FROM incidents WHERE status = $1 ORDER BY date DESC, time DESC', [status]);
  return result.rows;
}

export async function getAllDirectIncidents() {
  const result = await query('SELECT * FROM incidents ORDER BY date DESC, time DESC');
  return result.rows;
}

export async function getDirectAdminIncidents() {
  const result = await query('SELECT * FROM incidents ORDER BY "createdAt" DESC');
  return result.rows;
}

export async function createDirectIncident(incident) {
  const { id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt } = incident;
  
  await query(
    'INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt]
  );
  
  return { id };
}

export async function updateDirectIncidentStatus(id, status) {
  await query('UPDATE incidents SET status = $1 WHERE id = $2', [status, id]);
  return { success: true };
} 