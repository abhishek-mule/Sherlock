'use client';

import { StudentInfo } from '../types/student';
import { X, Search, GraduationCap, User, BookOpen, Phone } from 'lucide-react';

interface StudentListPopupProps {
  students: StudentInfo[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: StudentInfo) => void;
}

export function StudentListPopup({ 
  students, 
  isOpen, 
  onClose, 
  onSelectStudent 
}: StudentListPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                Student Results
              </h2>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Found {students.length} matching records
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {students.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No students found</p>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try modifying your search criteria to find more results
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <li 
                  key={student.enrollmentNumber || student.registrationNumber || student.fullName} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectStudent(student);
                    onClose();
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex-1 flex">
                        <div className="flex-shrink-0 flex items-start pt-1">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {student.fullName}
                          </h3>
                          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {student.enrollmentNumber && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500 dark:text-blue-400" />
                                <span>{student.enrollmentNumber}</span>
                              </p>
                            )}
                            {student.registrationNumber && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400" />
                                <span>{student.registrationNumber}</span>
                              </p>
                            )}
                            {student.mobileNumber && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <Phone className="w-3.5 h-3.5 mr-1.5 text-orange-500 dark:text-orange-400" />
                                <span>{student.mobileNumber}</span>
                              </p>
                            )}
                            {student.branch && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                                <span>{student.branch}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 self-center">
                        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors">
                          <Search className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium shadow-sm border border-gray-200 dark:border-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 