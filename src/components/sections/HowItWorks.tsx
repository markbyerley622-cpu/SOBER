'use client';

import React from 'react';
import { Card, SolanaLogo } from '../ui';

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Connect your Solana wallet to get started. Your SOL rewards will be sent directly here.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-sober-blue to-sober-blue-light',
  },
  {
    number: '02',
    title: 'Choose Your Goal',
    description: 'Pick tasks that match your NYE goals - quit smoking, stay alcohol-free, hit the gym, or build healthy habits.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'from-sober-green to-sober-green-light',
  },
  {
    number: '03',
    title: 'Complete & Level Up',
    description: 'Smash your tasks, submit proof (photo or X post), and level up. Share your wins with the community!',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-sober-orange to-sober-orange-light',
  },
  {
    number: '04',
    title: 'Earn $SOBER',
    description: 'Once approved, SOL is automatically sent to your connected wallet. No claiming needed!',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-[#14F195] to-[#9945FF]',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-sober-blue/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How <span className="text-sober-gold">$SOBER</span> <span className="gradient-text-orange">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Crush your New Year goals and earn <span className="gradient-solana">SOL</span> rewards.
            Level up your life, get rewarded, and join a community of winners.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              variant="glass"
              hover
              className="relative group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-sober-blue-dark to-sober-blue-darker rounded-full flex items-center justify-center border border-sober-blue/30">
                <span className="text-sober-blue font-bold text-sm">{step.number}</span>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sober-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sober-gold font-bold text-sm sm:text-base">$</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium text-sm sm:text-base">Pump.fun Launch</h4>
              <p className="text-gray-400 text-xs sm:text-sm truncate">Buybacks & burns + creator rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#14F195]/20 to-[#9945FF]/20 flex items-center justify-center flex-shrink-0">
              <SolanaLogo size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium text-sm sm:text-base">Auto-Sent Rewards</h4>
              <p className="text-gray-400 text-xs sm:text-sm truncate">Directly to your wallet on approval</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sober-green/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sober-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium text-sm sm:text-base">Level Up System</h4>
              <p className="text-gray-400 text-xs sm:text-sm truncate">Higher tiers = bigger rewards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
