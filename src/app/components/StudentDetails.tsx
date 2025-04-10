import { StudentInfo } from '../types/student';
import { Eye, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { StudentOsintInfo } from './StudentOsintInfo';
import { OsintDisclaimer } from './OsintDisclaimer';

interface StudentDetailsProps {
  student: StudentInfo | null;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const [isOsintOpen, setIsOsintOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  
  if (!student) return null;

  const handleOsintButtonClick = () => {
    setIsDisclaimerOpen(true);
  };

  const handleDisclaimerAccept = () => {
    setIsDisclaimerOpen(false);
    setIsOsintOpen(true);
  };

  // Format and validate Aadhar number to ensure it's a 12-digit number
  const formatAadharNumber = (aadhar: string | number | undefined) => {
    if (!aadhar) return 'Not provided';
    
    // Convert to string first
    const aadharStr = String(aadhar);
    
    // Remove any decimal part and non-digit characters
    const aadharInt = aadharStr.split('.')[0].replace(/\D/g, '');
    
    // Validate that it's 12 digits
    if (aadharInt.length === 12) {
      // Format with proper spacing for readability: XXXX XXXX XXXX
      return `${aadharInt.slice(0, 4)} ${aadharInt.slice(4, 8)} ${aadharInt.slice(8, 12)}`;
    }
    
    // Show error message if not 12 digits
    return `${aadharInt} (Invalid: must be 12 digits)`;
  };

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: `${student.fullName || ''}` },
        { label: 'Enrollment Number', value: student.enrollmentNumber },
        { label: 'Registration Number', value: student.registrationNumber },
        { label: 'Roll Number', value: student.rollNumber },
        { label: 'ABC ID Number', value: student.abcIdNumber },
        { label: 'Mobile Number', value: student.mobileNumber },
        { label: 'Mobile Number 2', value: student.studentMobileNo2 },
        { label: 'Alternate Mobile', value: student.alternateMobileNumber },
        { label: 'Email ID', value: student.emailId },
        { label: 'Alternate Email', value: student.alternateEmailId },
        { label: 'Date of Birth', value: student.dateOfBirth },
        { label: 'Birth Place', value: student.birthPlace },
        { label: 'Gender', value: student.gender },
        { label: 'Nationality', value: student.nationality },
        { label: 'Blood Group', value: student.bloodGroup },
        { label: 'Marital Status', value: student.maritalStatus },
        { label: 'Religion', value: student.religion },
        { label: 'Category', value: student.category },
        { label: 'Sub Caste', value: student.subCaste },
        { label: 'Physically Handicapped', value: student.physicallyHandicapped },
        { label: 'Type of Disability', value: student.typeOfDisability },
        { label: 'Aadhar Number', value: formatAadharNumber(student.aadharNumber) },
        { label: 'Passport Number', value: student.passportNo },
        { label: 'Mother Tongue', value: student.motherTongue },
        { label: 'Other Languages', value: student.otherLanguage },
        { label: 'Identification Mark', value: student.identificationMark },
        { label: 'Height', value: student.height },
        { label: 'Weight', value: student.weight },
      ]
    },
    {
      title: 'Family Information',
      fields: [
        { 
          label: "Father's Name", 
          value: `${student.fatherName || ''} ${student.fatherMiddleName || ''} ${student.fatherLastName || ''}`.trim() 
        },
        { label: "Mother's Name", value: student.motherName },
        { label: "Father's Mobile", value: student.fatherMobileNumber },
        { label: "Father's Alt. Mobile", value: student.fathersAlternateMobileNo },
        { label: "Father's Office Phone", value: student.fathersOfficePhoneNo },
        { label: "Mother's Mobile", value: student.motherMobileNumber },
        { label: "Mother's Alt. Mobile", value: student.mothersAlternateMobileNo },
        { label: "Mother's Office Phone", value: student.motherOfficePhone },
        { label: "Father's Qualification", value: student.fatherQualification },
        { label: "Father's Occupation", value: student.fatherOccupation },
        { label: "Father's Email", value: student.fatherEmail },
        { label: "Mother's Qualification", value: student.motherQualification },
        { label: "Mother's Occupation", value: student.motherOccupation },
        { label: "Mother's Email", value: student.motherEmail },
        { label: 'Annual Family Income', value: student.annualFamilyIncome },
        { label: 'Social Category', value: student.socialCategory },
        { label: 'Both Parents Alive', value: student.areBothParentsAlive ? 'Yes' : 'No' },
      ]
    },
    {
      title: 'Academic Information',
      fields: [
        { label: 'Admission Date', value: student.admissionDate },
        { label: 'Admission Type', value: student.admissionType },
        { label: 'Admission Type 1', value: student.admissionType1 },
        { label: 'Admission Category', value: student.admissionCategory },
        { label: 'Admission Through', value: student.admissionThrough },
        { label: 'Program Level', value: student.programLevel },
        { label: 'College Name', value: student.collegeName },
        { label: 'Degree', value: student.degree },
        { label: 'Branch', value: student.branch },
        { label: 'Medium of Instruction', value: student.language },
        { label: 'Admission Batch', value: student.admissionBatch },
        { label: 'Current Year', value: student.year },
        { label: 'Semester', value: student.semester },
        { label: 'Academic Year', value: student.academicYear },
        { label: 'Hosteller', value: student.isHosteller ? 'Yes' : 'No' },
        { label: 'Transportation', value: student.transportation },
      ]
    },
    {
      title: '10th Education',
      fields: [
        { label: 'School Name', value: student.tenthSchoolCollegeName },
        { label: 'Board', value: student.tenthBoard },
        { label: 'Year of Exam', value: student.tenthYear },
        { label: 'Medium', value: student.tenthMedium },
        { label: 'Marks Obtained', value: student.tenthMarksObtained || student.tenthMarks },
        { label: 'Out of Marks', value: student.tenthOutOfMarks },
        { label: 'Percentile', value: student.tenthPercentile },
        { label: 'Seat Number', value: student.tenthSeatNo },
        { label: 'School Address', value: student.tenthSchoolCollegeAddress },
      ]
    },
    {
      title: '12th Education',
      fields: [
        { label: 'School Name', value: student.twelfthSchoolCollegeName },
        { label: 'Board', value: student.twelfthBoard },
        { label: 'Year of Exam', value: student.twelfthYearOfExam },
        { label: 'Medium', value: student.twelfthMedium },
        { label: 'Seat Number', value: student.twelfthSeatNo },
        { label: 'Physics Marks', value: student.twelfthPhysicsObtMarks ? `${student.twelfthPhysicsObtMarks}/${student.twelfthPhysicsTotalMarks}` : '' },
        { label: 'Chemistry Marks', value: student.twelfthChemistryObtMarks ? `${student.twelfthChemistryObtMarks}/${student.twelfthChemistryTotalMarks}` : '' },
        { label: 'Math Marks', value: student.twelfthMathObtMarks ? `${student.twelfthMathObtMarks}/${student.twelfthMathTotalMarks}` : '' },
        { label: 'PCM Total', value: student.twelfthPCMObtMarks },
        { label: 'PCM Percentage', value: student.twelfthPCMPercentage },
        { label: 'Vocational Subject', value: student.twelfthVocationalSubject },
        { label: 'Vocational Marks', value: student.twelfthVocObtainedMarks ? `${student.twelfthVocObtainedMarks}/${student.twelfthVocTotalMarks}` : '' },
        { label: 'Total Marks', value: student.twelfthMarksObtained ? `${student.twelfthMarksObtained}/${student.twelfthOutOfMarks}` : '' },
        { label: 'Percentile', value: student.twelfthPercentile },
        { label: 'School Address', value: student.twelfthSchoolCollegeAddress },
      ]
    },
    {
      title: 'Diploma Information',
      fields: [
        { label: 'Institute Name', value: student.diplomaSchoolCollegeName },
        { label: 'Board', value: student.diplomaBoard },
        { label: 'Year of Exam', value: student.diplomaYearOfExam },
        { label: 'Medium', value: student.diplomaMedium },
        { label: 'Marks Obtained', value: student.diplomaMarksObtained ? `${student.diplomaMarksObtained}/${student.diplomaOutOfMarks}` : '' },
        { label: 'Percentile', value: student.diplomaPercentile },
        { label: 'Seat Number', value: student.diplomaSeatNo },
        { label: 'Institute Address', value: student.diplomaSchoolCollegeAddress },
      ]
    },
    {
      title: 'Entrance Exam',
      fields: [
        { label: 'Entrance Exam', value: student.entranceExam },
        { label: 'Exam Name', value: student.entranceExamName },
        { label: 'Seat Number', value: student.entranceExamSeatNo },
        { label: 'Year of Exam', value: student.entranceExamYear },
        { label: 'Percentile', value: student.entranceExamPercentile },
        { label: 'Rank', value: student.entranceExamRank },
      ]
    },
    {
      title: 'COVID-19 Vaccination',
      fields: [
        { label: 'Vaccinated', value: student.isVaccinated },
        { label: 'Vaccine Name', value: student.vaccineName },
        { label: '1st Dose Center', value: student.firstDoseVaccinationCenter },
        { label: '1st Dose Date', value: student.firstDoseVaccinatedDate },
        { label: '2nd Dose Center', value: student.secondDoseVaccinationCenter },
        { label: '2nd Dose Date', value: student.secondDoseVaccinatedDate },
      ]
    },
    {
      title: 'Other Details',
      fields: [
        { label: 'Bank Name', value: student.bankName },
        { label: 'IFSC Code', value: student.ifscCode },
        { label: 'Bank Address', value: student.bankAddress },
        { label: 'Sport Name', value: student.sportName },
        { label: 'Sport Level', value: student.sportLevel },
        { label: 'Achievement Details', value: student.achievementDetails },
      ]
    },
  ];

  // Filter sections to only show those with at least one value
  const filteredSections = sections.filter(section => 
    section.fields.some(field => field.value)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mt-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h2>
        <button 
          onClick={handleOsintButtonClick}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-200 hover:bg-orange-300 dark:bg-orange-700 dark:hover:bg-orange-600 text-orange-900 dark:text-white rounded-lg transition-colors"
          aria-label="View OSINT Data"
        >
          <Eye className="w-4 h-4 text-orange-800 dark:text-orange-100" />
          <span className="font-medium">View OSINT Data</span>
          <AlertTriangle className="w-4 h-4 text-orange-700 dark:text-orange-100" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {filteredSections.slice(0, 4).map((section) => (
          <div key={section.title} className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.filter(field => field.value).map((field) => (
                <div key={field.label} className="space-y-1 hover:bg-white dark:hover:bg-gray-600 p-2 rounded-md transition-colors">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {field.label}
                  </span>
                  <p className="text-gray-900 dark:text-white break-words font-medium">
                    {field.value || 'Not provided'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Education Sections */}
      {filteredSections.length > 4 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {filteredSections.slice(4).map((section) => (
            <div key={section.title} className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.filter(field => field.value).map((field) => (
                  <div key={field.label} className="space-y-1 hover:bg-white dark:hover:bg-gray-600 p-2 rounded-md transition-colors">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {field.label}
                    </span>
                    <p className="text-gray-900 dark:text-white break-words font-medium">
                      {field.value || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Information */}
      <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-2 bg-white dark:bg-gray-600 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white">Permanent Address</h4>
            <address className="not-italic text-gray-800 dark:text-gray-100 space-y-1">
              {student.permanentAddress.addressLine && <p>{student.permanentAddress.addressLine}</p>}
              {student.permanentAddress.village && <p>{student.permanentAddress.village}</p>}
              {(student.permanentAddress.taluka || student.permanentAddress.district) && (
                <p>
                  {student.permanentAddress.taluka && `${student.permanentAddress.taluka}, `} 
                  {student.permanentAddress.district}
                </p>
              )}
              {(student.permanentAddress.state || student.permanentAddress.pinCode) && (
                <p>
                  {student.permanentAddress.state} 
                  {student.permanentAddress.pinCode && ` - ${student.permanentAddress.pinCode}`}
                </p>
              )}
              {student.permanentAddress.landlineNo && <p>Landline: {student.permanentAddress.landlineNo}</p>}
              {student.permanentAddress.areaPostOffice && <p>Post Office: {student.permanentAddress.areaPostOffice}</p>}
              {student.permanentAddress.areaPoliceStation && <p>Police Station: {student.permanentAddress.areaPoliceStation}</p>}
            </address>
          </div>
          <div className="space-y-2 bg-white dark:bg-gray-600 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white">Local Address</h4>
            <address className="not-italic text-gray-800 dark:text-gray-100 space-y-1">
              {student.localAddress.addressLine && <p>{student.localAddress.addressLine}</p>}
              {student.localAddress.village && <p>{student.localAddress.village}</p>}
              {(student.localAddress.taluka || student.localAddress.district) && (
                <p>
                  {student.localAddress.taluka && `${student.localAddress.taluka}, `} 
                  {student.localAddress.district}
                </p>
              )}
              {(student.localAddress.state || student.localAddress.pinCode) && (
                <p>
                  {student.localAddress.state} 
                  {student.localAddress.pinCode && ` - ${student.localAddress.pinCode}`}
                </p>
              )}
              {student.localAddress.landlineNo && <p>Landline: {student.localAddress.landlineNo}</p>}
              {student.localAddress.areaPostOffice && <p>Post Office: {student.localAddress.areaPostOffice}</p>}
              {student.localAddress.areaPoliceStation && <p>Police Station: {student.localAddress.areaPoliceStation}</p>}
            </address>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      {student.guardianName && (
        <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
            Guardian Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 bg-white dark:bg-gray-600 p-3 rounded-lg">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guardian Name</span>
              <p className="text-gray-900 dark:text-white font-medium">{student.guardianName}</p>
            </div>
            {student.guardianContactNo && (
              <div className="space-y-1 bg-white dark:bg-gray-600 p-3 rounded-lg">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Number</span>
                <p className="text-gray-900 dark:text-white font-medium">{student.guardianContactNo}</p>
              </div>
            )}
            {student.relationWithGuardian && (
              <div className="space-y-1 bg-white dark:bg-gray-600 p-3 rounded-lg">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Relation</span>
                <p className="text-gray-900 dark:text-white font-medium">{student.relationWithGuardian}</p>
              </div>
            )}
            {student.guardianOccupation && (
              <div className="space-y-1 bg-white dark:bg-gray-600 p-3 rounded-lg">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Occupation</span>
                <p className="text-gray-900 dark:text-white font-medium">{student.guardianOccupation}</p>
              </div>
            )}
            {student.guardianQualification && (
              <div className="space-y-1 bg-white dark:bg-gray-600 p-3 rounded-lg">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Qualification</span>
                <p className="text-gray-900 dark:text-white font-medium">{student.guardianQualification}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* OSINT Disclaimer */}
      <OsintDisclaimer 
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleDisclaimerAccept}
      />
      
      {/* OSINT Information Modal */}
      {student && (
        <StudentOsintInfo 
          student={student} 
          isOpen={isOsintOpen} 
          onClose={() => setIsOsintOpen(false)} 
        />
      )}
    </div>
  );
}