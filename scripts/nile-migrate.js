const { execSync } = require('child_process');

console.log('Starting Nile PostgreSQL migration...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Create migration
  console.log('Creating migration...');
  execSync('npx prisma migrate dev --name init', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  console.log('Migration completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error during migration:', error.message);
  process.exit(1);
} 