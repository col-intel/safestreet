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

// Update incident status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    const { status } = await request.json();

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, approved, or rejected.' },
        { status: 400 }
      );
    }

    // Update incident status
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: `Incident status updated to ${status}`,
      incident: updatedIncident,
    });
  } catch (error) {
    console.error('Error updating incident status:', error);
    return NextResponse.json(
      { error: 'Failed to update incident status' },
      { status: 500 }
    );
  }
} 