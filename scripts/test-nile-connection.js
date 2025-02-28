const { PrismaClient } = require('@prisma/client');

// Ensure the DATABASE_URL has a tenant parameter
function ensureTenantParameter() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not defined in environment variables');
    return false;
  }
  
  console.log('🔍 Checking DATABASE_URL format...');
  
  // Check if tenant parameter exists
  if (!dbUrl.includes('tenant=')) {
    console.warn('⚠️ DATABASE_URL does not contain tenant parameter');
    
    // Add tenant parameter if missing
    const updatedUrl = dbUrl.includes('?') 
      ? `${dbUrl}&tenant=default` 
      : `${dbUrl}?tenant=default`;
    
    process.env.DATABASE_URL = updatedUrl;
    console.log('✅ Added tenant=default parameter to DATABASE_URL');
  } else {
    console.log('✅ DATABASE_URL already contains tenant parameter');
  }
  
  return true;
}

// Test the database connection
async function testConnection() {
  console.log('\n🔌 Testing Nile PostgreSQL connection...');
  
  if (!ensureTenantParameter()) {
    console.error('❌ Cannot proceed without valid DATABASE_URL');
    process.exit(1);
  }
  
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(`✅ Database connection successful: ${JSON.stringify(result)}`);
    
    // Check if incidents table exists
    try {
      console.log('🔍 Checking for incidents table...');
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'incidents'
        );
      `;
      
      if (tableExists[0].exists) {
        console.log('✅ Incidents table exists');
        
        // Count incidents
        const count = await prisma.incident.count();
        console.log(`📊 Found ${count} incidents in the database`);
      } else {
        console.warn('⚠️ Incidents table does not exist yet');
      }
    } catch (tableError) {
      console.warn('⚠️ Could not check for incidents table:', tableError.message);
    }
    
    // Log connection details (without sensitive info)
    const url = new URL(process.env.DATABASE_URL);
    console.log(`\n📡 Connected to: ${url.host}${url.pathname}`);
    console.log(`🔐 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
    console.log(`👤 Tenant: ${url.searchParams.get('tenant') || 'not specified'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.meta) {
      console.error('Error details:', error.meta);
    }
    return false;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Nile PostgreSQL connection test completed successfully');
      process.exit(0);
    } else {
      console.error('\n❌ Nile PostgreSQL connection test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Unexpected error during connection test:', error);
    process.exit(1);
  }); 