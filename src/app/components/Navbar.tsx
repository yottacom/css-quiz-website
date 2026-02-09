'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">CSS Quiz</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-200 transition-colors font-medium">
              Home
            </Link>
            <Link href="/quiz" className="hover:text-blue-200 transition-colors font-medium">
              Quiz Mode
            </Link>
            <Link href="/mcqs" className="hover:text-blue-200 transition-colors font-medium">
              MCQ Bank
            </Link>
            <Link href="/papers" className="hover:text-blue-200 transition-colors font-medium">
              Past Papers
            </Link>
            <Link href="/subjective" className="hover:text-blue-200 transition-colors font-medium">
              Solved Questions
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-3 py-2 rounded hover:bg-white/10" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/quiz" className="px-3 py-2 rounded hover:bg-white/10" onClick={() => setIsOpen(false)}>
                Quiz Mode
              </Link>
              <Link href="/mcqs" className="px-3 py-2 rounded hover:bg-white/10" onClick={() => setIsOpen(false)}>
                MCQ Bank
              </Link>
              <Link href="/papers" className="px-3 py-2 rounded hover:bg-white/10" onClick={() => setIsOpen(false)}>
                Past Papers
              </Link>
              <Link href="/subjective" className="px-3 py-2 rounded hover:bg-white/10" onClick={() => setIsOpen(false)}>
                Solved Questions
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
