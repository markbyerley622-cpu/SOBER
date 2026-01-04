'use client';

import React, { useState, useEffect, useCallback } from 'react';

const TopBanner: React.FC = () => {
  const [caValue, setCaValue] = useState<string>('Coming Soon');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newCa, setNewCa] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load CA from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sober_ca_address');
    if (stored) {
      setCaValue(stored);
    }
  }, []);

  // Listen for Ctrl+D
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      setShowModal(true);
      setError('');
      setPassword('');
      setNewCa('');
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handlePasswordSubmit = () => {
    const correctPassword = process.env.NEXT_PUBLIC_CA_UPDATE_PASSWORD;
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      setNewCa(caValue);
    } else {
      setError('Incorrect password');
    }
  };

  const handleUpdateCa = () => {
    if (newCa.trim()) {
      setCaValue(newCa.trim());
      localStorage.setItem('sober_ca_address', newCa.trim());
      setShowModal(false);
      setIsAuthenticated(false);
      setPassword('');
      setNewCa('');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsAuthenticated(false);
    setPassword('');
    setNewCa('');
    setError('');
  };

  return (
    <>
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-sober-blue-dark via-sober-blue-darker to-sober-blue-dark border-b border-sober-blue/30">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 flex items-center justify-between text-sm md:text-base lg:text-lg">
          {/* CA Display */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-gray-400 font-medium">CA:</span>
            <span className="text-sober-green font-mono font-bold text-base md:text-xl lg:text-2xl">
              {caValue}
            </span>
          </div>

          {/* Follow X Link */}
          <a
            href="https://x.com/sobermadefun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <span className="font-medium">Follow</span>
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Password/Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-sober-blue-darker border border-sober-blue/30 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {isAuthenticated ? 'Update CA Address' : 'Enter Password'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
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
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sober-blue transition-colors mb-4"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full btn-primary py-3 font-semibold"
                >
                  Unlock
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">New CA Address</label>
                  <input
                    type="text"
                    value={newCa}
                    onChange={(e) => setNewCa(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCa()}
                    placeholder="Enter CA address or 'Coming Soon'..."
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sober-blue transition-colors font-mono"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setNewCa('Coming Soon');
                    }}
                    className="flex-1 btn-secondary py-3 font-semibold"
                  >
                    Reset to "Coming Soon"
                  </button>
                  <button
                    onClick={handleUpdateCa}
                    className="flex-1 btn-primary py-3 font-semibold"
                  >
                    Update CA
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopBanner;
