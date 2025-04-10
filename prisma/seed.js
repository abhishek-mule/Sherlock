// @ts-check
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

// Environment flag to force reseeding (useful for development/testing)
const FORCE_RESEED = process.env.FORCE_RESEED === 'true';

async function main() {
  console.log('Seeding database...');
  
  // Check if students already exist
  const studentCount = await prisma.student.count();
  if (studentCount > 0 && !FORCE_RESEED) {
    console.log(`Database already contains ${studentCount} students. Skipping seed.`);
    console.log('To force reseeding, set FORCE_RESEED=true');
    return;
  }
  
  // If FORCE_RESEED is true and students exist, delete them first
  if (studentCount > 0 && FORCE_RESEED) {
    console.log(`Deleting ${studentCount} existing students for reseeding...`);
    await prisma.student.deleteMany({});
    console.log('Existing students deleted.');
  }
  
  // Load student data from CSV
  const csvPath = path.join(process.cwd(), 'data', 'students.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    return;
  }
  
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  console.log(`Parsed ${records.length} student records from CSV`);
  
  // Process and insert all student records, not just 5
  const totalRecords = records;
  let successCount = 0;
  let errorCount = 0;
  
  for (const record of totalRecords) {
    // Format the data to match the Student model
    const student = {
      srNo: record['SRNO'] || null,
      registrationNo: record['REGISTRATION_NO'] || null,
      enrollmentNumber: record['ENROLLMENT NUMBER'] || `ENR${Math.floor(Math.random() * 100000)}`,
      rollNumber: record['ROLLNO'] || null,
      fullName: record['NAME'] || '',
      firstName: record['FIRSTNAME'] || null,
      middleName: record['MIDDLE NAME'] || null,
      lastName: record['LAST NAME'] || null,
      mobileNumber: record['MOBILE NO.'] || null,
      alternateMobileNumber: record['STUDENT MOBILE NO.2'] || null,
      emailId: record['EMAILID'] || null,
      alternateEmailId: record['ALTERNATE EMAIL ID'] || null,
      gender: record['GENDER'] || null,
      nationality: record['NATIONALITY'] || null,
      bloodGroup: record['BLOOD GROUP'] || null,
      physicallyHandicapped: record['PHYSICALLY_HANDICAPPED'] === 'YES',
      religion: record['RELIGION'] || null,
      category: record['CATEGORY'] || null,
      subcategory: record['SUB_CASTE'] || null,
      admissionType: record['ADMISSION TYPE'] || null,
      aadharNumber: record['ADHAAR NO'] || null,
      abcIdNumber: record['ABC ID NUMBER'] || null,
      passportNumber: record['PASSPORT NO.'] || null,
      maritalStatus: record['MARITAL STATUS'] || null,
      
      // Father's Information
      fatherName: record['FATHERNAME'] || null,
      fatherMobileNumber: record['FATHERMOBILE'] || null,
      fatherOccupation: record["FATHER'S OCCUPATION"] || null,
      fatherQualification: record["FATHER'S QUALIFICATION"] || null,
      
      // Mother's Information
      motherName: record['MOTHERNAME'] || null,
      motherMobileNumber: record['MOTHERMOBILE'] || null,
      motherOccupation: record["MOTHER'S OCCUPATION"] || null,
      motherQualification: record["MOTHER'S QUALIFICATION"] || null,
      
      // Category Information
      castCategory: record['SOCIAL CATEGORY'] || null,
      
      // Permanent Address
      permanentAddressLine: record['ADDRESS(PERMANANT)'] || null,
      permanentCity: record['CITY/VILLAGE(PERMANANT)'] || null,
      permanentDistrict: record['DISTRICT_PERMANANT'] || null,
      permanentState: record['STATE_PERMANANT'] || null,
      permanentPincode: record['PIN_PER'] || null,
      permanentPostOffice: record['AREA POST OFFICE'] || null,
      permanentPoliceStation: record['AREA POLICE STATION'] || null,
      
      // Local Address
      localAddressLine: record['ADDRESS(LOCAL)'] || null,
      localCity: record['CITY/VILLAGE(LOCAL)'] || null,
      localDistrict: record['DISTRICT_LOCAL'] || null,
      localState: record['STATE_LOCAL'] || null,
      localPincode: record['PIN_LOCAL'] || null,
      localPostOffice: record['AREA POST OFFICE LOCAL'] || null,
      localPoliceStation: record['AREA POLICE STATION LOCAL'] || null,
      
      // Guardian Information
      guardianName: record['GUARDIAN NAME'] || null,
      guardianContactNo: record['GUARDIAN CONTACT NO'] || null,
      relationWithGuardian: record['RELATION WITH GUARDIAN'] || null,
      guardianOccupation: record['GUARDIAN OCCUPATION'] || null,
      guardianQualification: record['GUARDIAN QUALIFICATION'] || null,
      
      // Academic Information
      admissionDate: record['ADMISSION DATE'] ? new Date(record['ADMISSION DATE']) : null,
      programLevel: record['PROGRAM LEVEL'] || null,
      degree: record['DEGREE'] || null,
      branch: record['PROGRAMME/BRANCH'] || null,
      medium: record['MEDIUM OF INSTRUCTION'] || null,
      academicYear: record['ACADEMIC YEAR'] || null,
      currentYear: record['YEAR'] ? parseInt(record['YEAR'], 10) : null,
      currentSemester: record['SEMESTER'] ? parseInt(record['SEMESTER'], 10) : null,
      admissionCategory: record['ADMISSION CATEGORY'] || null,
      
      // 10th Details
      tenthSchoolName: record['10TH SCHOOL/COLLEGE NAME'] || null,
      tenthBoard: record['10TH BOARD'] || null,
      tenthYear: record['10TH YEAR OF EXAM'] || null,
      tenthMedium: record['10TH MEDIUM'] || null,
      tenthMarks: record['10TH MARKS OBTAINED'] ? parseFloat(record['10TH MARKS OBTAINED']) : null,
      tenthTotalMarks: record['10TH OUT OF MARKS'] ? parseFloat(record['10TH OUT OF MARKS']) : null,
      tenthPercentage: record['10TH PERCENTILE'] ? parseFloat(record['10TH PERCENTILE']) : null,
      
      // 12th Details
      twelfthSchoolName: record['12TH SCHOOL/COLLEGE NAME'] || null,
      twelfthBoard: record['12TH BOARD'] || null,
      twelfthYear: record['12TH YEAR OF EXAM'] || null,
      twelfthMedium: record['12TH MEDIUM'] || null,
      
      // Additional Fields
      collegeName: record['SCHOOL/COLLEGE'] || null,
    };
    
    try {
      await prisma.student.create({ data: student });
      successCount++;
      // Log progress every 5 students
      if (successCount % 5 === 0) {
        console.log(`Created ${successCount} students so far...`);
      }
    } catch (error) {
      console.error(`Error creating student ${student.fullName}:`, error);
      errorCount++;
    }
  }
  
  console.log(`Database seeding completed. Created ${successCount} students. Errors: ${errorCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 