const { PrismaClient } = require('@prisma/client');

// Function to ensure the DATABASE_URL contains the tenant parameter
function ensureTenantParameter() {
  if (typeof process.env.DATABASE_URL !== 'string') {
    console.error('DATABASE_URL environment variable is not set');
    return false;
  }

  // Check if the URL contains the tenant parameter
  if (!process.env.DATABASE_URL.includes('tenant=')) {
    console.log('Adding default tenant parameter to DATABASE_URL');
    
    // Add the tenant parameter to the URL
    process.env.DATABASE_URL = process.env.DATABASE_URL.includes('?') 
      ? `${process.env.DATABASE_URL}&tenant=default` 
      : `${process.env.DATABASE_URL}?tenant=default`;
  }

  return true;
}

async function testConnection() {
  console.log('Testing Nile PostgreSQL connection...');
  
  // Ensure the tenant parameter is present
  if (!ensureTenantParameter()) {
    process.exit(1);
  }
  
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient();
  
  try {
    // Test the connection by querying the database
    console.log('Connecting to database...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful!', result);
    
    // Check if the incidents table exists
    console.log('Checking if incidents table exists...');
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log('Tables in database:', tables);
    } catch (error) {
      console.error('Error checking tables:', error.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 