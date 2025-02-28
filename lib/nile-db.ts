import { PrismaClient } from '@prisma/client';

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

// Ensure the tenant parameter is present
ensureTenantParameter();

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 