export interface StudentInfo {
  // System Information
  srNo?: string;
  
  // Personal Information
  registrationNumber: string;
  enrollmentNumber: string;
  abcIdNumber?: string;
  rollNumber: string;
  admissionType?: string;
  fullName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  mobileNumber: string;
  studentMobileNo2?: string;
  alternateMobileNumber: string;
  emailId: string;
  alternateEmailId?: string;
  dateOfBirth: string;
  birthPlace: string;
  gender: string;
  nationality: string;
  bloodGroup: string;
  maritalStatus?: string;
  religion: string;
  category: string;
  subCaste: string;
  physicallyHandicapped?: string;
  typeOfDisability?: string;
  aadharNumber: string | number;
  passportNo?: string;
  admissionThrough: string;
  isHosteller: boolean;
  transportation?: string;
  areBothParentsAlive: boolean;

  // Parent Information
  fatherName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherMobileNumber: string;
  fathersAlternateMobileNo?: string;
  fathersOfficePhoneNo?: string;
  fatherQualification: string;
  fatherOccupation: string;
  fatherEmail: string;
  annualFamilyIncome: string;
  motherName: string;
  motherMobileNumber: string;
  mothersAlternateMobileNo?: string;
  motherQualification: string;
  motherOccupation: string;
  motherEmail: string;
  motherOfficePhone: string;
  socialCategory: string;

  // Address Information
  permanentAddress: {
    addressLine?: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    landlineNo?: string;
    areaPostOffice: string;
    areaPoliceStation: string;
    pinCode: string;
  };
  localAddress: {
    addressLine?: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    landlineNo?: string;
    areaPostOffice: string;
    areaPoliceStation: string;
    pinCode: string;
  };

  // Guardian Information
  guardianName: string;
  guardianContactNo?: string;
  relationWithGuardian?: string;
  guardianOccupation?: string;
  guardianQualification: string;

  // Academic Information
  admissionDate: string;
  admissionType1?: string;
  programLevel: string;
  admissionCategory?: string;
  collegeName: string;
  degree: string;
  branch: string;
  language: string;
  admissionBatch: string;
  year: string;
  semester: string;
  academicYear: string;
  uploadedDocuments?: string;

  // 10th Education Details
  tenthSchoolCollegeName?: string;
  tenthBoard: string;
  tenthYear: string;
  tenthMedium: string;
  tenthMarksObtained?: string;
  tenthOutOfMarks?: string;
  tenthPercentile?: string;
  tenthSeatNo?: string;
  tenthSchoolCollegeAddress?: string;

  // 12th Education Details
  twelfthSchoolCollegeName?: string;
  twelfthBoard?: string;
  twelfthYearOfExam?: string;
  twelfthMedium?: string;
  twelfthSeatNo?: string;
  twelfthPhysicsObtMarks?: string;
  twelfthPhysicsTotalMarks?: string;
  twelfthChemistryObtMarks?: string;
  twelfthChemistryTotalMarks?: string;
  twelfthMathObtMarks?: string;
  twelfthMathTotalMarks?: string;
  twelfthPCMObtMarks?: string;
  twelfthPCMPercentage?: string;
  twelfthVocationalSubject?: string;
  twelfthVocObtainedMarks?: string;
  twelfthVocTotalMarks?: string;
  twelfthMarksObtained?: string;
  twelfthOutOfMarks?: string;
  twelfthPercentile?: string;
  twelfthSchoolCollegeAddress?: string;

  // Diploma Details
  diplomaSchoolCollegeName?: string;
  diplomaBoard?: string;
  diplomaYearOfExam?: string;
  diplomaMedium?: string;
  diplomaMarksObtained?: string;
  diplomaOutOfMarks?: string;
  diplomaPercentile?: string;
  diplomaSeatNo?: string;
  diplomaSchoolCollegeAddress?: string;

  // Entrance Exam Details
  entranceExam?: string;
  entranceExamName?: string;
  entranceExamSeatNo?: string;
  entranceExamYear?: string;
  entranceExamPercentile?: string;
  entranceExamRank?: string;

  // Last Qualification Details
  lastQualification?: string;
  lastQualificationSchoolCollegeName?: string;
  lastQualificationBoard?: string;
  lastQualificationQualifyingExam?: string;
  lastQualificationSeatNo?: string;
  lastQualificationYearOfExam?: string;
  lastQualificationMarkObtained?: string;
  lastQualificationOutOfMarks?: string;
  lastQualificationPercentage?: string;
  lastQualificationGrade?: string;
  lastQualificationDGPACGPA?: string;
  lastQualificationCollegeAddress?: string;

  // PhD Details
  phdSchoolCollegeName?: string;
  phdBoard?: string;
  phdQualifyingExam?: string;
  phdYearOfExam?: string;
  phdSeatNo?: string;
  phdMarksObtained?: string;
  phdOutOfMarks?: string;
  phdPercentage?: string;
  phdGrade?: string;
  phdSchoolCollegeAddress?: string;

  // COVID Vaccination Details
  isVaccinated?: string;
  vaccineName?: string;
  firstDoseVaccinationCenter?: string;
  secondDoseVaccinationCenter?: string;
  firstDoseVaccinatedDate?: string;
  secondDoseVaccinatedDate?: string;

  // Additional Personal Details
  motherTongue?: string;
  otherLanguage?: string;
  identificationMark?: string;
  height?: string;
  weight?: string;

  // Bank Details
  bankName?: string;
  ifscCode?: string;
  bankAddress?: string;

  // Sports Details
  sportName?: string;
  sportLevel?: string;
  achievementDetails?: string;

  // Administrative Details
  informationVerified?: string;
  paymentType?: string;
  admittedStatus?: string;
  admissionStatus?: string;
  integratedApplicationId?: string;
  
  tenthMarks: string; // Keep this for backward compatibility
}