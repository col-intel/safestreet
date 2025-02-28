import { sql } from '@vercel/postgres';
import pg from 'pg';
import { Incident } from '@/types';

// Database adapter that uses PostgreSQL in both development and production
let pgPool: pg.Pool;

export async function initializeDatabase() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    // For direct SQL queries using @vercel/postgres in production
    // or pg Pool in development
    if (isProduction) {
      await createTablesInPostgres();
      
      // For more complex queries, we'll use the pg Pool
      pgPool = new pg.Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
      console.log('PostgreSQL database initialized in production');
    } else {
      // Use PostgreSQL in development too
      pgPool = new pg.Pool({
        connectionString: process.env.DEV_POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/safestreet',
        ssl: process.env.DEV_POSTGRES_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false
      });
      
      await createTablesInPostgres();
      console.log('PostgreSQL database initialized in development');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize Postgres database:', error);
    throw error;
  }
}

// Create tables in Postgres
async function createTablesInPostgres() {
  await sql`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      freguesia TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      reporter_name TEXT NOT NULL,
      email TEXT,
      subscribe_to_updates BOOLEAN,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `;
}

export function getDb() {
  if (!pgPool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pgPool;
}

export async function getAllIncidents(): Promise<Incident[]> {
  try {
    const result = await sql`SELECT * FROM incidents ORDER BY created_at DESC`;
    
    return result.rows.map(row => ({
      id: row.id,
      date: row.date,
      time: row.time,
      location: row.location,
      freguesia: row.freguesia,
      description: row.description,
      type: row.type,
      severity: row.severity as "low" | "medium" | "high",
      reporterName: row.reporter_name,
      email: row.email || '',
      subscribeToUpdates: row.subscribe_to_updates || false,
      status: row.status as "pending" | "approved" | "rejected",
    }));
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    throw error;
  }
}

export async function getIncidentsByStatus(status: string): Promise<Incident[]> {
  try {
    const result = await sql`
      SELECT * FROM incidents 
      WHERE status = ${status} 
      ORDER BY created_at DESC
    `;
    
    return result.rows.map(row => ({
      id: row.id,
      date: row.date,
      time: row.time,
      location: row.location,
      freguesia: row.freguesia,
      description: row.description,
      type: row.type,
      severity: row.severity as "low" | "medium" | "high",
      reporterName: row.reporter_name,
      email: row.email || '',
      subscribeToUpdates: row.subscribe_to_updates || false,
      status: row.status as "pending" | "approved" | "rejected",
    }));
  } catch (error) {
    console.error(`Error fetching incidents with status ${status}:`, error);
    throw error;
  }
}

export async function createIncident(incident: Omit<Incident, 'id'> & { id: string }): Promise<{ id: string }> {
  try {
    await sql`
      INSERT INTO incidents (
        id, date, time, location, freguesia, description, type, severity, 
        reporter_name, email, subscribe_to_updates, status, created_at
      ) VALUES (
        ${incident.id}, 
        ${incident.date}, 
        ${incident.time}, 
        ${incident.location}, 
        ${incident.freguesia}, 
        ${incident.description}, 
        ${incident.type}, 
        ${incident.severity}, 
        ${incident.reporterName}, 
        ${incident.email || null}, 
        ${incident.subscribeToUpdates || false}, 
        ${incident.status}, 
        ${new Date().toISOString()}
      )
    `;
    
    return { id: incident.id };
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
}

export async function updateIncidentStatus(id: string, status: string): Promise<void> {
  try {
    await sql`
      UPDATE incidents 
      SET status = ${status} 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(`Error updating incident ${id} status to ${status}:`, error);
    throw error;
  }
}

export async function getAdminIncidents(): Promise<Incident[]> {
  try {
    const result = await sql`
      SELECT * FROM incidents 
      ORDER BY created_at DESC
    `;
    
    return result.rows.map(row => ({
      id: row.id,
      date: row.date,
      time: row.time,
      location: row.location,
      freguesia: row.freguesia,
      description: row.description,
      type: row.type,
      severity: row.severity as "low" | "medium" | "high",
      reporterName: row.reporter_name,
      email: row.email || '',
      subscribeToUpdates: row.subscribe_to_updates || false,
      status: row.status as "pending" | "approved" | "rejected",
    }));
  } catch (error) {
    console.error('Error fetching admin incidents:', error);
    throw error;
  }
} 