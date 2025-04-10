import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Initialize Prisma client with error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  prisma = null as any;
}

// Helper function to verify API key
function verifyApiKey(request: NextRequest): boolean {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  const validApiKey = process.env.API_SECRET_KEY;
  
  return apiKey === validApiKey;
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const enrollmentNumber = searchParams.get('enrollmentNumber');
    const registrationNumber = searchParams.get('registrationNumber');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Check if we have a working database connection
    if (!prisma) {
      // Fallback to CSV if database is not available
      console.warn('Database connection not available, falling back to CSV file');
      
      // Path to the CSV file in the private data directory
      const filePath = path.join(process.cwd(), 'data', 'students.csv');
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'Student data not found' },
          { status: 404 }
        );
      }
      
      // Return the CSV file directly
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return new NextResponse(fileContents, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="students.csv"'
        }
      });
    }
    
    // Use database if available
    // Build query conditions
    const where: any = {};
    
    if (enrollmentNumber) {
      where.enrollmentNumber = enrollmentNumber;
    }
    
    if (registrationNumber) {
      where.registrationNo = registrationNumber;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.student.count({ where });
    
    // Get paginated records
    const students = await prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        fullName: 'asc',
      },
    });
    
    return NextResponse.json({
      total: totalCount,
      page,
      limit,
      data: students
    });
    
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'There was an error connecting to the database. Please check your database configuration.' },
      { status: 500 }
    );
  } finally {
    // Only disconnect if we have a valid connection
    if (prisma) {
      await prisma.$disconnect();
    }
  }
} 