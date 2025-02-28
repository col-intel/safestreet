import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Incident ID is required' },
        { status: 400 }
      );
    }
    
    const incident = await prisma.incident.findUnique({
      where: { id }
    });
    
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    // Transform the data to match the expected format
    const formattedIncident = {
      id: incident.id,
      date: incident.date,
      location: incident.location,
      freguesia: incident.freguesia,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      reporterName: incident.reporterName,
      email: incident.email || '',
      subscribeToUpdates: incident.subscribeToUpdates || false,
      status: incident.status
    };
    
    return NextResponse.json(formattedIncident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
} 