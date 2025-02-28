// scripts/pre-deploy.js
// This script runs before deployment to ensure the environment is properly configured

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running pre-deployment checks...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`🔍 Deployment environment: ${isVercel ? 'Vercel' : 'Local'}`);

// Verify required environment variables
function checkEnvVars() {
  console.log('\n📋 Checking environment variables...');
  
  const requiredVars = ['DATABASE_URL'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      console.error(`❌ Missing required environment variable: ${varName}`);
    } else {
      console.log(`✅ Found ${varName}`);
    }
  }
  
  // Check DATABASE_URL format
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`📡 Database host: ${url.host}`);
      
      // Check for tenant parameter
      if (!url.searchParams.has('tenant')) {
        console.warn('⚠️ DATABASE_URL is missing tenant parameter');
        
        // Add tenant parameter
        url.searchParams.set('tenant', 'default');
        process.env.DATABASE_URL = url.toString();
        console.log('✅ Added tenant=default parameter to DATABASE_URL');
      } else {
        console.log(`✅ Tenant parameter: ${url.searchParams.get('tenant')}`);
      }
      
      // Check for SSL mode
      if (!url.searchParams.has('sslmode')) {
        console.warn('⚠️ DATABASE_URL is missing sslmode parameter');
        
        // Add sslmode parameter for Vercel deployment
        if (isVercel) {
          url.searchParams.set('sslmode', 'require');
          process.env.DATABASE_URL = url.toString();
          console.log('✅ Added sslmode=require parameter to DATABASE_URL');
        }
      } else {
        console.log(`✅ SSL mode: ${url.searchParams.get('sslmode')}`);
      }
    } catch (error) {
      console.error('❌ Invalid DATABASE_URL format:', error.message);
    }
  }
  
  return missingVars.length === 0;
}

// Test database connection
function testDatabaseConnection() {
  console.log('\n🔌 Testing database connection...');
  
  try {
    execSync('node scripts/test-nile-connection.js', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Database connection test passed');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

// Verify Prisma schema
function checkPrismaSchema() {
  console.log('\n📝 Checking Prisma schema...');
  
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Prisma schema file not found at:', schemaPath);
    return false;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Check for PostgreSQL provider
  if (!schema.includes('provider = "postgresql"')) {
    console.error('❌ Prisma schema does not use PostgreSQL provider');
    return false;
  }
  
  console.log('✅ Prisma schema looks good');
  return true;
}

// Run all checks
async function runChecks() {
  const envVarsOk = checkEnvVars();
  const schemaOk = checkPrismaSchema();
  const dbConnectionOk = testDatabaseConnection();
  
  console.log('\n📊 Pre-deployment check summary:');
  console.log(`Environment variables: ${envVarsOk ? '✅' : '❌'}`);
  console.log(`Prisma schema: ${schemaOk ? '✅' : '❌'}`);
  console.log(`Database connection: ${dbConnectionOk ? '✅' : '❌'}`);
  
  if (envVarsOk && schemaOk && dbConnectionOk) {
    console.log('\n🚀 All pre-deployment checks passed! Ready to deploy.');
    return true;
  } else {
    console.error('\n❌ Some pre-deployment checks failed. Please fix the issues before deploying.');
    return false;
  }
}

// Run the checks
runChecks()
  .then(success => {
    if (!success && !isVercel) {
      // Only exit with error code in local environment
      // In Vercel, we want to continue and let the build process handle errors
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error during pre-deployment checks:', error);
    if (!isVercel) {
      process.exit(1);
    }
  }); 