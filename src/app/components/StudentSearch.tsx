import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Sparkles, User, BookOpen } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="ml-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">Intelligent Student Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4">
          Student Information System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Search for students using their name, enrollment number, registration number or mobile number
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform transition-all hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <User className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
              Name, ID or Contact
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700/50 dark:text-white"
                placeholder="Enter name, enrollment number, or mobile"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              Example: John Smith, ENR12345, 9876543210
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <BookOpen className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
              Surname (Optional)
            </label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700/50 dark:text-white"
              placeholder="Enter surname"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              Add surname to narrow your search results
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={isSearching || (!searchQuery.trim() && !surname.trim())}
            className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium 
              hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg
              flex items-center justify-center space-x-2 ${isSearching || (!searchQuery.trim() && !surname.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSearching ? (
              <LoadingSpinner className="w-5 h-5" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search Students</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-full py-1.5 px-3 flex items-center text-xs font-medium text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          <span>Pro tip: Use full name for more accurate results</span>
        </div>
      </div>
    </div>
  );
} 