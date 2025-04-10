import React, { useState } from 'react';
import { Search, GraduationCap, ArrowRight, Github, ToggleLeft as Google } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-96 right-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <Search className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Sherlock</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-white">
            <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-200 transition-colors">About</a>
            <a href="#contact" className="hover:text-blue-200 transition-colors">Contact</a>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Login Form */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl p-8 shadow-xl animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-medium 
                  hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] 
                  flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Google className="w-5 h-5 mr-2" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </button>
              </div>
            </form>
          </div>

          {/* Promotional Content */}
          <div className="w-full md:w-1/2 text-white space-y-8 animate-slide-up animation-delay-500">
            <div className="flex items-center space-x-4 mb-6">
              <GraduationCap className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Student Information at Your Fingertips</h1>
            </div>
            <p className="text-xl text-blue-100">
              Access, manage, and analyze student data with unprecedented ease. 
              Sherlock brings intelligence to education management.
            </p>
            <ul className="space-y-4">
              {['Real-time Analytics', 'Secure Data Management', 'Intelligent Search', 'Performance Tracking'].map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-white/80 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Sherlock. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#support" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;