const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get command line arguments (node scripts/find-student.js [field] [value])
const args = process.argv.slice(2);
const searchField = args[0] || 'enrollmentNumber';
const searchValue = args[1] || '';

async function findStudent() {
  try {
    console.log(`Searching for student with ${searchField} = "${searchValue}"`);
    
    if (!searchValue) {
      console.log('\nUsage: node scripts/find-student.js [field] [value]');
      console.log('Example: node scripts/find-student.js enrollmentNumber ENR12345');
      console.log('\nAvailable search fields:');
      console.log('- id');
      console.log('- enrollmentNumber');
      console.log('- registrationNo');
      console.log('- rollNumber');
      console.log('- fullName');
      console.log('- emailId');
      console.log('- mobileNumber');
      
      // Instead show a list of 5 random students
      const sampleStudents = await prisma.student.findMany({
        take: 5,
        select: {
          id: true,
          fullName: true,
          enrollmentNumber: true,
          emailId: true,
          mobileNumber: true
        },
        orderBy: {
          id: 'asc'
        }
      });
      
      console.log('\nSample student records for reference:');
      sampleStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName} - Enrollment: ${student.enrollmentNumber}, Email: ${student.emailId || 'None'}, Mobile: ${student.mobileNumber || 'None'}`);
      });
      
      return;
    }
    
    // Create a dynamic query object
    let where = {};
    
    // Handle numeric id
    if (searchField === 'id' && !isNaN(parseInt(searchValue))) {
      where.id = parseInt(searchValue);
    } else {
      // For text fields, use contains for more flexible searching
      where[searchField] = {
        contains: searchValue,
        mode: 'insensitive'  // Case-insensitive search
      };
    }
    
    // Find students matching the criteria
    const students = await prisma.student.findMany({
      where,
      take: 10, // Limit to 10 results
      select: {
        id: true,
        fullName: true,
        enrollmentNumber: true,
        registrationNo: true,
        rollNumber: true,
        emailId: true,
        mobileNumber: true,
        gender: true
      }
    });
    
    if (students.length === 0) {
      console.log(`\nNo students found with ${searchField} containing "${searchValue}"`);
      
      // Suggest similar searches if it's a text field
      if (searchField !== 'id') {
        const partialMatches = await prisma.student.findMany({
          where: {
            [searchField]: {
              contains: searchValue.substring(0, Math.max(3, Math.floor(searchValue.length / 2))),
              mode: 'insensitive'
            }
          },
          take: 5,
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
            [searchField]: true
          }
        });
        
        if (partialMatches.length > 0) {
          console.log('\nPossible similar matches:');
          partialMatches.forEach((student, index) => {
            console.log(`${index + 1}. ${student.fullName} (${student.enrollmentNumber}) - ${searchField}: ${student[searchField]}`);
          });
        }
      }
      
      // Show all available values for the search field
      const distinctValues = await prisma.student.findMany({
        select: {
          [searchField]: true
        },
        distinct: [searchField],
        where: {
          [searchField]: {
            not: null
          }
        },
        take: 10
      });
      
      if (distinctValues.length > 0) {
        console.log(`\nSample available ${searchField} values in the database:`);
        distinctValues.forEach((item, index) => {
          console.log(`${index + 1}. ${item[searchField]}`);
        });
      }
    } else {
      console.log(`\nFound ${students.length} students:`);
      students.forEach((student, index) => {
        console.log(`\n${index + 1}. ID: ${student.id}`);
        console.log(`   Name: ${student.fullName}`);
        console.log(`   Enrollment: ${student.enrollmentNumber || 'Not set'}`);
        console.log(`   Registration: ${student.registrationNo || 'Not set'}`);
        console.log(`   Roll Number: ${student.rollNumber || 'Not set'}`);
        console.log(`   Email: ${student.emailId || 'Not set'}`);
        console.log(`   Mobile: ${student.mobileNumber || 'Not set'}`);
        console.log(`   Gender: ${student.gender || 'Not set'}`);
      });
    }
    
    // Show total count in database
    const totalCount = await prisma.student.count();
    console.log(`\nTotal students in database: ${totalCount}`);
    
  } catch (error) {
    console.error('Error searching for student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findStudent(); 