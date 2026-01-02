'use client';

import React from 'react';

interface SolanaLogoProps {
  size?: number;
  className?: string;
}

// Inline SVG Solana logo - more reliable than image file
const SolanaLogo: React.FC<SolanaLogoProps> = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="50%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="24" fill="url(#solanaGradient)" />
      <path
        d="M36.5 88.5L48.5 76H91.5L79.5 88.5H36.5Z"
        fill="white"
      />
      <path
        d="M36.5 51.5L48.5 39.5H91.5L79.5 51.5H36.5Z"
        fill="white"
      />
      <path
        d="M36.5 70L48.5 82H91.5L79.5 70H36.5Z"
        fill="white"
      />
    </svg>
  );
};

export default SolanaLogo;
