const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build Next.js app
  console.log('Building Next.js app...');
  execSync('next build', { stdio: 'inherit' });
  
  // Run database migrations
  console.log('Running database migrations...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    timeout: 5 * 60 * 1000 // 5 minutes timeout
  });
  
  console.log('Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error during build process:', error.message);
  process.exit(1);
} 