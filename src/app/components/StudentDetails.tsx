import { StudentInfo } from '../types/student';
import { Eye, AlertTriangle, User, BookOpen, Home, School, GraduationCap, Heart, Shield, Award, Database } from 'lucide-react';
import { useState } from 'react';
import { StudentOsintInfo } from './StudentOsintInfo';
import { OsintDisclaimer } from './OsintDisclaimer';

interface StudentDetailsProps {
  student: StudentInfo | null;
}

// Helper function to create a permanent address object from flat fields
const getPermanentAddress = (student: any) => {
  return {
    addressLine: student.permanentAddressLine || '',
    village: student.permanentVillage || '',
    taluka: student.permanentTaluka || '',
    district: student.permanentDistrict || '',
    state: student.permanentState || '',
    landlineNo: student.permanentLandline || '',
    areaPostOffice: student.permanentPostOffice || '',
    areaPoliceStation: student.permanentPoliceStation || '',
    pinCode: student.permanentPincode || '',
  };
};

// Helper function to create a local address object from flat fields
const getLocalAddress = (student: any) => {
  return {
    addressLine: student.localAddressLine || '',
    village: student.localVillage || '',
    taluka: student.localTaluka || '',
    district: student.localDistrict || '',
    state: student.localState || '',
    landlineNo: student.localLandline || '',
    areaPostOffice: student.localPostOffice || '',
    areaPoliceStation: student.localPoliceStation || '',
    pinCode: student.localPincode || '',
  };
};

interface SectionType {
  id: string;
  title: string;
  icon: React.ReactNode;
  fields?: { label: string; value: string | undefined }[];
  component?: React.ReactNode;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const [isOsintOpen, setIsOsintOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showAllInfo, setShowAllInfo] = useState(false);
  
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

  // Create address objects from flat fields if needed
  const permanentAddress = student.permanentAddress || getPermanentAddress(student);
  const localAddress = student.localAddress || getLocalAddress(student);
  
  // Now we have address objects whether the data came in flat or nested form

