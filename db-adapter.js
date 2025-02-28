import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import pg from 'pg';

// Database adapter that uses SQLite in development and Vercel Postgres in production
let db;
let pgPool;

export async function initializeDatabase() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Use Vercel Postgres in production
    try {
      // For direct SQL queries using @vercel/postgres
      try {
        await createTablesInPostgres();
        console.log('Tables created successfully in Postgres');
      } catch (error) {
        console.error('Error creating tables in Postgres:', error);
        // Continue anyway, tables might already exist
      }
      
      // For more complex queries, we'll use the pg Pool
      const connectionString = process.env.POSTGRES_URL;
      console.log('Connecting to Postgres with connection string (masked):', 
        connectionString ? `${connectionString.substring(0, 10)}...` : 'undefined');
      
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
      const client = await pgPool.connect();
      try {
        const result = await client.query('SELECT NOW()');
        console.log('PostgreSQL connection test successful:', result.rows[0]);
      } finally {
        client.release();
      }
      
      console.log('PostgreSQL database initialized in production');
      return true;
    } catch (error) {
      console.error('Failed to initialize Postgres database:', error);
      throw error;
    }
  } else {
    // Use SQLite in development
    try {
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
      
      console.log('SQLite database initialized in development');
      return true;
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
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

// Database operations
export async function getAllIncidents() {
  if (process.env.NODE_ENV === 'production') {
    const result = await sql`SELECT * FROM incidents ORDER BY date DESC, time DESC`;
    return result.rows;
  } else {
    return await db.all('SELECT * FROM incidents ORDER BY date DESC, time DESC');
  }
}

export async function getIncidentsByStatus(status) {
  if (process.env.NODE_ENV === 'production') {
    const result = await sql`SELECT * FROM incidents WHERE status = ${status} ORDER BY date DESC, time DESC`;
    return result.rows;
  } else {
    return await db.all('SELECT * FROM incidents WHERE status = ? ORDER BY date DESC, time DESC', status);
  }
}

export async function createIncident(incident) {
  const { id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt } = incident;
  
  if (process.env.NODE_ENV === 'production') {
    await sql`
      INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt") 
      VALUES (${id}, ${date}, ${time}, ${location}, ${freguesia}, ${description}, ${type}, ${severity}, ${reporterName}, ${status}, ${createdAt})
    `;
    return { id };
  } else {
    await db.run(
      'INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt]
    );
    return { id };
  }
}

export async function updateIncidentStatus(id, status) {
  if (process.env.NODE_ENV === 'production') {
    await sql`UPDATE incidents SET status = ${status} WHERE id = ${id}`;
  } else {
    await db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, id]);
  }
  return { success: true };
}

export async function getAdminIncidents() {
  if (process.env.NODE_ENV === 'production') {
    const result = await sql`SELECT * FROM incidents ORDER BY "createdAt" DESC`;
    return result.rows;
  } else {
    return await db.all('SELECT * FROM incidents ORDER BY createdAt DESC');
  }
}

// Legacy function for backward compatibility
export function getDb() {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Direct database access is not recommended in production. Use the provided functions instead.');
    return {
      all: async (query, ...params) => {
        console.warn('Using legacy db.all() in production. Consider updating to use the provided functions.');
        if (query.includes('WHERE status =')) {
          const status = params[0];
          return getIncidentsByStatus(status);
        } else if (query.includes('ORDER BY createdAt DESC')) {
          return getAdminIncidents();
        } else {
          return getAllIncidents();
        }
      },
      run: async (query, params) => {
        console.warn('Using legacy db.run() in production. Consider updating to use the provided functions.');
        if (query.includes('UPDATE incidents SET status =')) {
          const [status, id] = params;
          return updateIncidentStatus(id, status);
        } else if (query.includes('INSERT INTO incidents')) {
          const [id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt] = params;
          return createIncident({
            id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt
          });
        }
      }
    };
  } else {
    return db;
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