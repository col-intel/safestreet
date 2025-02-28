import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import pg from 'pg';
import * as directDb from './direct-db.js';

// Database adapter that uses SQLite in development and Vercel Postgres in production
let db;
let pgPool;
let directDbInitialized = false;

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
          rejectUnauthorized: false,
          // Don't check hostname in certificate
          checkServerIdentity: () => undefined
        },
        // Add connection timeout and retry options
        connectionTimeoutMillis: 10000, // Increased timeout
        query_timeout: 15000, // Increased timeout
        statement_timeout: 15000, // Increased timeout
        idle_in_transaction_session_timeout: 15000 // Increased timeout
      });
      
      // Test the connection
      const client = await pgPool.connect();
      try {
        const result = await client.query('SELECT NOW()');
        console.log('PostgreSQL connection test successful:', result.rows[0]);
      } finally {
        client.release();
      }
      
      // Also initialize the direct database connection
      try {
        await directDb.initializeDirectDb();
        directDbInitialized = true;
        console.log('Direct database connection initialized');
      } catch (error) {
        console.error('Failed to initialize direct database connection:', error);
        // Continue anyway, we'll try again when needed
      }
      
      console.log('PostgreSQL database initialized in production');
      return true;
    } catch (error) {
      console.error('Failed to initialize Postgres database:', error);
      
      // Try to initialize direct database connection as a last resort
      try {
        await directDb.initializeDirectDb();
        directDbInitialized = true;
        console.log('Direct database connection initialized as fallback');
        return true;
      } catch (directDbError) {
        console.error('Failed to initialize direct database connection:', directDbError);
        throw error; // Throw the original error
      }
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

// Add a retry mechanism for database operations
async function withRetry(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  
  throw lastError;
}

// Database operations
export async function getAllIncidents() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    try {
      // First try with @vercel/postgres
      try {
        return await withRetry(async () => {
          const result = await sql`SELECT * FROM incidents ORDER BY date DESC, time DESC`;
          return result.rows;
        });
      } catch (error) {
        console.error('Error using @vercel/postgres for getAllIncidents, falling back to pg Pool:', error);
        
        // Fallback to pg Pool
        try {
          if (!pgPool) {
            await initializeDatabase();
          }
          
          return await withRetry(async () => {
            const client = await pgPool.connect();
            try {
              const result = await client.query('SELECT * FROM incidents ORDER BY date DESC, time DESC');
              return result.rows;
            } finally {
              client.release();
            }
          });
        } catch (pgError) {
          console.error('Error using pg Pool for getAllIncidents, falling back to direct DB:', pgError);
          
          // Last resort: try direct DB connection
          if (directDbInitialized) {
            return await directDb.getAllDirectIncidents();
          } else {
            try {
              await directDb.initializeDirectDb();
              directDbInitialized = true;
              return await directDb.getAllDirectIncidents();
            } catch (directDbError) {
              console.error('Error using direct DB for getAllIncidents:', directDbError);
              throw directDbError;
            }
          }
        }
      }
    } catch (error) {
      console.error('All methods failed for getAllIncidents:', error);
      return []; // Return empty array instead of failing
    }
  } else {
    // In development, use SQLite
    return (await db.all('SELECT * FROM incidents ORDER BY date DESC, time DESC'));
  }
}

