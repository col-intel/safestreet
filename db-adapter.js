import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import pg from 'pg';

// Database adapter that uses PostgreSQL in both development and production
let db;
let pgPool;

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
      "reporterName" TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      "createdAt" TEXT NOT NULL
    )
  `;
}

export function getDb() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, we use the sql function from @vercel/postgres for simple queries
    // and pgPool for more complex operations
    return { sql, pgPool };
  } else {
    // In development, we use pgPool for all operations
    return { pgPool };
  }
}

export async function getAllIncidents() {
  const { sql, pgPool } = getDb();
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    if (isProduction) {
      const result = await sql`SELECT * FROM incidents ORDER BY "createdAt" DESC`;
      return result.rows;
    } else {
      const result = await pgPool.query('SELECT * FROM incidents ORDER BY "createdAt" DESC');
      return result.rows;
    }
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
}

export async function getIncidentsByStatus(status) {
  const { sql, pgPool } = getDb();
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    if (isProduction) {
      const result = await sql`SELECT * FROM incidents WHERE status = ${status} ORDER BY "createdAt" DESC`;
      return result.rows;
    } else {
      const result = await pgPool.query('SELECT * FROM incidents WHERE status = $1 ORDER BY "createdAt" DESC', [status]);
      return result.rows;
    }
  } catch (error) {
    console.error(`Error fetching incidents with status ${status}:`, error);
    throw error;
  }
}

export async function createIncident(incident) {
  const { sql, pgPool } = getDb();
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    if (isProduction) {
      await sql`
        INSERT INTO incidents (
          id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt"
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
          ${incident.status || 'pending'}, 
          ${incident.createdAt}
        )
      `;
    } else {
      await pgPool.query(`
        INSERT INTO incidents (
          id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        incident.id, 
        incident.date, 
        incident.time, 
        incident.location, 
        incident.freguesia, 
        incident.description, 
        incident.type, 
        incident.severity, 
        incident.reporterName, 
        incident.status || 'pending', 
        incident.createdAt
      ]);
    }
    return { success: true, id: incident.id };
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
}

export async function updateIncidentStatus(id, status) {
  const { sql, pgPool } = getDb();
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    if (isProduction) {
      await sql`UPDATE incidents SET status = ${status} WHERE id = ${id}`;
    } else {
      await pgPool.query('UPDATE incidents SET status = $1 WHERE id = $2', [status, id]);
    }
    return { success: true };
  } catch (error) {
    console.error(`Error updating incident ${id} status:`, error);
    throw error;
  }
}

export async function getAdminIncidents() {
  const { sql, pgPool } = getDb();
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    if (isProduction) {
      const result = await sql`SELECT * FROM incidents ORDER BY "createdAt" DESC`;
      return result.rows;
    } else {
      const result = await pgPool.query('SELECT * FROM incidents ORDER BY "createdAt" DESC');
      return result.rows;
    }
  } catch (error) {
    console.error('Error fetching admin incidents:', error);
    throw error;
  }
}

// Example of how to switch to a different database in the future:
/*
import { Pool } from 'pg';

let db;

export async function initializeDatabase() {
  // Connect to PostgreSQL
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  // Create tables
  await db.query(`
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
      createdAt TIMESTAMP NOT NULL
    )
  `);
  
  console.log('PostgreSQL database initialized');
  return db;
}

export function getDb() {
  return db;
}
*/ 