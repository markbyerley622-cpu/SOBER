'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WalletButton from '../wallet/WalletButton';
import { useApp } from '@/context/AppContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteConfig, updateCaAddress } = useApp();

  // CA Update Modal State
  const [showCaModal, setShowCaModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newCa, setNewCa] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Listen for Ctrl+D to open CA update modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      e.stopPropagation();
      setShowCaModal(true);
      setError('');
      setPassword('');
      setNewCa('');
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  const handlePasswordSubmit = () => {
    const correctPassword = process.env.NEXT_PUBLIC_CA_UPDATE_PASSWORD;
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      setNewCa(siteConfig.caAddress);
    } else {
      setError('Incorrect password');
    }
  };

  const handleUpdateCa = async () => {
    if (newCa.trim()) {
      setIsUpdating(true);
      const result = await updateCaAddress(password, newCa.trim());
      setIsUpdating(false);

      if (result.success) {
        setShowCaModal(false);
        setIsAuthenticated(false);
        setPassword('');
        setNewCa('');
      } else {
        setError(result.error || 'Failed to update');
      }
    }
  };

  const handleCloseModal = () => {
    setShowCaModal(false);
    setIsAuthenticated(false);
    setPassword('');
    setNewCa('');
    setError('');
  };

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
        <div className="flex items-center justify-between py-2 border-b border-[#F4C430]/20">
          <div className="flex items-center gap-2">
            <span className="text-[#D6B37A] font-medium text-sm">CA:</span>
            <span className="text-[#F4C430] font-mono font-bold text-sm md:text-base lg:text-lg">
              {siteConfig.caAddress}
            </span>
          </div>
          <a
            href="https://x.com/sobermadefun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#EFE6D1] hover:text-[#F4C430] transition-colors group"
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
          {/* Logo - Safari Title Image */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/photo_19_2026-01-05_23-49-15-removebg-preview (1).png"
              alt="Sober Made Fun"
              width={400}
              height={120}
              className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-[0_0_15px_rgba(217,119,6,0.4)]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#EFE6D1] hover:text-[#F4C430] transition-colors font-medium font-display"
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
            className="md:hidden p-2 text-[#EFE6D1] hover:text-[#F4C430]"
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
        <div className="md:hidden bg-[#0B0B0B]/95 backdrop-blur-lg border-t border-[#F4C430]/20">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#EFE6D1] hover:text-[#F4C430] transition-colors font-medium font-display py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#F4C430]/20">
              <WalletButton />
            </div>
          </nav>
        </div>
      )}

      {/* CA Update Modal (Ctrl+D) */}
      {showCaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-[#F4C430]/30 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#EFE6D1] font-display">
                {isAuthenticated ? 'Update CA Address' : 'Enter Password'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[#D6B37A] hover:text-[#EFE6D1] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="Enter password..."
                  className="w-full bg-black/30 border border-[#F4C430]/30 rounded-lg px-4 py-3 text-[#EFE6D1] placeholder-[#D6B37A]/50 focus:outline-none focus:border-[#F4C430] transition-colors mb-4"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-gradient-to-r from-[#F4C430] to-[#D6B37A] text-[#0B0B0B] py-3 rounded-lg font-semibold font-display hover:opacity-90 transition-opacity"
                >
                  Unlock
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-[#D6B37A] text-sm mb-2">New CA Address</label>
                  <input
                    type="text"
                    value={newCa}
                    onChange={(e) => setNewCa(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCa()}
                    placeholder="Enter CA address or 'Coming Soon'..."
                    className="w-full bg-black/30 border border-[#F4C430]/30 rounded-lg px-4 py-3 text-[#EFE6D1] placeholder-[#D6B37A]/50 focus:outline-none focus:border-[#F4C430] transition-colors font-mono"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewCa('Coming Soon')}
                    className="flex-1 bg-[#F4C430]/10 border border-[#F4C430]/30 text-[#F4C430] py-3 rounded-lg font-semibold font-display hover:bg-[#F4C430]/20 transition-colors"
                    disabled={isUpdating}
                  >
                    Reset to &quot;Coming Soon&quot;
                  </button>
                  <button
                    onClick={handleUpdateCa}
                    className="flex-1 bg-gradient-to-r from-[#F4C430] to-[#D6B37A] text-[#0B0B0B] py-3 rounded-lg font-semibold font-display hover:opacity-90 transition-opacity"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update CA'}
                  </button>
                </div>
                <p className="text-[#D6B37A]/60 text-xs mt-4 text-center">
                  Updates sync to all users within 5 seconds
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
