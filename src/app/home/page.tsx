'use client';

import React, { useState, useEffect } from 'react';
import { parse } from 'csv-parse/sync';
import { toast } from 'react-hot-toast';
import { Menu, Bell, User, Search, MoonStar, Sun, LayoutDashboard } from 'lucide-react';

import { StudentInfo } from '../types/student';
import { StudentDetails } from '../components/StudentDetails';
import { StudentListPopup } from '../components/StudentListPopup';
import { NotificationsPopup } from '../components/NotificationsPopup';
import { SettingsMenu } from '../components/SettingsMenu';
import { Tooltip } from '../components/Tooltip';
import { StudentSearch } from '../components/StudentSearch';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from 'next-themes';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <LoadingSpinner className="w-16 h-16 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Loading Student Data</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Sherlock
                </span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Tooltip content="Toggle Theme">
            <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <MoonStar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
            </button>
              </Tooltip>

              <Tooltip content="Notifications">
                <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Tooltip>

              <Tooltip content="Account Settings">
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Account Settings"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Tooltip>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 mt-3">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <MoonStar className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                  )}
                  <span>Toggle Theme</span>
                </button>
                <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                  <span>Notifications</span>
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                  <span>Account Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search Section */}
        <StudentSearch 
          onSearchResults={handleSearchResults}
          onSelectStudent={handleSelectStudent}
        />

        {/* Student Details */}
        {studentData ? (
          <StudentDetails student={studentData} />
        ) : (
          <div className="max-w-4xl mx-auto mt-8 text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Student Selected</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Use the search above to find and view student information.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Try searching with: 
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Enrollment Number (e.g., ENR12345)
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Full Name (e.g., BORKAR ABHA)
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Registration Number
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Mobile Number
                </li>
              </ul>
            </div>
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
        
        {/* Settings Menu (if implemented) */}
        {isSettingsOpen && (
          <SettingsMenu 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Sherlock Student Information System. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}