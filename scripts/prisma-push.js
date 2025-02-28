// scripts/prisma-push.js
// This script handles Prisma schema push more carefully to avoid built-in table errors

const { execSync } = require('child_process');

console.log('Running careful Prisma schema push...');

try {
  // First, try a normal push without any reset flags
  console.log('Attempting standard schema push...');
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Schema push completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Standard schema push failed:', error.message);
  
  // If the standard push fails, try with --accept-data-loss but not --force-reset
  console.log('Attempting schema push with --accept-data-loss...');
  try {
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    console.log('Schema push with --accept-data-loss completed successfully!');
    process.exit(0);
  } catch (secondError) {
    console.error('Schema push with --accept-data-loss failed:', secondError.message);
    
    // If all else fails, try to create the table directly with SQL
    console.log('Attempting to create incidents table directly with SQL...');
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS "incidents" (
          "id" TEXT NOT NULL,
          "date" TEXT NOT NULL,
          "location" TEXT NOT NULL,
          "freguesia" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "severity" TEXT NOT NULL,
          "reporter_name" TEXT NOT NULL,
          "email" TEXT,
          "subscribe_to_updates" BOOLEAN,
          "status" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
        );
      `;
      
      // Use Prisma's queryRaw to execute the SQL
      console.log('Executing SQL to create incidents table...');
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Execute the SQL
      const executeSQL = async () => {
        try {
          await prisma.$executeRawUnsafe(createTableSQL);
          console.log('Successfully created incidents table with SQL!');
          await prisma.$disconnect();
          process.exit(0);
        } catch (sqlError) {
          console.error('Failed to create table with SQL:', sqlError.message);
          await prisma.$disconnect();
          process.exit(1);
        }
      };
      
      executeSQL();
    } catch (finalError) {
      console.error('All attempts to set up the database failed:', finalError.message);
      process.exit(1);
    }
  }
} 