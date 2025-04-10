'use client';

import { useState } from 'react';
import { Search, ArrowRight, Github, ToggleLeft, Mail, Lock, ChevronRight, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Redirect to home page after successful login
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden flex flex-col justify-between">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-96 right-0 w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-300/10 rounded-full filter blur-3xl animate-blob animation-delay-1000"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 md:mb-16">
          <div className="flex items-center space-x-3">
            <div className="logo-container relative w-12 h-12 animate-fade-in">
              <Image
                src="/images/sherlock-logo.svg"
                alt="Sherlock Logo"
                width={48}
                height={48}
                className="w-full h-full"
                priority
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-white animate-fade-in">Sherlock</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-white">
            <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-200 transition-colors">About</a>
            <a href="#contact" className="hover:text-blue-200 transition-colors">Contact</a>
          </nav>
          <div className="md:hidden flex items-center">
            <button className="text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 flex-1 mobile-stack">
          {/* Promotional Content - shows first on mobile */}
          <div className="w-full md:w-1/2 text-white space-y-6 md:space-y-8 animate-slide-up animation-delay-500 mobile-full-width mobile-centered">
            <div className="flex items-center space-x-4 mb-4 md:mb-6">
              <div className="logo-container relative w-16 h-16 hidden md:block">
                <Image
                  src="/images/sherlock-logo.svg"
                  alt="Sherlock Logo"
                  width={64}
                  height={64}
                  className="w-full h-full"
                  priority
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Student Information <br className="hidden md:block" />at Your Fingertips
              </h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100">
              Access, manage, and analyze student data with unprecedented ease. 
              Sherlock brings intelligence to education management with PostgreSQL database integration.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {['PostgreSQL Database', 'Real-time Analytics', 'Secure Data', 'Intelligent Search', 'Performance Tracking'].map((feature) => (
                <div key={feature} className={`px-4 py-2 ${feature === 'PostgreSQL Database' ? 'bg-blue-500/30' : 'bg-white/10'} backdrop-blur-sm rounded-full text-sm md:text-base flex items-center`}>
                  <div className={`w-2 h-2 ${feature === 'PostgreSQL Database' ? 'bg-blue-300' : 'bg-blue-200'} rounded-full mr-2`}></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 md:pt-8 hidden md:block">
              <div className="inline-flex rounded-md">
                <a href="#learn-more" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors">
                  Learn more
                  <ChevronRight className="ml-2 -mr-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-up mobile-full-width">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="logo-container w-10 h-10 md:hidden mr-3">
                <Image
                  src="/images/sherlock-logo.svg"
                  alt="Sherlock Logo"
                  width={40}
                  height={40}
                  className="w-full h-full"
                  priority
                />
              </div>
              <h2 className="text-2xl md:text-2xl font-bold text-gray-800">Welcome Back</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#forgot" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium 
                  hover:from-blue-700 hover:to-indigo-800 active:from-blue-800 active:to-indigo-900 
                  transition-all transform hover:scale-[1.01] 
                  flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="mr-2 w-5 h-5" />
                    Sign In
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#EA4335" />
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FBBC05" clipPath="polygon(0 0, 24 0, 24 24, 0 24)" />
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4" clipPath="polygon(0 0, 24 0, 24 24, 0 24)" />
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#34A853" clipPath="polygon(0 0, 24 0, 24 24, 0 24)" />
                  </svg>
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
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <a href="#signup" className="text-blue-600 hover:text-blue-800 font-medium">Sign up</a>
              </p>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-10 md:mt-16 text-white/80 text-sm">
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