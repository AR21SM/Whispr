// app/api/report/my-reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would get the userId from the session/authentication
    // For now, we'll return all reports or could use a mock userId
    
    // For demo purposes - in production you would extract userId from auth session
    const reports = await prisma.report.findMany({
      // If you want to limit to a specific user:
      // where: { userId: 1 }, // Replace with actual userId from auth
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}