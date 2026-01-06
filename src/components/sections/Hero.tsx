'use client';

import React from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '../ui';
import { useApp } from '@/context/AppContext';
import { formatSOL } from '@/data/tasks';

const Hero: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { globalStats, userStats, isLoadingGlobalStats, isLoadingUserStats } = useApp();

  return (
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
      {/* Safari/Jungle Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/photo_5_2026-01-05_23-49-15.jpg')" }}
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/90 via-[#0B0B0B]/80 to-[#0B0B0B]/95" />

      {/* Safari/Giraffe themed gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F4C430]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D6B37A]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F4C430]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F4C430]/10 to-[#D6B37A]/10 border border-[#F4C430]/30 rounded-full mb-6 flex-wrap justify-center">
              <Image src="/coin logo.png" alt="$SOBER" width={25} height={25} className="rounded-full" />
              <span className="gradient-solana text-sm font-medium font-display">
                Launched on USD1
              </span>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-[#EFE6D1]/20">
                <div className="w-2 h-2 bg-[#F4C430] rounded-full animate-pulse" />
                <span className="text-[#F4C430] text-xs font-bold">LIVE</span>
              </div>
            </div>

            {/* Big Spinning Coin with $SOBER */}
            <div className="mb-6 flex flex-col items-center lg:items-start">
              <div className="relative mb-4" style={{ perspective: '1000px' }}>
                {/* Glow behind coin */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-500/40 rounded-full blur-3xl scale-125" />
                <Image
                  src="/coin logo.png"
                  alt="$SOBER Coin"
                  width={300}
                  height={300}
                  className="relative z-10 w-[225px] h-[225px] sm:w-[270px] sm:h-[270px] lg:w-[300px] lg:h-[300px] animate-spin-coin drop-shadow-[0_0_40px_rgba(217,119,6,0.6)]"
                  priority
                />
              </div>
              <span className="block text-4xl sm:text-5xl lg:text-6xl gradient-solana font-bold text-center lg:text-left">$SOBER</span>
            </div>

            <p className="text-lg sm:text-xl text-[#EFE6D1] mb-8 max-w-xl mx-auto lg:mx-0">
              Tackle your New Year goals, smash bad habits, and <span className="text-[#F4C430] font-semibold">level up your life</span>.
              Complete tasks, earn <span className="text-[#F4C430] font-semibold">$SOBER</span> tokens automatically sent to your wallet.
              Web3-powered motivation for 2026.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {connected ? (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Tasks
                </Button>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => setVisible(true)}
                >
                  Start Earning
                </Button>
              )}
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>

            {/* Stats - Dynamic based on wallet connection */}
            {connected && userStats ? (
              // Connected: Show user's personal stats
              <div className="bg-gradient-to-r from-[#F4C430]/5 to-[#D6B37A]/5 border border-[#F4C430]/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-[#F4C430] rounded-full" />
                  <span className="text-[#D6B37A] text-sm">Your Stats</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                    userStats.tier === 'Diamond' ? 'bg-[#F4C430]/20 text-[#F4C430]' :
                    userStats.tier === 'Gold' ? 'bg-[#F4C430]/20 text-[#F4C430]' :
                    userStats.tier === 'Silver' ? 'bg-[#D6B37A]/20 text-[#D6B37A]' :
                    'bg-[#D6B37A]/20 text-[#D6B37A]'
                  }`}>
                    {userStats.tier} Tier
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-[#EFE6D1] font-display">
                      {isLoadingUserStats ? '...' : userStats.tasksCompleted}
                    </div>
                    <div className="text-[#D6B37A] text-sm">Completed</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-[#D6B37A] font-display">
                      {isLoadingUserStats ? '...' : userStats.tasksPending}
                    </div>
                    <div className="text-[#D6B37A] text-sm">Pending</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <Image src="/coin logo.png" alt="$SOBER" width={30} height={30} className="rounded-full" />
                      <span className="text-2xl sm:text-3xl font-bold text-[#F4C430] font-display">
                        {isLoadingUserStats ? '...' : formatSOL(userStats.totalRewardsEarned)}
                      </span>
                    </div>
                    <div className="text-[#D6B37A] text-sm">$SOBER Earned</div>
                  </div>
                </div>
                {userStats.tasksUntilNextTier > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#EFE6D1]/10">
                    <div className="text-sm text-[#D6B37A]">
                      <span className="text-[#EFE6D1] font-medium">{userStats.tasksUntilNextTier}</span> more tasks to unlock{' '}
                      <span className="text-[#F4C430]">next tier</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Disconnected: Show global platform stats
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-[#EFE6D1] font-display">
                    {isLoadingGlobalStats ? '...' : (globalStats?.activeUsers || 0).toLocaleString()}
                  </div>
                  <div className="text-[#D6B37A] text-sm">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-[#F4C430] font-display">
                    {isLoadingGlobalStats ? '...' : (globalStats?.totalTasksCompleted || 0).toLocaleString()}
                  </div>
                  <div className="text-[#D6B37A] text-sm">Tasks Done</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Image src="/coin logo.png" alt="$SOBER" width={30} height={30} className="rounded-full" />
                    <span className="text-2xl sm:text-3xl font-bold text-[#F4C430] font-display">
                      {isLoadingGlobalStats ? '...' : formatSOL(globalStats?.totalRewardsDistributed || 0)}
                    </span>
                  </div>
                  <div className="text-[#D6B37A] text-sm">$SOBER Distributed</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect behind mascot */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4C430]/30 via-[#D6B37A]/20 to-[#EFE6D1]/30 rounded-full blur-3xl scale-90" />

              <Image
                src="/photo_2026-01-02_23-57-58-removebg-preview.png"
                alt="SOBER Mascot - Strong Giraffe"
                width={500}
                height={500}
                className="relative z-10 animate-float drop-shadow-[0_0_30px_rgba(244,196,48,0.4)]"
                priority
              />

              {/* Floating badges - $SOBER rewards */}
              <div className="absolute top-10 -left-4 sm:left-0 animate-bounce bg-[#0B0B0B]/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-[#F4C430]/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[#F4C430] text-lg font-bold font-display">+1000</span>
                  <span className="text-[#F4C430] text-sm font-display">$SOBER</span>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 sm:right-0 animate-bounce delay-300 bg-[#0B0B0B]/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-[#F4C430]/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#EFE6D1] text-sm">Level Up!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
