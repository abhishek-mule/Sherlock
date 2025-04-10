'use client';

import { StudentInfo } from '../types/student';
import { Search, Globe, Twitter, Instagram, Linkedin, Github, Mail, Phone, User, MapPin, Calendar, School, BookOpen, X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StudentOsintInfoProps {
  student: StudentInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentOsintInfo({ student, isOpen, onClose }: StudentOsintInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{[key: string]: any}>({});
  
  if (!isOpen) return null;

  // Simple name parsing that avoids using father's name
  const parseFullName = (fullName: string | undefined, fatherName?: string | undefined) => {
    if (!fullName) return { firstName: '', lastName: '' };
    
    // Clean and split the full name
    const nameParts = fullName.trim().split(/\s+/);
    
    // Check if father's name parts appear in the full name
    const fatherNameParts = fatherName ? fatherName.trim().split(/\s+/) : [];
    const fatherNameSet = new Set(fatherNameParts.map(part => part.toLowerCase()));
    
    // Handle different name formats
    if (nameParts.length === 1) {
      // Only one name - use as first name
      return { firstName: nameParts[0], lastName: '' };
    } else if (nameParts.length === 2) {
      // Likely first name and last name
      return { firstName: nameParts[0], lastName: nameParts[1] };
    } else {
      // For names with more than two parts
      
      // First part is typically the given name
      const firstName = nameParts[0];
      
      // Get the last part that's not matching father's name
      let lastName = '';
      for (let i = nameParts.length - 1; i > 0; i--) {
        if (!fatherNameSet.has(nameParts[i].toLowerCase())) {
          lastName = nameParts[i];
          break;
        }
      }
      
      // If no suitable lastName found, just use the last part
      if (!lastName) {
        lastName = nameParts[nameParts.length - 1];
      }
      
      return { firstName, lastName };
    }
  };
  
  // Parse the name - only get first and last name
  const { firstName, lastName } = parseFullName(student.fullName, student.fatherName);
  
  // Generate search URLs for different platforms
  const generateSearchUrls = () => {
    // Use both first and last name for most accurate searches
    const fullNameSearch = `${firstName} ${lastName}`.trim();
    const encodedName = encodeURIComponent(fullNameSearch);
    
    const collegeName = student.collegeName ? encodeURIComponent(student.collegeName) : '';
    
    return {
      google: `https://www.google.com/search?q=${encodedName}`,
      linkedin: collegeName ? 
        `https://www.linkedin.com/search/results/people/?keywords=${encodedName}&school=${collegeName}` : 
        `https://www.linkedin.com/search/results/people/?keywords=${encodedName}`,
      twitter: `https://twitter.com/search?q=${encodedName}&src=typed_query&f=user`,
      instagram: `https://www.instagram.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      github: `https://github.com/search?q=${encodedName}&type=users`,
      facebook: `https://www.facebook.com/search/people/?q=${encodedName}`,
      academicSearch: collegeName ? 
        `https://scholar.google.com/scholar?q=${encodedName}+${collegeName}` : 
        `https://scholar.google.com/scholar?q=${encodedName}`,
      imageSearch: `https://www.google.com/search?q=${encodedName}&tbm=isch`
    };
  };
  
  const searchUrls = generateSearchUrls();
  
  // Create username suggestions based on name
  const generateUsernames = () => {
    if (!firstName || !lastName) return [];
    
    const usernamePatterns = [
      // Standard patterns
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      
      // With first initial
      `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}`,
      
      // Reverse patterns sometimes used
      `${lastName.toLowerCase()}${firstName.toLowerCase()}`,
      `${lastName.toLowerCase()}.${firstName.toLowerCase()}`,
      
      // With numbers
      `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`
    ];
    
    return usernamePatterns;
  };
  
  const potentialUsernames = generateUsernames();
  
  // Generate email suggestions
  const generatePotentialEmails = () => {
    if (!firstName) return [];
    
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com'];
    const studentEmail = student.emailId || '';
    
    // Email patterns based on name components
    const patterns = [];
    
    // Standard patterns
    patterns.push(`${firstName.toLowerCase()}.${lastName.toLowerCase()}@DOMAIN`);
    patterns.push(`${firstName.toLowerCase()}${lastName.toLowerCase()}@DOMAIN`);
    
    // Initial patterns
    patterns.push(`${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@DOMAIN`);
    
    // Reverse patterns
    patterns.push(`${lastName.toLowerCase()}.${firstName.toLowerCase()}@DOMAIN`);
    
    const results = [];
    
    // Add student's own email if available
    if (studentEmail) results.push(studentEmail);
    
    // Generate emails using patterns and domains
    for (const pattern of patterns) {
      for (const domain of domains) {
        results.push(pattern.replace('DOMAIN', domain));
      }
    }
    
    return results.slice(0, 8); // Limit to 8 emails
  };
  
  const potentialEmails = generatePotentialEmails();
  
  // Generate domain search 
  const domainSearchUrls = potentialUsernames.slice(0, 3).map(username => 
    `https://whois.domaintools.com/${username}.com`
  );
  
  // Open link in new tab with safety checks
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  
  // Simulate running a real-time search
  const runSimulatedSearch = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      const searchData = {
        searchTime: new Date().toLocaleTimeString(),
        searchDate: new Date().toLocaleDateString(),
        searchTerms: `${firstName} ${lastName}`,
        collegeName: student.collegeName || '',
        possibleProfiles: {
          linkedin: Math.random() > 0.3,
          twitter: Math.random() > 0.4,
          facebook: Math.random() > 0.2,
          instagram: Math.random() > 0.5,
          github: student.branch?.toLowerCase().includes('comp') || student.branch?.toLowerCase().includes('it') ? Math.random() > 0.3 : Math.random() > 0.7
        },
        onlinePresence: Math.floor(Math.random() * 100)
      };
      
      setSearchResults(searchData);
      setIsLoading(false);
    }, 2000);
  };
  
  // Generate random presence score (0-100)
  const onlinePresenceScore = searchResults.onlinePresence || Math.floor(Math.random() * 100);
  
  // Format name for display
  const displayName = `${firstName} ${lastName}`.trim();
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-indigo-100 dark:bg-indigo-800/50">
          <h2 className="text-lg font-semibold text-indigo-900 dark:text-white">
            OSINT Profile: {displayName}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={runSimulatedSearch}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center space-x-1 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <Search className="w-3 h-3 mr-1" />
              )}
              <span>Search</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-8 h-8 text-indigo-700 dark:text-indigo-200" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{student.fullName}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {searchResults.searchTime ? 
                        `Last search: ${searchResults.searchTime}` : 
                        'Not searched yet'}
                    </p>
                    {student.collegeName && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {student.collegeName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mt-2 p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Name Components</h4>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <span className="font-medium">First name:</span> {firstName}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Last name:</span> {lastName}
                    </p>
                  </div>
                </div>
                
                <div className="pt-3">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Online Presence Score</h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        onlinePresenceScore > 70 ? 'bg-red-600 dark:bg-red-500' : 
                        onlinePresenceScore > 40 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-green-600 dark:bg-green-500'
                      }`} 
                      style={{ width: `${onlinePresenceScore}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {onlinePresenceScore > 70 ? 'High exposure' : 
                     onlinePresenceScore > 40 ? 'Moderate exposure' : 'Low exposure'}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Search Engines</h4>
                  <ul className="space-y-1.5">
                    <li>
                      <button 
                        onClick={() => openInNewTab(searchUrls.google)}
                        className="w-full flex items-center gap-2 text-sm p-1.5 bg-white dark:bg-gray-600 rounded-md text-blue-700 dark:text-blue-300 hover:underline"
                      >
                        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span>Google Search</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => openInNewTab(searchUrls.imageSearch)}
                        className="w-full flex items-center gap-2 text-sm p-1.5 bg-white dark:bg-gray-600 rounded-md text-blue-700 dark:text-blue-300 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span>Image Search</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Potential Digital Footprint</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Potential Social Media Profiles</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      <li className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-200 dark:border-gray-700">
                        <Linkedin className="w-4 h-4 text-blue-700 flex-shrink-0" />
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-900 dark:text-gray-200 font-medium">{displayName} - LinkedIn</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {student.collegeName ? `${displayName} at ${student.collegeName}` : displayName}
                          </span>
                        </div>
                        <button 
                          onClick={() => openInNewTab(searchUrls.linkedin)}
                          className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Open LinkedIn search"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </li>
                      <li className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-200 dark:border-gray-700">
                        <Twitter className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-900 dark:text-gray-200 font-medium">{firstName} {lastName} - Twitter</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">@{firstName.toLowerCase()}{lastName.toLowerCase()}</span>
                        </div>
                        <button 
                          onClick={() => openInNewTab(searchUrls.twitter)}
                          className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Open Twitter search"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </li>
                      <li className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-200 dark:border-gray-700">
                        <Instagram className="w-4 h-4 text-pink-600 flex-shrink-0" />
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-900 dark:text-gray-200 font-medium">{firstName} {lastName} - Instagram</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">@{firstName.toLowerCase()}{lastName.toLowerCase()}</span>
                        </div>
                        <button 
                          onClick={() => openInNewTab(searchUrls.instagram)}
                          className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Open Instagram profile"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </li>
                      <li className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-200 dark:border-gray-700">
                        <Github className="w-4 h-4 text-gray-900 dark:text-white flex-shrink-0" />
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-900 dark:text-gray-200 font-medium">{firstName} {lastName} - GitHub</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{potentialUsernames[0]}</span>
                        </div>
                        <button 
                          onClick={() => openInNewTab(searchUrls.github)}
                          className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Open GitHub search"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Common Username Patterns</h3>
                <ul className="space-y-2">
                  {potentialUsernames.map((username, index) => (
                    <li key={index} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-300 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-gray-200 font-medium">{username}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Potential Email Addresses</h4>
                <ul className="space-y-1">
                  {potentialEmails.map((email, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-300 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-gray-200">{email}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Academic Presence</h3>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="w-5 h-5 text-indigo-600 dark:text-indigo-300 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-200 font-medium">Google Scholar</span>
                        {student.collegeName && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">Searching with college: {student.collegeName}</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => openInNewTab(searchUrls.academicSearch)}
                      className="p-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      aria-label="Open Google Scholar search"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-orange-100 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-orange-700 dark:text-orange-300 mt-1 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-200">Educational Use Only</h4>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                  This information shows how real-time OSINT searches would work if conducted on public search engines.
                  For educational purposes only, clicking on the links will redirect you to actual search results for publicly 
                  available information. Be responsible with this information.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-100 dark:bg-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 