'use client';

import React, { useEffect, useState } from 'react';
import { Card, Badge } from '../ui';
import type { LeaderboardEntry } from '@/types';

// Format SOL reward amount
const formatReward = (amount: number): string => {
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toFixed(3);
};

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=10');
        const data = await response.json();
        if (data.success && data.data?.entries) {
          setEntries(data.data.entries);
          setTotalUsers(data.data.totalUsers || 0);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="leaderboard" className="py-20 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-sober-gold/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Community <span className="gradient-text-orange">Leaderboard</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See who's leading the charge in the sobriety journey.
            Complete tasks, maintain streaks, and climb the ranks!
          </p>
        </div>

        {/* Leaderboard Card */}
        <Card variant="gradient" padding="none" className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/10 text-sm font-medium text-gray-400">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 sm:col-span-4">Wallet</div>
            <div className="col-span-2 text-center hidden sm:block">Tasks</div>
            <div className="col-span-3 sm:col-span-3 text-center">Streak</div>
            <div className="col-span-3 sm:col-span-2 text-right">Rewards</div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-sober-gold/20 border-t-sober-gold rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-2">Loading leaderboard...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && entries.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No leaderboard entries yet. Be the first to complete a task!</p>
            </div>
          )}

          {/* Leaderboard Rows */}
          <div className="divide-y divide-white/5">
            {entries.map((entry, index) => (
              <div
                key={entry.walletAddress}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-white/5 ${
                  index < 3 ? 'bg-gradient-to-r from-sober-gold/5 to-transparent' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 text-center">
                  {index === 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-2xl">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="text-gray-400 font-medium">{entry.rank}</span>
                  )}
                </div>

                {/* Wallet */}
                <div className="col-span-5 sm:col-span-4">
                  <div className="flex flex-col">
                    {entry.displayName ? (
                      <>
                        <span className="text-white font-medium truncate">
                          {entry.displayName}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {entry.walletAddress}
                        </span>
                      </>
                    ) : (
                      <span className="text-white font-mono text-sm">
                        {entry.walletAddress}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tasks Completed */}
                <div className="col-span-2 text-center hidden sm:block">
                  <span className="text-white">{entry.tasksCompleted}</span>
                </div>

                {/* Streak */}
                <div className="col-span-3 sm:col-span-3 text-center">
                  <Badge
                    variant={entry.streak >= 30 ? 'gold' : entry.streak >= 7 ? 'success' : 'default'}
                    size="md"
                  >
                    🔥 {entry.streak} days
                  </Badge>
                </div>

                {/* Total Rewards */}
                <div className="col-span-3 sm:col-span-2 text-right">
                  <span className="text-sober-gold font-bold">
                    {formatReward(entry.totalRewards)}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">SOL</span>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="p-4 text-center border-t border-white/10">
            <button className="text-sober-blue hover:text-sober-blue-light transition-colors font-medium">
              View Full Leaderboard →
            </button>
          </div>
        </Card>

        {/* Your Rank CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Connect your wallet to see your rank and start competing!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
