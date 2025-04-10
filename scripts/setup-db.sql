-- This script should be run as the postgres superuser
-- It will create the 'abhi' user and set up permissions

-- Create the user if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'abhi'
  ) THEN
    CREATE USER abhi WITH PASSWORD 'abhi';
  END IF;
END
$$;

-- Grant necessary privileges
ALTER USER abhi WITH LOGIN;
ALTER USER abhi WITH CREATEDB;

-- Grant connection privileges
GRANT CONNECT ON DATABASE postgres TO abhi;

-- Connect to the postgres database to set schema privileges
\connect postgres;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO abhi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO abhi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO abhi;

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  "srNo" TEXT,
  "registrationNo" TEXT,
  "enrollmentNumber" TEXT UNIQUE,
  "rollNumber" TEXT,
  "fullName" TEXT NOT NULL,
  "firstName" TEXT,
  "middleName" TEXT,
  "lastName" TEXT,
  "mobileNumber" TEXT,
  "alternateMobileNumber" TEXT,
  "emailId" TEXT,
  "alternateEmailId" TEXT,
  "address" TEXT,
  "city" TEXT,
  "gender" TEXT,
  "nationality" TEXT,
  "bloodGroup" TEXT,
  "physicallyHandicapped" BOOLEAN DEFAULT FALSE,
  "religion" TEXT,
  "category" TEXT,
  "subcategory" TEXT,
  "admissionType" TEXT,
  "aadharNumber" TEXT,
  "abcIdNumber" TEXT,
  "passportNumber" TEXT,
  "maritalStatus" TEXT,
  "fatherName" TEXT,
  "fatherFirstName" TEXT,
  "fatherLastName" TEXT,
  "fatherMobileNumber" TEXT,
  "fatherAlternateMobile" TEXT,
  "fatherOfficePhone" TEXT,
  "fatherOccupation" TEXT,
  "fatherQualification" TEXT,
  "fatherAnnualIncome" TEXT,
  "motherName" TEXT,
  "motherMobileNumber" TEXT,
  "motherOccupation" TEXT,
  "motherQualification" TEXT,
  "castCategory" TEXT,
  "permanentAddressLine" TEXT,
  "permanentDistrict" TEXT,
  "permanentCity" TEXT,
  "permanentState" TEXT,
  "permanentCountry" TEXT,
  "permanentLandline" TEXT,
  "permanentPostOffice" TEXT,
  "permanentPoliceStation" TEXT,
  "permanentPincode" TEXT,
  "localAddressLine" TEXT,
  "localDistrict" TEXT,
  "localCity" TEXT,
  "localState" TEXT,
  "localCountry" TEXT,
  "localLandline" TEXT,
  "localPostOffice" TEXT,
  "localPoliceStation" TEXT,
  "localPincode" TEXT,
  "guardianName" TEXT,
  "guardianContactNo" TEXT,
  "relationWithGuardian" TEXT,
  "guardianOccupation" TEXT,
  "guardianQualification" TEXT,
  "admissionDate" TIMESTAMP,
  "programLevel" TEXT,
  "degree" TEXT,
  "branch" TEXT,
  "medium" TEXT,
  "academicYear" TEXT,
  "currentYear" INTEGER,
  "currentSemester" INTEGER,
  "admissionCategory" TEXT,
  "tenthSchoolName" TEXT,
  "tenthBoard" TEXT,
  "tenthYear" TEXT,
  "tenthMedium" TEXT,
  "tenthMarks" FLOAT,
  "tenthTotalMarks" FLOAT,
  "tenthPercentage" FLOAT,
  "tenthCertificateNo" TEXT,
  "twelfthSchoolName" TEXT,
  "twelfthBoard" TEXT,
  "twelfthYear" TEXT,
  "twelfthMedium" TEXT,
  "twelfthCertificateNo" TEXT,
  "physicsMarks" FLOAT,
  "physicsTotalMarks" FLOAT,
  "chemistryMarks" FLOAT,
  "chemistryTotalMarks" FLOAT,
  "mathsMarks" FLOAT,
  "mathsTotalMarks" FLOAT,
  "totalPCMMarks" FLOAT,
  "pcmPercentage" FLOAT,
  "twelfthStream" TEXT,
  "twelfthSubjectMarks" FLOAT,
  "twelfthSubjectTotal" FLOAT,
  "twelfthTotalMarks" FLOAT,
  "twelfthTotalOutOf" FLOAT,
  "twelfthPercentage" FLOAT,
  "collegeName" TEXT,
  "bankAccountNumber" TEXT,
  "remarks" TEXT,
  "status" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions on the students table
GRANT ALL PRIVILEGES ON TABLE students TO abhi;
GRANT USAGE, SELECT ON SEQUENCE students_id_seq TO abhi;

-- Confirm success
SELECT 'Setup completed successfully. You can now connect with: postgresql://abhi:abhi@localhost:5432/postgres' as "Success Message"; 