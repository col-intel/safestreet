const { execSync } = require('child_process');
const path = require('path');

console.log('Running database migrations...');

try {
  // Run prisma migrate deploy
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('Migrations completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error running migrations:', error.message);
  process.exit(1);
} 