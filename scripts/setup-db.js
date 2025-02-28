const { execSync } = require('child_process');

console.log('Setting up Nile PostgreSQL database...');

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
  
  // Seed database
  console.log('Seeding database...');
  execSync('npm run seed', { stdio: 'inherit' });
  
  console.log('Database setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error setting up database:', error.message);
  process.exit(1);
} 