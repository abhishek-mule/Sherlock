'use client';

import { Search, Bell, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { StudentInfo } from '../types/student';
import { StudentDetails } from '../components/StudentDetails';
import { parse } from 'csv-parse/sync';
import { SettingsMenu } from '../components/SettingsMenu';
import { Tooltip } from '../components/Tooltip';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { StudentListPopup } from '../components/StudentListPopup';
import { NotificationsPanel } from '../components/NotificationsPanel';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [surname, setSurname] = useState('');
  const [studentData, setStudentData] = useState<StudentInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
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
        // Try multiple ways to load student data
        console.log("Attempting to load student data...");
        
        let csvText = null;
        let error = null;
        
        // Try option 1: API route
        try {
          console.log("Attempting API route: /api/data");
          const apiResponse = await fetch('/api/data');
          if (!apiResponse.ok) throw new Error(`API error! status: ${apiResponse.status}`);
          csvText = await apiResponse.text();
          console.log("Successfully loaded data from API route");
        } catch (err) {
          console.warn("API route failed:", err);
          error = err;
          
          // Try option 2: Public directory
          try {
            console.log("Attempting public path: /data/students.csv");
            const publicResponse = await fetch('/data/students.csv');
            if (!publicResponse.ok) throw new Error(`Public path error! status: ${publicResponse.status}`);
            csvText = await publicResponse.text();
            console.log("Successfully loaded data from public path");
          } catch (err2) {
            console.warn("Public path failed:", err2);
            error = err2;
            
            // Try option 3: Static path in Vercel
            try {
              console.log("Attempting static path: /public/data/students.csv");
              const staticResponse = await fetch('/public/data/students.csv');
              if (!staticResponse.ok) throw new Error(`Static path error! status: ${staticResponse.status}`);
              csvText = await staticResponse.text();
              console.log("Successfully loaded data from static path");
            } catch (err3) {
              console.warn("Static path failed:", err3);
              error = err3;
            }
          }
        }
        
        if (!csvText) {
          console.warn("All data loading methods failed, using minimal fallback data");
          // Minimal fallback data as a CSV string
          csvText = `SRNO,REGISTRATION_NO,ENROLLMENT NUMBER,ROLLNO,NAME,FIRSTNAME,MIDDLE NAME,LAST NAME,MOBILE NO.,EMAILID,DOB,GENDER,FATHERNAME,FATHERMOBILE
1,REG20230001,ENRL20230001,ROLL001,John Demo Smith,John,Demo,Smith,9876543210,john.smith@example.com,2000-01-15,Male,Robert Smith,9876543211
2,REG20230002,ENRL20230002,ROLL002,Jane Demo Doe,Jane,Demo,Doe,9876543212,jane.doe@example.com,2001-05-20,Female,Michael Doe,9876543213`;
          
          toast.error("Using demo data. Server data couldn't be loaded.");
        }
        
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
            motherMobileNumber: record['MOTHERMOBILE'] || '',
            fatherQualification: record["FATHER'S QUALIFICATION"] || '',
            fatherOccupation: record["FATHER'S OCCUPATION"] || '',
            fatherEmail: record['FATHER EMAIL'] || '',
            annualFamilyIncome: record['ANNUAL FAMILY INCOME'] || '',
            motherQualification: record["MOTHER'S QUALIFICATION"] || '',
            motherOccupation: record["MOTHER'S OCCUPATION"] || '',
            motherEmail: record['MOTHER EMAIL'] || '',
            motherOfficePhone: record["MOTHER'S OFFICE PHONE NO"] || '',
            socialCategory: record['SOCIAL CATEGORY'] || '',
            permanentAddress: {
              village: record['CITY/VILLAGE(PERMANANT)'] || '',
              taluka: record['TALUKA(PERMANENT)'] || '',
              district: record['DISTRICT_PERMANANT'] || '',
              state: record['STATE_PERMANANT'] || '',
              areaPostOffice: record['AREA POST OFFICE'] || '',
              areaPoliceStation: record['AREA POLICE STATION'] || '',
              pinCode: record['PIN_PER'] || ''
            },
            localAddress: {
              village: record['CITY/VILLAGE(LOCAL)'] || '',
              taluka: record['TALUKA(LOCAL)'] || '',
              district: record['DISTRICT_LOCAL'] || '',
              state: record['STATE_LOCAL'] || '',
              areaPostOffice: record['AREA POST OFFICE LOCAL'] || '',
              areaPoliceStation: record['AREA POLICE STATION LOCAL'] || '',
              pinCode: record['PIN_LOCAL'] || ''
            },
            guardianName: record['GUARDIAN NAME'] || '',
            guardianQualification: record['GUARDIAN QUALIFICATION'] || '',
            admissionDate: record['ADMISSION DATE'] || '',
            programLevel: record['PROGRAM LEVEL'] || '',
            admissionDegree: record['ADMISSION CATEGORY'] || '',
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Split the query into multiple search terms for more flexible searching
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      const surnameTerms = surname.toLowerCase().split(/\s+/).filter(Boolean);
      
      const allSearchTerms = [...searchTerms, ...surnameTerms];
      
      // If no search terms, exit early
      if (allSearchTerms.length === 0) {
        setIsSearching(false);
        return;
      }
      
      const foundStudents = students.filter(student => {
        // Extract name parts for more flexible search
        const nameParts = student.fullName ? student.fullName.toLowerCase().split(/\s+/) : [];
        const fatherNameParts = [
          student.fatherName, 
          student.fatherMiddleName, 
          student.fatherLastName
        ].filter(Boolean).join(' ').toLowerCase().split(/\s+/);
        
        const searchableFields = [
          ...nameParts,
          student.enrollmentNumber,
          student.registrationNumber,
          student.rollNumber,
          student.emailId,
          student.mobileNumber,
          student.birthPlace?.toLowerCase(),
          student.dateOfBirth,
          student.subCaste?.toLowerCase(),
          ...fatherNameParts
        ].map(field => field?.toLowerCase() || '');

        // Check if any of the search terms match any of the searchable fields
        // For single term searches, partial matches are fine
        if (allSearchTerms.length === 1) {
          const term = allSearchTerms[0];
          return searchableFields.some(field => field.includes(term));
        } 
        
        // For multi-term searches, try to match all terms across any fields
        // Count how many terms were matched
        const matchedTerms = allSearchTerms.filter(term => 
          searchableFields.some(field => field.includes(term))
        );
        
        // Return true if at least half of the terms were matched
        return matchedTerms.length >= Math.max(1, Math.floor(allSearchTerms.length / 2));
      });

      if (foundStudents.length > 0) {
        // If only one student found, display it directly
        if (foundStudents.length === 1) {
          setStudentData(foundStudents[0]);
        } else {
          // For multiple matches, show the popup with all matches
          setSearchResults(foundStudents);
          setIsStudentListOpen(true);
          // Also set the first student to display as default
          setStudentData(foundStudents[0]);
          toast.success(`Found ${foundStudents.length} matching students. Select one from the list.`);
        }
      } else {
        setStudentData(null);
        toast.error('No student found with the provided details');
      }
    } catch (error) {
      console.error('Error searching student data:', error);
      toast.error('Error searching for student');
      setStudentData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = (student: StudentInfo) => {
    setStudentData(student);
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
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Student Information Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter student details to access their information
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                  Name or ID
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    placeholder="Enter name, ID, birth place or sub-caste"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                  Surname (Optional)
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                  placeholder="Enter surname"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`mt-6 w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium 
                hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] 
                flex items-center justify-center space-x-2 ${isSearching || !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSearching ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Students</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Student Details */}
        {studentData ? (
          <StudentDetails student={studentData} />
        ) : searchQuery && !isSearching && (
          <div className="max-w-4xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-gray-600 dark:text-gray-400">No student found with the provided details.</p>
          </div>
        )}
        
        {/* Student List Popup */}
        <StudentListPopup 
          students={searchResults}
          isOpen={isStudentListOpen}
          onClose={() => setIsStudentListOpen(false)}
          onSelectStudent={handleSelectStudent}
        />
      </main>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}