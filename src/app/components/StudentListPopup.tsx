'use client';

import { StudentInfo } from '../types/student';
import { X, Search } from 'lucide-react';

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-100 dark:bg-blue-800/50">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-white">
            Multiple Students Found ({students.length})
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {students.length === 0 ? (
            <div className="p-6 text-center text-gray-700 dark:text-gray-300">
              <p>No students found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <li 
                  key={student.enrollmentNumber || student.registrationNumber || student.fullName} 
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectStudent(student);
                    onClose();
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {student.fullName}
                        </h3>
                        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {student.enrollmentNumber && (
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">Enrollment:</span> {student.enrollmentNumber}
                            </p>
                          )}
                          {student.registrationNumber && (
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">Registration:</span> {student.registrationNumber}
                            </p>
                          )}
                          {student.rollNumber && (
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">Roll No:</span> {student.rollNumber}
                            </p>
                          )}
                          {student.branch && (
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">Branch:</span> {student.branch}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 self-center text-blue-600 dark:text-blue-400">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-100 dark:bg-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 