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
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '1rem 22vw', // move 2vw left
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      gap: '2.5rem',
    }}>
      {/* Big Logo on Left, moved right */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', marginRight: '1.5rem' }}>
        <img src="/care4me.jpg" alt="Care4ME Logo" style={{ height: 200, width: 200, objectFit: 'contain', borderRadius: 16 }} />
      </Link>

      {/* Main Links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {mainLinks.map(link => (
          <Link key={link.href} href={link.href} style={{
            color: '#1E5A96', // dark blue from logo
            textDecoration: 'none',
            fontWeight: 700,
            fontFamily: 'Geist, Arial, Helvetica, sans-serif',
            fontSize: '1.25rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 8,
            transition: 'background 0.2s, color 0.2s',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Dropdown on Right */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            background: '#2BA5D7',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: open ? '0 2px 8px rgba(43,165,215,0.15)' : undefined,
            outline: open ? '2px solid #2BA5D7' : undefined,
          }}
        >
          More ▾
        </button>
        {open && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(30,41,59,0.08)',
              minWidth: 180,
              zIndex: 100,
            }}
            onMouseLeave={() => setOpen(false)}
          >
            {moreLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '0.75rem 1.25rem',
                  color: '#1e293b',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
