import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function importCsvToDatabase() {
  try {
    console.log('Starting CSV import...');
    
    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'students.csv');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Error: students.csv file not found');
      // Create sample data instead
      await createSampleStudentData();
      return;
    }
    
    try {
      // Read the file
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Parse CSV with more relaxed options
      const records = parse(fileContents, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true, // Allow inconsistent column counts
        trim: true,               // Trim whitespace
        skip_records_with_error: true // Skip records that cause errors
      });
      
      console.log(`Found ${records.length} student records in CSV`);
      
      // Process records
      await processRecords(records);
      
    } catch (csvError) {
      console.error('Error parsing CSV:', csvError);
      console.log('Falling back to creating sample data...');
      await createSampleStudentData();
    }
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function processRecords(records: any[]) {
  // Track progress
  let processed = 0;
  let skipped = 0;
  let created = 0;
  
  // Process records in batches to avoid memory issues
  for (const record of records) {
    try {
      // Convert data types and map CSV columns to database fields
      const studentData = mapRecordToStudentData(record);
      
      // Skip records without enrollmentNumber or fullName
      if (!studentData.enrollmentNumber && !studentData.fullName) {
        console.warn(`Skipping record with no enrollment number or name`);
        skipped++;
        processed++;
        continue;
      }
      
      // Check if student already exists to avoid duplicates
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { enrollmentNumber: studentData.enrollmentNumber || '' },
            { fullName: studentData.fullName }
          ]
        }
      });
      
      if (existingStudent) {
        // Update existing student
        await prisma.student.update({
          where: {
            id: existingStudent.id
          },
          data: studentData
        });
        console.log(`Updated student: ${studentData.fullName} (${studentData.enrollmentNumber || 'No enrollment number'})`);
      } else {
        // Create new student
        await prisma.student.create({
          data: studentData
        });
        created++;
        console.log(`Created student: ${studentData.fullName} (${studentData.enrollmentNumber || 'No enrollment number'})`);
      }
      
      processed++;
      
      // Log progress
      if (processed % 10 === 0) {
        console.log(`Processed ${processed}/${records.length} records...`);
      }
    } catch (error) {
      console.error(`Error processing record:`, error);
      skipped++;
      processed++;
    }
  }
  
  console.log(`CSV import completed!`);
  console.log(`Total records: ${records.length}`);
  console.log(`Processed: ${processed}`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
}

