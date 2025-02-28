import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const freguesia = searchParams.get('freguesia');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    
    if (!freguesia && !type && !severity) {
      return NextResponse.json(
        { error: 'At least one filter parameter is required (freguesia, type, or severity)' },
        { status: 400 }
      );
    }
    
    // Build the where clause based on provided filters
    const whereClause: any = {
      status: 'approved', // Only return approved incidents
    };
    
    if (freguesia) {
      whereClause.freguesia = freguesia;
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    if (severity) {
      whereClause.severity = severity;
    }
    
    const incidents = await prisma.incident.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error filtering incidents:', error);
    return NextResponse.json(
      { error: 'Failed to filter incidents' },
      { status: 500 }
    );
  }
} 