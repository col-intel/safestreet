// Comprehensive database connection check script
import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';
import https from 'https';
import { sql } from '@vercel/postgres';

// Load environment variables
dotenv.config({ path: '.env.production' });

console.log('=== COMPREHENSIVE DATABASE CONNECTION CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Date/Time:', new Date().toISOString());

// Check DNS resolution for Supabase pooler
console.log('\n=== DNS CHECKS ===');
const hostsToCheck = [
  'api.pooler.supabase.com',
  'db.supabase.com',
  'db.supabase.io',
  'db.neon.tech'
];

// Function to check DNS resolution
async function checkDns(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err, address, family) => {
      console.log(`DNS lookup for ${hostname}:`);
      if (err) {
        console.error(`  Error: ${err.message}`);
        resolve(false);
      } else {
        console.log(`  Address: ${address}, Family: IPv${family}`);
        resolve(true);
      }
    });
  });
}

// Function to check HTTPS connectivity
async function checkHttps(hostname) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname,
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 5000
    }, (res) => {
      console.log(`HTTPS connection to ${hostname}: Status ${res.statusCode}`);
      resolve(true);
      res.resume();
    });

    req.on('error', (err) => {
      console.error(`HTTPS connection to ${hostname} failed: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.error(`HTTPS connection to ${hostname} timed out`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Check database connection using @vercel/postgres
async function checkVercelPostgres() {
  console.log('\n=== @vercel/postgres CONNECTION CHECK ===');
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Check database connection using pg
async function checkPgConnection() {
  console.log('\n=== pg CONNECTION CHECK ===');
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('POSTGRES_URL environment variable is not set');
    return false;
  }

  console.log('Connection string (masked):', `${connectionString.substring(0, 10)}...`);

  const pgPool = new pg.Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  });

  try {
    const client = await pgPool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Connection successful:', result.rows[0]);
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  } finally {
    await pgPool.end();
  }
}

// Run all checks
async function runAllChecks() {
  console.log('\n=== NETWORK CHECKS ===');
  for (const host of hostsToCheck) {
    await checkDns(host);
    await checkHttps(host);
  }

  const vercelPgResult = await checkVercelPostgres();
  const pgResult = await checkPgConnection();

  console.log('\n=== SUMMARY ===');
  console.log(`@vercel/postgres connection: ${vercelPgResult ? 'SUCCESS' : 'FAILED'}`);
  console.log(`pg connection: ${pgResult ? 'SUCCESS' : 'FAILED'}`);
  
  if (!vercelPgResult && !pgResult) {
    console.log('\nRECOMMENDATION: Check your database connection string and network connectivity.');
    console.log('If using Vercel, make sure your environment variables are correctly set.');
    console.log('You may need to contact Vercel support if DNS resolution issues persist.');
  }
}

runAllChecks(); 