import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';

interface Verse {
  id: number;
  english: string;
  englishReference: string;
  telugu: string;
  teluguReference: string;
  backgroundImage: string;
  dayNumber?: number;
  totalVerses?: number;
}

// Navbar Component
function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <img 
              src="/logo.png" 
              alt="Holy Word Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <span className="text-lg sm:text-xl font-bold text-white">Holy Word</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-orange-400 bg-white/10' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-orange-400 bg-white/10' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/developers" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/developers') 
                  ? 'text-orange-400 bg-white/10' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              For Developers
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-blue-200 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5 backdrop-blur-lg rounded-lg mt-2 border border-white/10">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-orange-400 bg-white/10' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/contact" 
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/contact') 
                    ? 'text-orange-400 bg-white/10' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/developers" 
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/developers') 
                    ? 'text-orange-400 bg-white/10' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                For Developers
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Main Home Page Component
function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyVerse();
  }, []);

  const fetchDailyVerse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/daily-verse`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch daily verse: ${response.status}`);
      }
      
      const todaysVerse: Verse = await response.json();
      
      if (!todaysVerse) {
        throw new Error('No verse found for today');
      }
      
      setVerse(todaysVerse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshVerse = () => {
    fetchDailyVerse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            Daily Bible Verse
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-blue-300 mt-2 opacity-80">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-orange-400"></div>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-white/20">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Error Loading Verse</h3>
            <p className="text-blue-200 mb-6">{error}</p>
            <button
              onClick={refreshVerse}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        ) : verse ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Cards Container - Side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* English Verse Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-200 mb-4 sm:mb-6">English</h2>
                  <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white italic leading-relaxed font-light drop-shadow-lg">
                    "{verse.english}"
                  </blockquote>
                  <p className="text-base sm:text-lg md:text-xl font-medium bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mt-3 sm:mt-4">
                    {verse.englishReference}
                  </p>
                </div>
              </div>

              {/* Telugu Verse Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-200 mb-4 sm:mb-6">తెలుగు</h2>
                  <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white italic leading-relaxed font-light drop-shadow-lg">
                    "{verse.telugu}"
                  </blockquote>
                  <p className="text-base sm:text-lg md:text-xl font-medium bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mt-3 sm:mt-4">
                    {verse.teluguReference}
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={refreshVerse}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-sm sm:text-base"
              >
                Refresh Verse
              </button>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-blue-300 text-sm md:text-base opacity-80">
            Verse updates daily • Cycles through all verses
          </p>
          <p className="text-blue-400 text-xs md:text-sm opacity-60">
            API available for developers at <code className="bg-white/10 px-2 py-1 rounded text-orange-300">/api/verses</code>
          </p>
        </div>
      </div>
    </div>
  );
}

// Contact Page Component
function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 sm:py-12 px-2 sm:px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-blue-200">Get in touch with us</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 font-medium">Email</p>
                    <p className="text-white">holywordapp.official@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 font-medium">Phone</p>
                    <p className="text-white">+91 7780549645</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 font-medium">Address</p>
                    <p className="text-white">123 Faith Street<br />Spiritual City, SC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <textarea 
                    rows={4}
                    placeholder="Your Message" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-orange-400"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Developers Page Component
function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 sm:py-12 px-2 sm:px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            For Developers
          </h1>
          <p className="text-lg sm:text-xl text-blue-200">Free API access to Bible verses</p>
        </div>

        {/* Free Use Policy - Enhanced */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-br from-orange-500/30 via-orange-600/20 to-red-500/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-orange-400/40 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-20 h-20 bg-orange-300 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-yellow-300 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 drop-shadow-lg">
                ✨ Free Use Policy ✨
              </h2>
              
              {/* Bible Verse Card */}
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/30 shadow-xl mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* English Verse */}
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-orange-200 mb-4">English</h3>
                    <blockquote className="text-lg sm:text-xl text-white italic leading-relaxed font-light mb-3">
                      "Freely you have received; freely give."
                    </blockquote>
                    <p className="text-orange-300 font-medium text-sm sm:text-base">Matthew 10:8</p>
                  </div>
                  
                  {/* Telugu Verse */}
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-orange-200 mb-4">తెలుగు</h3>
                    <blockquote className="text-lg sm:text-xl text-white italic leading-relaxed font-light mb-3">
                      "ఉచితముగా పొందితిరి ఉచితముగా ఇయ్యుడి.."
                    </blockquote>
                    <p className="text-orange-300 font-medium text-sm sm:text-base">మత్తయి 10:8</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Usage Terms */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Usage Terms</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-blue-100 text-sm sm:text-base">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <p className="text-green-300 font-bold mb-2">✅ ALLOWED</p>
                  <p><strong className="text-white">FREE USE ONLY</strong></p>
                  <p className="text-sm">Personal & educational projects</p>
                </div>
                <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/30">
                  <p className="text-red-300 font-bold mb-2">❌ PROHIBITED</p>
                  <p><strong className="text-white">NOT FOR COMMERCIAL USE</strong></p>
                  <p className="text-sm">No commercial applications</p>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <p className="text-blue-300 font-bold mb-2">📖 PURPOSE</p>
                  <p><strong className="text-white">Share God's Word</strong></p>
                  <p className="text-sm">Spread the Gospel freely</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30">
                  <p className="text-purple-300 font-bold mb-2">🙏 RESPECT</p>
                  <p><strong className="text-white">Honor God</strong></p>
                  <p className="text-sm">Use responsibly & respectfully</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation - Responsive */}
        <div className="space-y-6 sm:space-y-8">
          {/* API Endpoints */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">API Endpoints</h2>
            
            <div className="grid gap-4 sm:gap-6">
              {/* Get All Verses */}
              <div className="bg-black/20 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                  <h3 className="text-base sm:text-lg font-medium text-orange-400">Get All Verses</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">GET</span>
                    <code className="text-green-400 text-sm sm:text-base font-mono">/api/verses</code>
                  </div>
                </div>
                <p className="text-blue-200 text-sm sm:text-base mb-4">Returns all available Bible verses with metadata and usage information</p>
                <button
                  onClick={() => {
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                    window.open(`${apiUrl}/api/verses`, '_blank');
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
                >
                  Try API
                </button>
              </div>

              {/* Get Daily Verse */}
              <div className="bg-black/20 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                  <h3 className="text-base sm:text-lg font-medium text-orange-400">Get Daily Verse</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">GET</span>
                    <code className="text-green-400 text-sm sm:text-base font-mono">/api/daily-verse</code>
                  </div>
                </div>
                <p className="text-blue-200 text-sm sm:text-base mb-4">Returns today's verse based on the current date, automatically cycles through all verses</p>
                <button
                  onClick={() => {
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                    window.open(`${apiUrl}/api/daily-verse`, '_blank');
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
                >
                  Try API
                </button>
              </div>
            </div>
          </div>

          {/* Response Format */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Response Format</h2>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Daily Verse Response */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-orange-400 mb-3 sm:mb-4">Daily Verse Response</h3>
                <div className="bg-black/20 rounded-xl p-3 sm:p-4 border border-white/10 overflow-hidden">
                  <pre className="text-xs sm:text-sm text-blue-200 whitespace-pre-wrap break-words overflow-x-auto">
{JSON.stringify({
  id: 1,
  english: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."',
  englishReference: 'John 14:6',
  telugu: 'యేసు–నేనే మార్గమును, సత్యమును, జీవమును; నా ద్వారానే తప్ప యెవడును తండ్రియొద్దకు రాడు.',
  teluguReference: 'యోహాను 14:6',
  backgroundImage: 'a straight path leading to a bright light'
}, null, 2)}
                  </pre>
                </div>
              </div>

              {/* All Verses Response */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-orange-400 mb-3 sm:mb-4">All Verses Response</h3>
                <div className="bg-black/20 rounded-xl p-3 sm:p-4 border border-white/10 overflow-hidden">
                  <pre className="text-xs sm:text-sm text-blue-200 whitespace-pre-wrap break-words overflow-x-auto">
{JSON.stringify({
  totalVerses: 100,
  verses: [
    {
      id: 1,
      english: 'Jesus answered...',
      englishReference: 'John 14:6',
      telugu: 'యేసు–నేనే మార్గమును...',
      teluguReference: 'యోహాను 14:6',
      backgroundImage: 'a straight path...'
    }
  ],
  usage: {
    dailyVerse: '/api/daily-verse',
    allVerses: '/api/verses',
    documentation: "Free API access for spreading God's Word"
  }
}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Usage Instructions */}
        <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Usage Instructions</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Make Request</h3>
              <p className="text-blue-200 text-xs sm:text-sm">Use any HTTP client to call our API endpoints</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Get JSON</h3>
              <p className="text-blue-200 text-xs sm:text-sm">Receive clean JSON responses with verse data</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-base">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Integrate</h3>
              <p className="text-blue-200 text-xs sm:text-sm">Use the data in your applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// App Content Component - Inside Router for useLocation
function AppContent() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
      </Routes>
    </div>
  );
}

export default App;
