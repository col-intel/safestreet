// Script to migrate data from SQLite to Neon Postgres
// Usage: NODE_ENV=production POSTGRES_URL=your_postgres_url node migrate-data.js

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables from .env.production if it exists
dotenv.config({ path: '.env.production' });

async function migrateData() {
  console.log('Starting migration from SQLite to Neon Postgres...');
  
  // Check if we're in production mode
  if (process.env.NODE_ENV !== 'production') {
    console.error('This script should be run in production mode. Set NODE_ENV=production');
    process.exit(1);
  }
  
  // Check if we have a Postgres URL
  if (!process.env.POSTGRES_URL) {
    console.error('POSTGRES_URL environment variable is required');
    process.exit(1);
  }
  
  try {
    // Open SQLite database
    console.log('Opening SQLite database...');
    const sqliteDb = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    
    // Create table in Postgres if it doesn't exist
    console.log('Creating table in Neon Postgres if it doesn\'t exist...');
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
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Get all incidents from SQLite
    console.log('Fetching incidents from SQLite...');
    const incidents = await sqliteDb.all('SELECT * FROM incidents');
    console.log(`Found ${incidents.length} incidents to migrate`);
    
    // Insert incidents into Postgres
    if (incidents.length > 0) {
      console.log('Migrating incidents to Neon Postgres...');
      
      for (const incident of incidents) {
        // Check if incident already exists in Postgres
        const existingIncident = await sql`SELECT id FROM incidents WHERE id = ${incident.id}`;
        
        if (existingIncident.rows.length === 0) {
          // Ensure createdAt is a valid timestamp
          const createdAt = incident.createdAt || new Date().toISOString();
          
          // Insert incident into Postgres
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
              ${incident.status}, 
              ${createdAt}
            )
          `;
          console.log(`Migrated incident ${incident.id}`);
        } else {
          console.log(`Incident ${incident.id} already exists in Postgres, skipping`);
        }
      }
      
      console.log('Migration completed successfully!');
    } else {
      console.log('No incidents to migrate');
    }
    
    // Close SQLite database
    await sqliteDb.close();
    
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateData(); 