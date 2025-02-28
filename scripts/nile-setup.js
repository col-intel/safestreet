// scripts/nile-setup.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Nile PostgreSQL database...');

// Function to check if the DATABASE_URL contains the tenant parameter
function checkDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    return false;
  }
  
  // Check if the URL contains the tenant parameter
  if (!databaseUrl.includes('tenant=')) {
    console.log('Warning: DATABASE_URL does not contain the tenant parameter');
    console.log('Adding default tenant parameter...');
    
    // Add the tenant parameter to the URL
    const updatedUrl = databaseUrl.includes('?') 
      ? `${databaseUrl}&tenant=default` 
      : `${databaseUrl}?tenant=default`;
    
    // Update the environment variable
    process.env.DATABASE_URL = updatedUrl;
    
    console.log('Updated DATABASE_URL with tenant parameter');
  }
  
  return true;
}

try {
  // Check the DATABASE_URL
  if (!checkDatabaseUrl()) {
    process.exit(1);
  }
  
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Create the database schema
  console.log('Creating database schema...');
  execSync('npx prisma db push --force-reset', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Seed database
  console.log('Seeding database...');
  execSync('npm run seed', { stdio: 'inherit' });
  
  console.log('Database setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error setting up database:', error.message);
  process.exit(1);
} 