function mapRecordToStudentData(record: any) {
  // Handle various CSV column naming formats
  const enrollmentKey = findFirstMatchingKey(record, ['ENROLLMENT NUMBER', 'ENROLLMENT_NUMBER', 'enrollmentNumber']);
  const fullNameKey = findFirstMatchingKey(record, ['FULLNAME', 'NAME', 'FULL_NAME', 'fullName']);
  const regNoKey = findFirstMatchingKey(record, ['REGISTRATION_NO', 'REGISTRATION NUMBER', 'REG_NO', 'registrationNo']);
  
  return {
    srNo: getValueSafely(record, ['SR.NO.', 'SRNO', 'SR_NO', 'srNo']),
    registrationNo: getValueSafely(record, [regNoKey, 'REGISTRATION_NO', 'REG_NO']),
    enrollmentNumber: getValueSafely(record, [enrollmentKey, 'ENROLLMENT']),
    rollNumber: getValueSafely(record, ['ROLLNO', 'ROLL_NUMBER', 'ROLL_NO', 'rollNumber']),
    fullName: getValueSafely(record, [fullNameKey, 'NAME']) || 'Unknown Student',
    firstName: getValueSafely(record, ['FIRSTNAME', 'FIRST_NAME', 'firstName']),
    middleName: getValueSafely(record, ['MIDDLENAME', 'MIDDLE_NAME', 'MIDDLE NAME', 'middleName']),
    lastName: getValueSafely(record, ['LASTNAME', 'LAST_NAME', 'LAST NAME', 'lastName']),
    mobileNumber: getValueSafely(record, ['MOBILE NO', 'MOBILE_NO', 'MOBILE NO.', 'mobileNumber']),
    emailId: getValueSafely(record, ['EMAIL ID', 'EMAILID', 'EMAIL', 'emailId']),
    gender: getValueSafely(record, ['GENDER', 'gender']),
    nationality: getValueSafely(record, ['NATIONALITY', 'nationality']),
    bloodGroup: getValueSafely(record, ['BLOOD GROUP', 'BLOOD_GROUP', 'bloodGroup']),
    physicallyHandicapped: getValueSafely(record, ['PHYSICALLY HANDICAPPED', 'PHYSICALLY_HANDICAPPED']) === 'YES',
    religion: getValueSafely(record, ['RELIGION', 'religion']),
    category: getValueSafely(record, ['CATEGORY', 'category']),
    subcategory: getValueSafely(record, ['SUB CATEGORY', 'SUB_CATEGORY', 'SUB_CASTE', 'subcategory']),
    admissionType: getValueSafely(record, ['ADMISSION TYPE', 'ADMISSION_TYPE', 'admissionType']),
    aadharNumber: getValueSafely(record, ['AADHAR NUMBER', 'AADHAR_NUMBER', 'ADHAAR NO', 'aadharNumber']),
    abcIdNumber: getValueSafely(record, ['ABC ID NUMBER', 'ABC_ID_NUMBER', 'abcIdNumber']),
    
    // Father's Information
    fatherName: getValueSafely(record, ['FATHER NAME', 'FATHERNAME', 'fatherName']),
    fatherMobileNumber: getValueSafely(record, ['FATHER MOBILE NO', 'FATHER_MOBILE_NO', 'FATHERMOBILE', 'fatherMobileNumber']),
    fatherOccupation: getValueSafely(record, ['FATHER OCCUPATION', 'FATHER_OCCUPATION', "FATHER'S OCCUPATION", 'fatherOccupation']),
    fatherQualification: getValueSafely(record, ['FATHER QUALIFICATION', 'FATHER_QUALIFICATION', "FATHER'S QUALIFICATION", 'fatherQualification']),
    
    // Mother's Information
    motherName: getValueSafely(record, ['MOTHER NAME', 'MOTHERNAME', 'motherName']),
    motherMobileNumber: getValueSafely(record, ['MOTHER MOBILE NO', 'MOTHER_MOBILE_NO', 'MOTHERMOBILE', 'motherMobileNumber']),
    motherOccupation: getValueSafely(record, ['MOTHER OCCUPATION', 'MOTHER_OCCUPATION', "MOTHER'S OCCUPATION", 'motherOccupation']),
    motherQualification: getValueSafely(record, ['MOTHER QUALIFICATION', 'MOTHER_QUALIFICATION', "MOTHER'S QUALIFICATION", 'motherQualification']),
    
    // Address Information
    permanentAddressLine: getValueSafely(record, ['ADDRESS(PERMANANT)', 'P.ADDRESS', 'PERMANENT_ADDRESS', 'permanentAddressLine']),
    permanentCity: getValueSafely(record, ['CITY/VILLAGE(PERMANANT)', 'P.CITY', 'PERMANENT_CITY', 'permanentCity']),
    permanentState: getValueSafely(record, ['STATE_PERMANANT', 'P.STATE', 'PERMANENT_STATE', 'permanentState']),
    permanentPincode: getValueSafely(record, ['PIN_PER', 'P.PINCODE', 'PERMANENT_PINCODE', 'permanentPincode']),
    
    localAddressLine: getValueSafely(record, ['ADDRESS(LOCAL)', 'L.ADDRESS', 'LOCAL_ADDRESS', 'localAddressLine']),
    localCity: getValueSafely(record, ['CITY/VILLAGE(LOCAL)', 'L.CITY', 'LOCAL_CITY', 'localCity']),
    localState: getValueSafely(record, ['STATE_LOCAL', 'L.STATE', 'LOCAL_STATE', 'localState']),
    localPincode: getValueSafely(record, ['PIN_LOCAL', 'L.PINCODE', 'LOCAL_PINCODE', 'localPincode']),
    
    // Academic Information
    admissionDate: parseDate(getValueSafely(record, ['ADMISSION DATE', 'ADMISSION_DATE', 'admissionDate'])),
    programLevel: getValueSafely(record, ['PROGRAM LEVEL', 'PROGRAM_LEVEL', 'programLevel']),
    degree: getValueSafely(record, ['DEGREE', 'degree']),
    branch: getValueSafely(record, ['PROGRAMME/BRANCH', 'BRANCH', 'branch']),
    medium: getValueSafely(record, ['MEDIUM OF INSTRUCTION', 'MEDIUM', 'medium']),
    academicYear: getValueSafely(record, ['ACADEMIC YEAR', 'ACADEMIC_YEAR', 'academicYear']),
    currentYear: parseInt(getValueSafely(record, ['YEAR', 'CURRENT_YEAR', 'currentYear']) || '0') || null,
    currentSemester: parseInt(getValueSafely(record, ['SEMESTER', 'CURRENT_SEMESTER', 'currentSemester']) || '0') || null,
    
    // College
    collegeName: getValueSafely(record, ['SCHOOL/COLLEGE', 'COLLEGE NAME', 'COLLEGE_NAME', 'collegeName']),
    status: getValueSafely(record, ['STATUS', 'status']),
  };
}

