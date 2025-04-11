import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

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
      
      // Fallback to CSV if database fails - only in runtime, not during build
      console.warn('Database connection failed, falling back to CSV file');
      
      try {
        // Only try to access the file system at runtime
        // Path to the CSV file in the public directory - adjusted for Vercel deployment
        const filePath = path.join(process.cwd(), 'public', 'data', 'students.csv');
        console.log(`Attempting to read CSV from: ${filePath}`);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error(`CSV file not found at ${filePath}`);
          // Try alternative path as fallback
          const altFilePath = path.join(process.cwd(), 'data', 'students.csv');
          console.log(`Trying alternative path: ${altFilePath}`);
          
          if (!fs.existsSync(altFilePath)) {
            console.error(`CSV file not found at alternative path ${altFilePath}`);
            throw new Error('CSV file not found in any location');
          }
          
          // Use alternative path if found
          const fileContents = fs.readFileSync(altFilePath, 'utf8');
          return new NextResponse(fileContents, {
            headers: {
              'Content-Type': 'text/csv',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            }
          });
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
      } catch (fsError) {
        console.error('File system error:', fsError);
        // Return fallback data if both database and file system fail
        console.log('Both database and CSV fallback failed. Using hardcoded fallback data.');
        
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
        
        return NextResponse.json({
          total: fallbackStudents.length,
          page,
          limit,
          data: fallbackStudents,
          message: "Using fallback student data. Database connection and CSV file access failed."
        });
      }
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