  const sections: SectionType[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User className="w-5 h-5" />,
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
      id: 'family',
      title: 'Family Information',
      icon: <Heart className="w-5 h-5" />,
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
      id: 'academic',
      title: 'Academic Information',
      icon: <GraduationCap className="w-5 h-5" />,
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
      id: 'tenth',
      title: '10th Education',
      icon: <School className="w-5 h-5" />,
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
      id: 'address',
      title: 'Address Information',
      icon: <Home className="w-5 h-5" />,
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3">
              <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              Permanent Address
            </h4>
            <address className="not-italic text-gray-800 dark:text-gray-200 space-y-1.5">
              {permanentAddress.addressLine && <p>{permanentAddress.addressLine}</p>}
              {permanentAddress.village && <p>{permanentAddress.village}</p>}
              {(permanentAddress.taluka || permanentAddress.district) && (
                <p>
                  {permanentAddress.taluka && `${permanentAddress.taluka}, `} 
                  {permanentAddress.district}
                </p>
              )}
              {(permanentAddress.state || permanentAddress.pinCode) && (
                <p>
                  {permanentAddress.state} 
                  {permanentAddress.pinCode && ` - ${permanentAddress.pinCode}`}
                </p>
              )}
              {permanentAddress.landlineNo && <p>Landline: {permanentAddress.landlineNo}</p>}
              {permanentAddress.areaPostOffice && <p>Post Office: {permanentAddress.areaPostOffice}</p>}
              {permanentAddress.areaPoliceStation && <p>Police Station: {permanentAddress.areaPoliceStation}</p>}
            </address>
          </div>
          <div className="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3">
              <Home className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              Local Address
            </h4>
            <address className="not-italic text-gray-800 dark:text-gray-200 space-y-1.5">
              {localAddress.addressLine && <p>{localAddress.addressLine}</p>}
              {localAddress.village && <p>{localAddress.village}</p>}
              {(localAddress.taluka || localAddress.district) && (
                <p>
                  {localAddress.taluka && `${localAddress.taluka}, `} 
                  {localAddress.district}
                </p>
              )}
              {(localAddress.state || localAddress.pinCode) && (
                <p>
                  {localAddress.state} 
                  {localAddress.pinCode && ` - ${localAddress.pinCode}`}
                </p>
              )}
              {localAddress.landlineNo && <p>Landline: {localAddress.landlineNo}</p>}
              {localAddress.areaPostOffice && <p>Post Office: {localAddress.areaPostOffice}</p>}
              {localAddress.areaPoliceStation && <p>Police Station: {localAddress.areaPoliceStation}</p>}
            </address>
          </div>
        </div>
      )
    }
  ];

  // Filter sections to only show those with at least one value
  const filteredSections = sections.filter(section => 
    section.fields ? section.fields.some(field => field.value) : true
  );

  // Create a special "View All" section that combines all fields from all sections
  const allFields = [];
  
  // Add all basic student information, dynamically generating fields from the student object
  for (const [key, value] of Object.entries(student)) {
    // Skip complex objects like addresses, we'll handle those separately
    if (typeof value !== 'object' && value !== null && value !== undefined && value !== '') {
      allFields.push({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value: value.toString()
      });
    }
  }

  const allInfoSection: SectionType = {
    id: 'all',
    title: 'All Information',
    icon: <Database className="w-5 h-5" />,
    component: (
      <div>
        {/* Display all fields from student object */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <Database className="w-5 h-5 mr-2" />
            All Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allFields.map((field) => (
              <div key={field.label} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 hover:shadow-sm">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  {field.label}
                </span>
                <p className="text-gray-900 dark:text-white font-medium break-words">
                  {field.value || 'Not provided'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Address section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <Home className="w-5 h-5 mr-2" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3">
                <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Permanent Address
              </h4>
              <address className="not-italic text-gray-800 dark:text-gray-200 space-y-1.5">
                {permanentAddress.addressLine && <p>{permanentAddress.addressLine}</p>}
                {permanentAddress.village && <p>{permanentAddress.village}</p>}
                {(permanentAddress.taluka || permanentAddress.district) && (
                  <p>
                    {permanentAddress.taluka && `${permanentAddress.taluka}, `} 
                    {permanentAddress.district}
                  </p>
                )}
                {(permanentAddress.state || permanentAddress.pinCode) && (
                  <p>
                    {permanentAddress.state} 
                    {permanentAddress.pinCode && ` - ${permanentAddress.pinCode}`}
                  </p>
                )}
                {permanentAddress.landlineNo && <p>Landline: {permanentAddress.landlineNo}</p>}
                {permanentAddress.areaPostOffice && <p>Post Office: {permanentAddress.areaPostOffice}</p>}
                {permanentAddress.areaPoliceStation && <p>Police Station: {permanentAddress.areaPoliceStation}</p>}
              </address>
            </div>
            <div className="bg-white dark:bg-gray-700 shadow-sm rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3">
                <Home className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Local Address
              </h4>
              <address className="not-italic text-gray-800 dark:text-gray-200 space-y-1.5">
                {localAddress.addressLine && <p>{localAddress.addressLine}</p>}
                {localAddress.village && <p>{localAddress.village}</p>}
                {(localAddress.taluka || localAddress.district) && (
                  <p>
                    {localAddress.taluka && `${localAddress.taluka}, `} 
                    {localAddress.district}
                  </p>
                )}
                {(localAddress.state || localAddress.pinCode) && (
                  <p>
                    {localAddress.state} 
                    {localAddress.pinCode && ` - ${localAddress.pinCode}`}
                  </p>
                )}
                {localAddress.landlineNo && <p>Landline: {localAddress.landlineNo}</p>}
                {localAddress.areaPostOffice && <p>Post Office: {localAddress.areaPostOffice}</p>}
                {localAddress.areaPoliceStation && <p>Police Station: {localAddress.areaPoliceStation}</p>}
              </address>
            </div>
          </div>
        </div>

        {/* Also display organized sections */}
        {sections.map(section => (
          section.fields && section.fields.some(field => field.value) ? (
            <div key={section.id} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {section.fields.filter(field => field.value).map((field: {label: string, value: string | undefined}) => (
                  <div key={`${section.id}-${field.label}`} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 hover:shadow-sm">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      {field.label}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium break-words">
                      {field.value || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    )
  };

  // Add the "All Information" section to the filtered sections
  const allSections = [allInfoSection, ...filteredSections];

  // Get the active section
  const activeSection = allSections.find(section => section.id === activeTab) || allSections[0];

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-8 mt-6 mx-auto max-w-6xl border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Database className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Student Record</span>
      </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              {student.fullName}
            </h2>
            <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
              {student.enrollmentNumber && (
                <span className="mr-3">Enrollment: <span className="font-medium text-gray-700 dark:text-gray-300">{student.enrollmentNumber}</span></span>
              )}
              {student.branch && (
                <span className="mr-3">Branch: <span className="font-medium text-gray-700 dark:text-gray-300">{student.branch}</span></span>
              )}
              {student.semester && (
                <span>Semester: <span className="font-medium text-gray-700 dark:text-gray-300">{student.semester}</span></span>
              )}
            </div>
          </div>
          <button 
            onClick={handleOsintButtonClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            aria-label="View OSINT Data"
          >
            <Eye className="w-4 h-4" />
            <span className="font-medium">OSINT Data</span>
            <AlertTriangle className="w-4 h-4" />
          </button>
              </div>
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {allSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex items-center px-4 py-2 mr-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === section.id 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          ))}
              </div>
        
        {/* Content Area */}
        <div className="min-h-[300px]">
          {activeSection.component ? (
            activeSection.component
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeSection.fields?.filter(field => field.value).map((field) => (
                <div key={field.label} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 hover:shadow-sm">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                    {field.label}
                  </span>
                  <p className="text-gray-900 dark:text-white font-medium break-words">
                    {field.value || 'Not provided'}
                  </p>
              </div>
              ))}
              </div>
            )}
          </div>
        </div>
      
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