export async function getIncidentsByStatus(status) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    try {
      // First try with @vercel/postgres
      try {
        return await withRetry(async () => {
          const result = await sql`SELECT * FROM incidents WHERE status = ${status} ORDER BY date DESC, time DESC`;
          return result.rows;
        });
      } catch (error) {
        console.error('Error using @vercel/postgres for getIncidentsByStatus, falling back to pg Pool:', error);
        
        // Fallback to pg Pool
        try {
          if (!pgPool) {
            await initializeDatabase();
          }
          
          return await withRetry(async () => {
            const client = await pgPool.connect();
            try {
              const result = await client.query('SELECT * FROM incidents WHERE status = $1 ORDER BY date DESC, time DESC', [status]);
              return result.rows;
            } finally {
              client.release();
            }
          });
        } catch (pgError) {
          console.error('Error using pg Pool for getIncidentsByStatus, falling back to direct DB:', pgError);
          
          // Last resort: try direct DB connection
          if (directDbInitialized) {
            return await directDb.getDirectIncidentsByStatus(status);
          } else {
            try {
              await directDb.initializeDirectDb();
              directDbInitialized = true;
              return await directDb.getDirectIncidentsByStatus(status);
            } catch (directDbError) {
              console.error('Error using direct DB for getIncidentsByStatus:', directDbError);
              throw directDbError;
            }
          }
        }
      }
    } catch (error) {
      console.error('All methods failed for getIncidentsByStatus:', error);
      return []; // Return empty array instead of failing
    }
  } else {
    // In development, use SQLite
    return (await db.all('SELECT * FROM incidents WHERE status = ? ORDER BY date DESC, time DESC', [status]));
  }
}

export async function createIncident(incident) {
  const { id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt } = incident;
  
  if (process.env.NODE_ENV === 'production') {
    try {
      // Try using @vercel/postgres first
      await sql`
        INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt") 
        VALUES (${id}, ${date}, ${time}, ${location}, ${freguesia}, ${description}, ${type}, ${severity}, ${reporterName}, ${status}, ${createdAt})
      `;
      return { id };
    } catch (error) {
      console.error('Error using @vercel/postgres for createIncident, falling back to pg Pool:', error);
      // Fall back to pg Pool
      try {
        const client = await pgPool.connect();
        try {
          await client.query(
            'INSERT INTO incidents (id, date, time, location, freguesia, description, type, severity, "reporterName", status, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [id, date, time, location, freguesia, description, type, severity, reporterName, status, createdAt]
          );
          return { id };
        } finally {
          client.release();
        }
      } catch (pgError) {
        console.error('Error using pg Pool for createIncident, falling back to direct connection:', pgError);
        // Fall back to direct connection as a last resort
        try {
          return await directDb.createDirectIncident(incident);
        } catch (directDbError) {
          console.error('Error using direct connection for createIncident:', directDbError);
          throw directDbError;
        }
      }
    }
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
    try {
      // Try using @vercel/postgres first
      await sql`UPDATE incidents SET status = ${status} WHERE id = ${id}`;
    } catch (error) {
      console.error('Error using @vercel/postgres for updateIncidentStatus, falling back to pg Pool:', error);
      // Fall back to pg Pool
      try {
        const client = await pgPool.connect();
        try {
          await client.query('UPDATE incidents SET status = $1 WHERE id = $2', [status, id]);
        } finally {
          client.release();
        }
      } catch (pgError) {
        console.error('Error using pg Pool for updateIncidentStatus, falling back to direct connection:', pgError);
        // Fall back to direct connection as a last resort
        try {
          await directDb.updateDirectIncidentStatus(id, status);
        } catch (directDbError) {
          console.error('Error using direct connection for updateIncidentStatus:', directDbError);
          throw directDbError;
        }
      }
    }
  } else {
    await db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, id]);
  }
  return { success: true };
}

export async function getAdminIncidents() {
  if (process.env.NODE_ENV === 'production') {
    try {
      // Try using @vercel/postgres first
      const result = await sql`SELECT * FROM incidents ORDER BY "createdAt" DESC`;
      return result.rows;
    } catch (error) {
      console.error('Error using @vercel/postgres for getAdminIncidents, falling back to pg Pool:', error);
      // Fall back to pg Pool
      try {
        const client = await pgPool.connect();
        try {
          const result = await client.query('SELECT * FROM incidents ORDER BY "createdAt" DESC');
          return result.rows;
        } finally {
          client.release();
        }
      } catch (pgError) {
        console.error('Error using pg Pool for getAdminIncidents, falling back to direct connection:', pgError);
        // Fall back to direct connection as a last resort
        try {
          return await directDb.getDirectAdminIncidents();
        } catch (directDbError) {
          console.error('Error using direct connection for getAdminIncidents:', directDbError);
          // Return empty array instead of failing
          return [];
        }
      }
    }
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