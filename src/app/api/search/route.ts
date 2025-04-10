import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const surname = searchParams.get('surname')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    // If no search query is provided, return empty results
    if (!query && !surname) {
      return NextResponse.json({
        total: 0,
        page,
        limit,
        data: []
      });
    }
    
    // Build where conditions for Prisma
    const whereConditions = [];
    
    // If query exists, search in multiple fields
    if (query) {
      whereConditions.push({
        OR: [
          { fullName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { enrollmentNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { registrationNo: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { registrationNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { rollNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { emailId: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { alternateEmailId: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { mobileNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { alternateMobileNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { studentMobileNo2: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { fatherName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { motherName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { abcIdNumber: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { firstName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { middleName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { aadharNumber: { contains: query, mode: Prisma.QueryMode.insensitive } }
        ]
      });
    }
    
    // If surname exists, add it to the search conditions
    if (surname) {
      whereConditions.push({
        OR: [
          { fullName: { contains: surname, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: surname, mode: Prisma.QueryMode.insensitive } },
          { fatherLastName: { contains: surname, mode: Prisma.QueryMode.insensitive } }
        ]
      });
    }
    
    // Combine all conditions with AND
    const where = whereConditions.length > 0 
      ? { AND: whereConditions }
      : {};
    
    // Get total count for pagination
    const totalCount = await prisma.student.count({ where });
    
    // Get matching records
    const students = await prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        fullName: 'asc',
      },
    });
    
    // Log for debugging
    console.log(`Search for "${query}" found ${students.length} results`);
    
    return NextResponse.json({
      total: totalCount,
      page,
      limit,
      data: students
    });
  } catch (error) {
    console.error('Error searching student data:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'There was an error searching for student data.' },
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