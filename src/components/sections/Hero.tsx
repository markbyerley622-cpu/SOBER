'use client';

import React from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button, SolanaLogo } from '../ui';
import { useApp } from '@/context/AppContext';
import { formatSOL } from '@/data/tasks';

const Hero: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { globalStats, userStats, isLoadingGlobalStats, isLoadingUserStats } = useApp();

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-sober-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9945FF]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14F195]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#14F195]/10 to-[#9945FF]/10 border border-[#9945FF]/30 rounded-full mb-6 flex-wrap justify-center">
              <SolanaLogo size={20} />
              <span className="gradient-solana text-sm font-medium">
                Launched on Pump.fun
              </span>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20">
                <div className="w-2 h-2 bg-sober-green rounded-full animate-pulse" />
                <span className="text-sober-green text-xs">LIVE</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Sober Made</span>
              <br />
              <span className="gradient-text">Fun</span>
              <span className="text-2xl sm:text-3xl lg:text-4xl ml-3 gradient-solana">$SOBER</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Tackle your New Year goals, smash bad habits, and <span className="gradient-solana font-semibold">level up your life</span>.
              Complete tasks, earn <span className="text-sober-gold font-semibold">$SOBER</span> tokens automatically sent to your wallet.
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
              <div className="bg-gradient-to-r from-[#14F195]/5 to-[#9945FF]/5 border border-[#9945FF]/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-sober-green rounded-full" />
                  <span className="text-gray-400 text-sm">Your Stats</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                    userStats.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400' :
                    userStats.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    userStats.tier === 'Silver' ? 'bg-gray-400/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {userStats.tier} Tier
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {isLoadingUserStats ? '...' : userStats.tasksCompleted}
                    </div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-sober-orange">
                      {isLoadingUserStats ? '...' : userStats.tasksPending}
                    </div>
                    <div className="text-gray-400 text-sm">Pending</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <SolanaLogo size={24} />
                      <span className="text-2xl sm:text-3xl font-bold gradient-solana">
                        {isLoadingUserStats ? '...' : formatSOL(userStats.totalRewardsEarned)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">Earned</div>
                  </div>
                </div>
                {userStats.tasksUntilNextTier > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">
                      <span className="text-white font-medium">{userStats.tasksUntilNextTier}</span> more tasks to unlock{' '}
                      <span className="text-yellow-400">next tier</span> (up to {formatSOL(userStats.maxRewardMultiplier)} SOL/task)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Disconnected: Show global platform stats
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {isLoadingGlobalStats ? '...' : (globalStats?.activeUsers || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-sober-green">
                    {isLoadingGlobalStats ? '...' : (globalStats?.totalTasksCompleted || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Tasks Done</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <SolanaLogo size={24} />
                    <span className="text-2xl sm:text-3xl font-bold gradient-solana">
                      {isLoadingGlobalStats ? '...' : formatSOL(globalStats?.totalRewardsDistributed || 0)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">SOL Distributed</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect behind mascot */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#14F195]/30 via-sober-blue/20 to-[#9945FF]/30 rounded-full blur-3xl scale-90" />

              <Image
                src="/Screenshot_2026-01-01_230537-removebg-preview.png"
                alt="SOBER Mascot"
                width={450}
                height={450}
                className="relative z-10 animate-float drop-shadow-2xl"
                priority
              />

              {/* Floating badges - $SOBER rewards */}
              <div className="absolute top-10 -left-4 sm:left-0 animate-bounce bg-sober-blue-darker/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-[#9945FF]/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sober-gold text-lg font-bold">+1000</span>
                  <span className="text-sober-gold text-sm">$SOBER</span>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 sm:right-0 animate-bounce delay-300 bg-sober-blue-darker/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-sober-green/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-sober-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Level Up!</span>
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
