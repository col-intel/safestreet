const { execSync } = require('child_process');

console.log('Starting Nile PostgreSQL deployment...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Deploy migrations
  console.log('Deploying migrations...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    timeout: 5 * 60 * 1000 // 5 minutes timeout
  });
  
  console.log('Deployment completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error during deployment:', error.message);
  process.exit(1);
} 