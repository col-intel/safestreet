import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let incidents;
    if (status) {
      incidents = await prisma.incident.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      incidents = await prisma.incident.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
    
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      date, location, freguesia, description, type, severity, reporterName, email, subscribeToUpdates 
    } = body;
    
    // Validate required fields
    if (!date || !location || !freguesia || !description || !type || !severity || !reporterName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const incident = await prisma.incident.create({
      data: {
        id: uuidv4(),
        date,
        location,
        freguesia,
        description,
        type,
        severity,
        reporterName,
        email: email || null,
        subscribeToUpdates: subscribeToUpdates || false,
        status: 'pending'
      }
    });
    
    return NextResponse.json(
      { id: incident.id, message: 'Incident reported successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
} 