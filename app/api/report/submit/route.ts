// app/api/report/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// First, let's update our Prisma schema
// Add this to schema.prisma:
/*
model Report {
  id                  Int      @id @default(autoincrement())
  crimeSubcategory    String
  description         String
  personallyWitnessed Boolean
  location            String
  tokenStake          Int
  occurrenceDate      DateTime
  createdAt           DateTime @default(now())
  solved              Boolean  @default(false)
  tipScore            Int      @default(0)
  userId              Int?     // Optional - if user is authenticated
  user                User?    @relation(fields: [userId], references: [id])
}

// Update User model to have reports
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  reports   Report[]
}
*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      crimeSubcategory,
      description,
      personallyWitnessed,
      location,
      tokenStake,
      occurrenceDate,
      userId
    } = body;
    
    // Validate the request
    if (!crimeSubcategory || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the report in the database
    const report = await prisma.report.create({
      data: {
        crimeSubcategory,
        description,
        personallyWitnessed,
        location,
        tokenStake,
        occurrenceDate: new Date(occurrenceDate),
        userId: userId || null,
      },
    });
    
    // Return the created report
    return NextResponse.json({ 
      success: true, 
      report 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}