import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get total counts by status
    const [
      totalApproved,
      totalPending,
      totalRejected,
      byFreguesia,
      byType,
      bySeverity
    ] = await Promise.all([
      // Count approved incidents
      prisma.incident.count({
        where: { status: 'approved' }
      }),
      
      // Count pending incidents
      prisma.incident.count({
        where: { status: 'pending' }
      }),
      
      // Count rejected incidents
      prisma.incident.count({
        where: { status: 'rejected' }
      }),
      
      // Group by freguesia (only approved)
      prisma.incident.groupBy({
        by: ['freguesia'],
        where: { status: 'approved' },
        _count: true,
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Group by type (only approved)
      prisma.incident.groupBy({
        by: ['type'],
        where: { status: 'approved' },
        _count: true,
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Group by severity (only approved)
      prisma.incident.groupBy({
        by: ['severity'],
        where: { status: 'approved' },
        _count: true
      })
    ]);
    
    // Format the response
    const stats = {
      total: {
        approved: totalApproved,
        pending: totalPending,
        rejected: totalRejected,
        all: totalApproved + totalPending + totalRejected
      },
      byFreguesia: byFreguesia.map(item => ({
        freguesia: item.freguesia,
        count: item._count
      })),
      byType: byType.map(item => ({
        type: item.type,
        count: item._count
      })),
      bySeverity: {
        low: bySeverity.find(item => item.severity === 'low')?._count || 0,
        medium: bySeverity.find(item => item.severity === 'medium')?._count || 0,
        high: bySeverity.find(item => item.severity === 'high')?._count || 0
      }
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching incident statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident statistics' },
      { status: 500 }
    );
  }
} 