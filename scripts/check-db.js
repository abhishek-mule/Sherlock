const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Fetch students
    const students = await prisma.student.findMany({
      take: 5, // Limit to 5 records
    });
    
    console.log(`Successfully fetched ${students.length} students:`);
    
    // Print student information
    students.forEach((student, index) => {
      console.log(`\nStudent ${index + 1}:`);
      console.log(`  Name: ${student.fullName}`);
      console.log(`  Enrollment: ${student.enrollmentNumber}`);
      console.log(`  Email: ${student.emailId}`);
      console.log(`  Mobile: ${student.mobileNumber}`);
      console.log(`  Created: ${student.createdAt}`);
    });
    
    console.log('\nDatabase connection test successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 