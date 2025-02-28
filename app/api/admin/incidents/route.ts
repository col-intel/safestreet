import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Mark this route as explicitly dynamic since it uses headers
export const dynamic = 'force-dynamic';

// Basic Auth middleware
function checkAuth(request: NextRequest) {
  const authHeader = headers().get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  // Extract credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  
  // Use environment variables for credentials
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'safestreet';
  
  return username === validUsername && password === validPassword;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"'
        }
      });
    }
    
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching admin incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
} 