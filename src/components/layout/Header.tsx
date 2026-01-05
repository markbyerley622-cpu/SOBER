'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WalletButton from '../wallet/WalletButton';
import { useApp } from '@/context/AppContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteConfig } = useApp();

  const navLinks = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#tasks', label: 'Tasks' },
    { href: '#leaderboard', label: 'Leaderboard' },
    { href: '#community', label: 'Community' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CA and Twitter Row */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium text-sm">CA:</span>
            <span className="text-sober-green font-mono font-bold text-sm md:text-base lg:text-lg">
              {siteConfig.caAddress}
            </span>
          </div>
          <a
            href="https://x.com/sobermadefun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <span className="font-medium text-sm">Follow</span>
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
        {/* Main Navigation Row */}
        <div className="flex items-center justify-between h-20 md:h-24 lg:h-28">
          {/* Logo - BIG AND BEAUTIFUL */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-removebg-preview (1).png"
              alt="SOBER MADE FUN"
              width={320}
              height={120}
              className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-[0_0_15px_rgba(20,241,149,0.3)]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-sober-blue-darker/95 backdrop-blur-lg border-t border-white/10">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <WalletButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
