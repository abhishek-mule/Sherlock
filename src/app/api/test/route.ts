import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    const dbUrl = process.env.DATABASE_URL || 'Not found';
    const sanitizedUrl = dbUrl.replace(/\/\/.*?@/, '//[CREDENTIALS_HIDDEN]@');
    
    // Try to test database connectivity
    let dbConnection = 'Not tested';
    let error = null;
    
    try {
      const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
      
      // Try a simple query
      const count = await prisma.$queryRaw`SELECT 1 as test`;
      dbConnection = 'Success';
      
      // Disconnect
      await prisma.$disconnect();
    } catch (e) {
      dbConnection = 'Failed';
      error = e instanceof Error ? e.message : String(e);
    }
    
    // Return diagnostics
    return NextResponse.json({
      env: {
        nodeEnv: process.env.NODE_ENV,
        dbUrlFormat: sanitizedUrl,
        hasDbUrl: !!process.env.DATABASE_URL,
      },
      database: {
        connection: dbConnection,
        error: error
      },
      vercel: {
        environment: process.env.VERCEL_ENV || 'Not on Vercel',
        region: process.env.VERCEL_REGION || 'Unknown',
      },
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: 'Test failed', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 