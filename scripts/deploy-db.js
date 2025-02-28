const { execSync } = require('child_process');

console.log('Starting database migration deployment...');

try {
  // Set a longer timeout for the migration command
  const timeout = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Run prisma migrate deploy with a longer timeout
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    timeout: timeout
  });
  
  console.log('Database migration completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error deploying migrations:', error.message);
  process.exit(1);
} 