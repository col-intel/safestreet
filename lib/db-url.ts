// lib/db-url.ts
// This utility ensures the DATABASE_URL has the tenant parameter

// Modify the DATABASE_URL to include the tenant parameter
if (typeof process.env.DATABASE_URL === 'string' && !process.env.DATABASE_URL.includes('tenant=')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.includes('?') 
    ? `${process.env.DATABASE_URL}&tenant=default` 
    : `${process.env.DATABASE_URL}?tenant=default`;
  
  console.log('Added tenant parameter to DATABASE_URL');
}

export {}; 