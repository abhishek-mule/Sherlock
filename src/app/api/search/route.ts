import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

// Don't initialize Prisma at the module level for build
// Instead, create a function to get the Prisma client
function getPrismaClient() {
  return new PrismaClient();
}

export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();
  
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
    
    try {
      // Build the search query
      const queryConditions = [];
      
      if (query) {
        queryConditions.push(
          Prisma.sql`(
            "fullName" ILIKE ${`%${query}%`} OR
            "enrollmentNumber" ILIKE ${`%${query}%`} OR
            "registrationNo" ILIKE ${`%${query}%`} OR
            "registrationNumber" ILIKE ${`%${query}%`} OR
            "rollNumber" ILIKE ${`%${query}%`} OR
            "emailId" ILIKE ${`%${query}%`} OR
            "alternateEmailId" ILIKE ${`%${query}%`} OR
            "mobileNumber" ILIKE ${`%${query}%`} OR
            "alternateMobileNumber" ILIKE ${`%${query}%`} OR
            "studentMobileNo2" ILIKE ${`%${query}%`} OR
            "fatherName" ILIKE ${`%${query}%`} OR
            "motherName" ILIKE ${`%${query}%`} OR
            "abcIdNumber" ILIKE ${`%${query}%`} OR
            "firstName" ILIKE ${`%${query}%`} OR
            "middleName" ILIKE ${`%${query}%`} OR
            "lastName" ILIKE ${`%${query}%`} OR
            "aadharNumber" ILIKE ${`%${query}%`}
          )`
        );
      }
      
      if (surname) {
        queryConditions.push(
          Prisma.sql`(
            "fullName" ILIKE ${`%${surname}%`} OR
            "lastName" ILIKE ${`%${surname}%`} OR
            "fatherLastName" ILIKE ${`%${surname}%`}
          )`
        );
      }
      
      // Combine all conditions
      const whereClause = queryConditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(queryConditions, ' AND ')}`
        : Prisma.empty;
      
      // Get total count for pagination
      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "Student" ${whereClause}
      `;
      const totalCount = Number(totalResult[0].count);
      
      // Get matching records
      const students = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Student" 
        ${whereClause}
        ORDER BY "fullName" ASC
        LIMIT ${limit} OFFSET ${skip}
      `;
      
      // Log for debugging
      console.log(`Search for "${query}" found ${students.length} results`);
      
      return NextResponse.json({
        total: totalCount,
        page,
        limit,
        data: students
      });
    } catch (dbError) {
      console.error('Database error in search:', dbError);
      
      // Fallback for search with no database access
      return NextResponse.json({
        total: 0,
        page,
        limit,
        data: [],
        message: "Database search unavailable. Please try again later."
      });
    }
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