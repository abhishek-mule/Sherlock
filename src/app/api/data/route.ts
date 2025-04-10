import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const enrollmentNumber = searchParams.get('enrollmentNumber');
    const registrationNumber = searchParams.get('registrationNumber');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build query conditions
    const where: any = {};
    
    if (enrollmentNumber) {
      where.enrollmentNumber = enrollmentNumber;
    }
    
    if (registrationNumber) {
      where.registrationNo = registrationNumber;
    }
    
    try {
      // Try to use the database
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback to CSV if database fails
      console.warn('Database connection failed, falling back to CSV file');
      
      // Path to the CSV file in the private data directory
      const filePath = path.join(process.cwd(), 'data', 'students.csv');
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'Student data not found' },
          { status: 404 }
        );
      }
      
      // Return the CSV file directly with CORS headers
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return new NextResponse(fileContents, {
        headers: {
          'Content-Type': 'text/csv',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        }
      });
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'There was an error loading student data.' },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  });
} 