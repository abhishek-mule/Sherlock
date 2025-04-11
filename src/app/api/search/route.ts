import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

// Don't initialize Prisma at the module level for build
// Instead, create a function to get the Prisma client
function getPrismaClient() {
  console.log("Initializing Prisma client with connection string...");
  // Log a sanitized version of the connection string for debugging
  const dbUrl = process.env.DATABASE_URL || 'No database URL found in environment';
  const sanitizedUrl = dbUrl.replace(/\/\/.*?@/, '//[CREDENTIALS_HIDDEN]@');
  console.log(`Database URL format: ${sanitizedUrl}`);
  
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
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
      console.log('Database search unavailable. Using fallback data.');
      
      // Provide a minimal fallback with a few sample students
      const fallbackStudents = [
        {
          id: 1,
          fullName: "CHOUDHARI TEJAS ATUL",
          firstName: "tejas",
          middleName: "atul",
          lastName: "choudhari",
          enrollmentNumber: "230110683",
          rollNumber: "254",
          mobileNumber: "9356802767",
          emailId: "tejaschoudhari008@gmail.com",
          dateOfBirth: null,
          birthPlace: "NAGPUR",
          gender: "MALE",
          nationality: "INDIAN",
          bloodGroup: "O-",
          religion: "HINDU",
          category: "OBC",
          branch: "Computer Technology",
          semester: "3",
          admissionDate: "Saturday, 5 August, 2023",
          degree: "B.Tech"
        },
        {
          id: 2,
          fullName: "DEMO STUDENT",
          firstName: "DEMO",
          middleName: "",
          lastName: "STUDENT",
          enrollmentNumber: "123456789",
          rollNumber: "101",
          mobileNumber: "9876543210",
          emailId: "demo@example.com",
          dateOfBirth: null,
          birthPlace: "MUMBAI",
          gender: "FEMALE",
          nationality: "INDIAN",
          bloodGroup: "B+",
          religion: "HINDU",
          category: "GENERAL",
          branch: "Information Technology",
          semester: "5",
          admissionDate: "Monday, 1 August, 2022",
          degree: "B.Tech"
        }
      ];
      
      // Filter the fallback data to match the search query
      const filteredStudents = fallbackStudents.filter(student => {
        // Check for match in any searchable field
        const matchesQuery = query ? 
          Object.values(student).some(val => 
            val && val.toString().toLowerCase().includes(query.toLowerCase())
          ) : true;
          
        const matchesSurname = surname ?
          (student.lastName && student.lastName.toLowerCase().includes(surname.toLowerCase())) : true;
          
        return matchesQuery && matchesSurname;
      });
      
      return NextResponse.json({
        total: filteredStudents.length,
        page,
        limit,
        data: filteredStudents,
        message: "Using fallback student data. Database search unavailable."
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