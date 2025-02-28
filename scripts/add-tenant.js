// scripts/add-tenant.js
// This script adds the tenant parameter to the DATABASE_URL environment variable
// and performs additional checks to prevent the "prepared statement does not exist" error

console.log('Checking DATABASE_URL for tenant parameter...');

// Get the DATABASE_URL from the environment
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Mask the password for logging
const maskedUrl = databaseUrl.replace(/:[^:@]*@/, ':****@');
console.log('Original DATABASE_URL:', maskedUrl);

// Check if the URL already contains the tenant parameter
if (!databaseUrl.includes('tenant=')) {
  console.log('Adding tenant parameter to DATABASE_URL');
  
  // Add the tenant parameter to the URL
  databaseUrl = databaseUrl.includes('?') 
    ? `${databaseUrl}&tenant=default` 
    : `${databaseUrl}?tenant=default`;
  
  // Update the environment variable
  process.env.DATABASE_URL = databaseUrl;
  
  // Mask the password for logging
  const maskedUpdatedUrl = databaseUrl.replace(/:[^:@]*@/, ':****@');
  console.log('Updated DATABASE_URL:', maskedUpdatedUrl);
} else {
  console.log('DATABASE_URL already contains tenant parameter');
}

// Add sslmode=require if not present
if (!databaseUrl.includes('sslmode=')) {
  console.log('Adding sslmode=require parameter to DATABASE_URL');
  
  // Add the sslmode parameter to the URL
  databaseUrl = databaseUrl.includes('?') 
    ? `${databaseUrl}&sslmode=require` 
    : `${databaseUrl}?sslmode=require`;
  
  // Update the environment variable
  process.env.DATABASE_URL = databaseUrl;
  
  // Mask the password for logging
  const maskedUpdatedUrl = databaseUrl.replace(/:[^:@]*@/, ':****@');
  console.log('Updated DATABASE_URL with sslmode:', maskedUpdatedUrl);
}

// Export the updated DATABASE_URL
module.exports = databaseUrl; 