// Helper to find the first matching key in a record
function findFirstMatchingKey(record: any, possibleKeys: string[]): string {
  for (const key of possibleKeys) {
    if (record[key] !== undefined) {
      return key;
    }
  }
  return '';
}

// Helper to safely get values from a record with multiple possible key names
function getValueSafely(record: any, possibleKeys: string[]): string | null {
  for (const key of possibleKeys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return record[key].toString();
    }
  }
  return null;
}

// Helper to parse dates safely
function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch (e) {
    return null;
  }
}

// Create sample student data for testing if CSV import fails
async function createSampleStudentData() {
  console.log('Creating sample student data...');
  
  // Sample student data
  const sampleStudents = [
    {
      fullName: 'Tejas Choudhari',
      enrollmentNumber: '230110683',
      registrationNo: '254',
      rollNumber: '23CT1001',
      firstName: 'Tejas',
      lastName: 'Choudhari',
      mobileNumber: '9356802767',
      emailId: 'tejaschoudhari008@gmail.com',
      gender: 'MALE',
      nationality: 'INDIAN',
      bloodGroup: 'O-',
      religion: 'HINDU',
      category: 'OBC',
      aadharNumber: '680032023149',
      fatherName: 'ATUL SUDHAKAR CHOUDHARI',
      fatherMobileNumber: '9923215904',
      fatherOccupation: 'Farmer',
      motherName: 'SHUBHANGI',
      motherMobileNumber: '9359740857',
      motherOccupation: 'House Wife',
      permanentAddressLine: '32,zingabai takli mata nagargodhani road nagpur 440030.',
      permanentCity: 'Nagpur',
      permanentState: 'MAHARASHTRA',
      permanentPincode: '440030',
      programLevel: 'UG',
      degree: 'B.Tech',
      branch: 'Computer Technology',
      collegeName: 'Priyadarshini College of Engineering',
      status: 'ADMITTED'
    },
    {
      fullName: 'Rahul Sharma',
      enrollmentNumber: '230110684',
      registrationNo: '255',
      rollNumber: '23CT1002',
      firstName: 'Rahul',
      lastName: 'Sharma',
      mobileNumber: '9876543210',
      emailId: 'rahul.sharma@example.com',
      gender: 'MALE',
      nationality: 'INDIAN',
      bloodGroup: 'A+',
      religion: 'HINDU',
      category: 'GENERAL',
      programLevel: 'UG',
      degree: 'B.Tech',
      branch: 'Computer Technology',
      collegeName: 'Priyadarshini College of Engineering',
      status: 'ADMITTED'
    },
    {
      fullName: 'Priya Patel',
      enrollmentNumber: '230110685',
      registrationNo: '256',
      rollNumber: '23CT1003',
      firstName: 'Priya',
      lastName: 'Patel',
      mobileNumber: '9876543211',
      emailId: 'priya.patel@example.com',
      gender: 'FEMALE',
      nationality: 'INDIAN',
      bloodGroup: 'B+',
      religion: 'HINDU',
      category: 'OBC',
      programLevel: 'UG',
      degree: 'B.Tech',
      branch: 'Computer Technology',
      collegeName: 'Priyadarshini College of Engineering',
      status: 'ADMITTED'
    }
  ];
  
  let created = 0;
  
  for (const student of sampleStudents) {
    try {
      // Check if student already exists
      const existingStudent = await prisma.student.findUnique({
        where: {
          enrollmentNumber: student.enrollmentNumber
        }
      });
      
      if (!existingStudent) {
        await prisma.student.create({
          data: student
        });
        created++;
        console.log(`Created sample student: ${student.fullName}`);
      } else {
        console.log(`Sample student already exists: ${student.fullName}`);
      }
    } catch (error) {
      console.error(`Error creating sample student ${student.fullName}:`, error);
    }
  }
  
  console.log(`Created ${created} sample students for testing`);
}

// Run the import
importCsvToDatabase()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  }); 