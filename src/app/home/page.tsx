'use client';

import React, { useState, useEffect } from 'react';
import { parse } from 'csv-parse/sync';
import { toast } from 'react-hot-toast';
import { Menu, Bell, User, Search } from 'lucide-react';

import { StudentInfo } from '../types/student';
import { StudentDetails } from '../components/StudentDetails';
import { StudentListPopup } from '../components/StudentListPopup';
import { NotificationsPopup } from '../components/NotificationsPopup';
import { SettingsMenu } from '../components/SettingsMenu';
import { Tooltip } from '../components/Tooltip';
import { StudentSearch } from '../components/StudentSearch';
import LoadingSpinner from '../components/LoadingSpinner';

// Fallback data as a constant to ensure data availability
const FALLBACK_DATA = `SRNO,REGISTRATION_NO,ENROLLMENT NUMBER,ROLLNO,NAME,FIRSTNAME,MIDDLE NAME,LAST NAME,MOBILE NO.,EMAILID,DOB,GENDER,FATHERNAME,FATHERMOBILE
1,REG20230001,ENRL20230001,ROLL001,John Demo Smith,John,Demo,Smith,9876543210,john.smith@example.com,2000-01-15,Male,Robert Smith,9876543211
2,REG20230002,ENRL20230002,ROLL002,Jane Demo Doe,Jane,Demo,Doe,9876543212,jane.doe@example.com,2001-05-20,Female,Michael Doe,9876543213`;

