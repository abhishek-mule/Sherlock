import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';
import { StudentInfo } from '../types/student';
import LoadingSpinner from './LoadingSpinner';

interface StudentSearchProps {
  onSearchResults: (students: StudentInfo[]) => void;
  onSelectStudent: (student: StudentInfo) => void;
}

export function StudentSearch({ onSearchResults, onSelectStudent }: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [surname, setSurname] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !surname.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    try {
      // Build the search URL with query parameters
      const searchParams = new URLSearchParams();
      if (searchQuery.trim()) {
        searchParams.append('q', searchQuery.trim());
      }
      if (surname.trim()) {
        searchParams.append('surname', surname.trim());
      }
      
      // Call the search API endpoint
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search API error! status: ${response.status}`);
      }
      
      const searchData = await response.json();
      console.log(`API search found ${searchData.total} results`);
      
      if (searchData.data && Array.isArray(searchData.data) && searchData.data.length > 0) {
        const foundStudents = searchData.data;
        
        // Pass search results back to parent component
        onSearchResults(foundStudents);
        
        // If only one student found, also select it
        if (foundStudents.length === 1) {
          onSelectStudent(foundStudents[0]);
          toast.success(`Found student: ${foundStudents[0].fullName}`);
        } else {
          toast.success(`Found ${foundStudents.length} matching students. Select one from the list.`);
        }
      } else {
        // No students found
        onSearchResults([]);
        toast.error('No student found. Try using enrollment number or full name.', {
          duration: 5000, // Show for 5 seconds
        });
      }
    } catch (error) {
      console.error('Error searching student data:', error);
      toast.error('Error searching for student');
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle pressing Enter in search inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                placeholder="Enter name, enrollment number, or mobile"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
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
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
              placeholder="Enter surname"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching || (!searchQuery.trim() && !surname.trim())}
          className={`mt-6 w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium 
            hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] 
            flex items-center justify-center space-x-2 ${isSearching || (!searchQuery.trim() && !surname.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      
      {/* Helper text */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Search by full name, enrollment number, registration number, mobile number, or email</p>
      </div>
    </div>
  );
} 