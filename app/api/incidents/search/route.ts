import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Search for incidents that match the query in various fields
    // Only return approved incidents for public search
    const incidents = await prisma.incident.findMany({
      where: {
        AND: [
          { status: 'approved' },
          {
            OR: [
              { location: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { type: { contains: query, mode: 'insensitive' } },
              { freguesia: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error searching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to search incidents' },
      { status: 500 }
    );
  }
} 