export default function HomePage() {
  const [studentData, setStudentData] = useState<StudentInfo | null>(null);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<StudentInfo[]>([]);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        console.log("Attempting to load student data from API...");
        
        // Try to use the API with the PostgreSQL database
        const response = await fetch('/api/data');
        
        if (!response.ok) {
          throw new Error(`API error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("Successfully loaded data from API");
        
        if (responseData.data && Array.isArray(responseData.data)) {
          setStudents(responseData.data);
          setIsLoading(false);
          return;
        }
        
        // If we got CSV data instead of JSON, parse it
        const csvText = await response.text();
        
        // Parse the CSV data
        console.log("Parsing CSV data...");
        const records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });

        const parsedStudents = records.map((record: any) => {
          // Compose full name from first, middle and last name fields
          const firstName = record['FIRSTNAME'] || '';
          const middleName = record['MIDDLE NAME'] || '';
          const lastName = record['LAST NAME'] || '';
          
          // Use NAME field if available, otherwise compose from name parts
          const fullName = record['NAME'] || 
            [firstName, middleName, lastName]
              .filter(Boolean)
              .join(' ')
              .trim();
              
          return {
            fullName: fullName,
            fatherName: record['FATHERNAME'] || '',
            fatherMiddleName: record['FATHERMIDDLENAME'] || '',
            fatherLastName: record['FATHERLASTNAME'] || '',
            motherName: record['MOTHERNAME'] || '',
            enrollmentNumber: record['ENROLLMENT NUMBER'] || '',
            registrationNumber: record['REGISTRATION_NO'] || '',
            rollNumber: record['ROLLNO'] || '',
            mobileNumber: record['MOBILE NO.'] || '',
            alternateMobileNumber: record['STUDENT MOBILE NO.2'] || '',
            emailId: record['EMAILID'] || '',
            dateOfBirth: record['DOB'] || '',
            birthPlace: record['BIRTH_PLACE'] || '',
            gender: record['GENDER'] || '',
            nationality: record['NATIONALITY'] || '',
            bloodGroup: record['BLOOD GROUP'] || '',
            religion: record['RELIGION'] || '',
            category: record['CATEGORY'] || '',
            subCaste: record['SUB_CASTE'] || '',
            handicapStatus: record['PHYSICALLY_HANDICAPPED'] || '',
            aadharNumber: record['ADHAAR NO'] || '',
            admissionThrough: record['ADMISSION THROUGH'] || '',
            isHosteller: record['HOSTELLER'] === 'YES',
            areBothParentsAlive: record['IS PARENTS ALIVE'] === 'YES',
            fatherMobileNumber: record['FATHERMOBILE'] || '',
            fatherOccupation: record["FATHER'S OCCUPATION"] || '',
            fatherQualification: record["FATHER'S QUALIFICATION"] || '',
            motherMobileNumber: record['MOTHERMOBILE'] || '',
            motherOccupation: record["MOTHER'S OCCUPATION"] || '',
            motherQualification: record["MOTHER'S QUALIFICATION"] || '',
            permanentAddress: {
              addressLine: record['ADDRESS(PERMANANT)'] || '',
              village: record['CITY/VILLAGE(PERMANANT)'] || '',
              taluka: record['TALUKA_PERMANANT'] || '',
              district: record['DISTRICT_PERMANANT'] || '',
              state: record['STATE_PERMANANT'] || '',
              landlineNo: record['LANDLINE_PERMANANT'] || '',
              areaPostOffice: record['AREA POST OFFICE'] || '',
              areaPoliceStation: record['AREA POLICE STATION'] || '',
              pinCode: record['PIN_PER'] || ''
            },
            localAddress: {
              addressLine: record['ADDRESS(LOCAL)'] || '',
              village: record['CITY/VILLAGE(LOCAL)'] || '',
              taluka: record['TALUKA_LOCAL'] || '',
              district: record['DISTRICT_LOCAL'] || '',
              state: record['STATE_LOCAL'] || '',
              landlineNo: record['LANDLINE_LOCAL'] || '',
              areaPostOffice: record['AREA POST OFFICE LOCAL'] || '',
              areaPoliceStation: record['AREA POLICE STATION LOCAL'] || '',
              pinCode: record['PIN_LOCAL'] || ''
            },
            guardianName: record['GUARDIAN NAME'] || '',
            guardianContactNo: record['GUARDIAN CONTACT NO'] || '',
            relationWithGuardian: record['RELATION WITH GUARDIAN'] || '',
            guardianOccupation: record['GUARDIAN OCCUPATION'] || '',
            guardianQualification: record['GUARDIAN QUALIFICATION'] || '',
            admissionDate: record['ADMISSION DATE'] || '',
            programLevel: record['PROGRAM LEVEL'] || '',
            collegeName: record['SCHOOL/COLLEGE'] || '',
            degree: record['DEGREE'] || '',
            branch: record['PROGRAMME/BRANCH'] || '',
            language: record['MEDIUM OF INSTRUCTION'] || '',
            admissionBatch: record['ADMISSION BATCH'] || '',
            year: record['YEAR'] || '',
            semester: record['SEMESTER'] || '',
            academicYear: record['ACADEMIC YEAR'] || '',
            tenthBoard: record['10TH BOARD'] || '',
            tenthYear: record['10TH YEAR OF EXAM'] || '',
            tenthMedium: record['10TH MEDIUM'] || '',
            tenthMarks: record['10TH MARKS OBTAINED'] || ''
          };
        });

        setStudents(parsedStudents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading student data:', error);
        toast.error('Failed to load student data');
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleSearchResults = (foundStudents: StudentInfo[]) => {
    setSearchResults(foundStudents);
    
    if (foundStudents.length > 1) {
      setIsStudentListOpen(true);
    }
  };

  const handleSelectStudent = (student: StudentInfo) => {
    setStudentData(student);
    setIsStudentListOpen(false);
    toast.success(`Selected: ${student.fullName}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Sherlock
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Tooltip content="Notifications">
                <button 
                  className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  onClick={() => setIsNotificationsOpen(true)}
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
              </Tooltip>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Admin User</span>
              </div>
              <SettingsMenu />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <button 
                  className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
                  onClick={() => setIsNotificationsOpen(true)}
                >
                  <Bell className="w-6 h-6 mr-2" />
                  <span>Notifications</span>
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Admin User</span>
                </div>
                <SettingsMenu />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <StudentSearch 
          onSearchResults={handleSearchResults}
          onSelectStudent={handleSelectStudent}
        />

        {/* Student Details */}
        {studentData ? (
          <StudentDetails student={studentData} />
        ) : (
          <div className="max-w-4xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-gray-600 dark:text-gray-400 mb-2">No student selected. Use the search above to find students.</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Try searching with: 
              <ul className="mt-2 list-disc list-inside">
                <li>Enrollment Number (e.g., ENR12345)</li>
                <li>Full Name (e.g., BORKAR ABHA)</li>
                <li>Registration Number</li>
                <li>Mobile Number</li>
              </ul>
            </p>
          </div>
        )}
        
        {/* Student List Popup */}
        <StudentListPopup 
          students={searchResults}
          isOpen={isStudentListOpen}
          onClose={() => setIsStudentListOpen(false)}
          onSelectStudent={handleSelectStudent}
        />
        
        {/* Notifications Popup */}
        <NotificationsPopup 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </main>
    </div>
  );
}