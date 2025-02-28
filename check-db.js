// Script to check database connection
import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

// Load environment variables
dotenv.config({ path: '.env.production' });

console.log('Checking database connection...');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check DNS resolution for Neon
dns.lookup('db.neon.tech', (err, address, family) => {
  console.log('DNS lookup for db.neon.tech:');
  if (err) {
    console.error('DNS lookup error:', err);
  } else {
    console.log('Address:', address, 'Family:', family);
  }
});

// Check database connection
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

console.log('Connection string (masked):', `${connectionString.substring(0, 10)}...`);

const pgPool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
});

async function testConnection() {
  try {
    const client = await pgPool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('PostgreSQL connection test successful:', result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
  } finally {
    await pgPool.end();
  }
}

testConnection(); 