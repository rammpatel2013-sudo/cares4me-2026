'use client';

import Link from 'next/link';
import { useState } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/team', label: 'Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/donate', label: 'Donate' },
  { href: '/partners', label: 'Partners' },
];

const moreLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transparency', label: 'Transparency' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq-page', label: 'FAQ' },
  { href: '/contact-us', label: 'Contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/loggoo.jpg" 
              alt="Care4ME Logo" 
              className="h-[120px] w-[120px] md:h-[200px] md:w-[200px] object-contain rounded-xl"
            />
          </Link>

          {/* Desktop Navigation - more spacing */}
          <div className="hidden md:flex items-center gap-10">
            {mainLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-[#1E5A96] font-bold text-lg hover:text-[#7CB342] transition"
              >
                {link.label}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="text-[#1E5A96] font-bold text-lg hover:text-[#7CB342] transition flex items-center gap-1"
              >
                More
                <svg className={`w-5 h-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {moreLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-5 py-2.5 text-gray-700 hover:bg-[#E8F4F8] hover:text-[#1E5A96] transition font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? (
              <svg className="w-8 h-8 text-[#1E5A96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-[#1E5A96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {mainLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-[#1E5A96] font-semibold text-lg hover:bg-gray-50 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {moreLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-4 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
