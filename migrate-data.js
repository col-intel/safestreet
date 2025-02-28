// Script to migrate data from SQLite to Postgres
// Usage: 
// For production: NODE_ENV=production POSTGRES_URL=your_postgres_url node migrate-data.js
// For development: DEV_POSTGRES_URL=your_postgres_url node migrate-data.js

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env.production if it exists
dotenv.config({ path: '.env.production' });
// Also load from .env for development
dotenv.config({ path: '.env' });

async function migrateData() {
  console.log('Starting migration from SQLite to Postgres...');
  
  const isProduction = process.env.NODE_ENV === 'production';
  const postgresUrl = isProduction ? process.env.POSTGRES_URL : process.env.DEV_POSTGRES_URL;
  
  // Check if we have a Postgres URL
  if (!postgresUrl) {
    console.error(`${isProduction ? 'POSTGRES_URL' : 'DEV_POSTGRES_URL'} environment variable is required`);
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
    console.log('Creating table in Postgres if it doesn\'t exist...');
    
    if (isProduction) {
      // Use @vercel/postgres in production
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
    } else {
      // Use pg in development
      const pgPool = new pg.Pool({
        connectionString: postgresUrl,
        ssl: process.env.DEV_POSTGRES_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false
      });
      
      await pgPool.query(`
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
      `);
    }
    
    // Get all incidents from SQLite
    console.log('Fetching incidents from SQLite...');
    const incidents = await sqliteDb.all('SELECT * FROM incidents');
    console.log(`Found ${incidents.length} incidents to migrate`);
    
    // Insert incidents into Postgres
    if (incidents.length > 0) {
      console.log('Migrating incidents to Postgres...');
      
      if (isProduction) {
        // Use @vercel/postgres in production
        for (const incident of incidents) {
          // Check if incident already exists in Postgres
          const existingIncident = await sql`SELECT id FROM incidents WHERE id = ${incident.id}`;
          
          if (existingIncident.rows.length === 0) {
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
                ${incident.createdAt}
              )
            `;
            console.log(`Migrated incident ${incident.id}`);
          } else {
            console.log(`Incident ${incident.id} already exists in Postgres, skipping`);
          }
        }
      } else {
        // Use pg in development
        const pgPool = new pg.Pool({
          connectionString: postgresUrl,
          ssl: process.env.DEV_POSTGRES_SSL === 'true' ? {
            rejectUnauthorized: false
          } : false
        });
        
        for (const incident of incidents) {
          // Check if incident already exists in Postgres
          const result = await pgPool.query('SELECT id FROM incidents WHERE id = $1', [incident.id]);
          
          if (result.rows.length === 0) {
            // Insert incident into Postgres
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
              incident.status, 
              incident.createdAt
            ]);
            console.log(`Migrated incident ${incident.id}`);
          } else {
            console.log(`Incident ${incident.id} already exists in Postgres, skipping`);
          }
        }
        
        // Close the pool
        await pgPool.end();
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