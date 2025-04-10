const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking student data in the database...');
    
    // Get total student count
    const totalCount = await prisma.student.count();
    console.log(`Total students in the database: ${totalCount}`);
    
    if (totalCount > 0) {
      // Get sample of 3 students
      const sampleStudents = await prisma.student.findMany({
        take: 3,
        select: {
          id: true,
          fullName: true,
          enrollmentNumber: true,
          emailId: true
        }
      });
      
      console.log('\nSample of student records:');
      sampleStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName} (${student.enrollmentNumber}) - ${student.emailId || 'No email'}`);
      });
      
      // Get count by gender
      const genderCount = await prisma.$queryRaw`
        SELECT gender, COUNT(*) as count 
        FROM students 
        GROUP BY gender
      `;
      
      console.log('\nStudents by gender:');
      genderCount.forEach(g => {
        console.log(`${g.gender || 'Unknown'}: ${g.count}`);
      });
    }
    
    console.log('\nDatabase check completed.');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 