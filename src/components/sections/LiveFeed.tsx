'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, Badge } from '../ui';
import { useApp } from '@/context/AppContext';
import { ActivityFeedItem } from '@/types';
import { formatTimeAgo, formatReward } from '@/data/mock';

interface FeedItemProps {
  activity: ActivityFeedItem;
  isNew?: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({ activity, isNew }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'task_completed':
        return (
          <div className="w-10 h-10 rounded-full bg-sober-green/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-sober-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'reward_claimed':
        return (
          <div className="w-10 h-10 rounded-full bg-sober-gold/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-sober-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        );
      case 'streak_milestone':
        return (
          <div className="w-10 h-10 rounded-full bg-sober-orange/20 flex items-center justify-center">
            <span className="text-lg">🔥</span>
          </div>
        );
      case 'user_joined':
        return (
          <div className="w-10 h-10 rounded-full bg-sober-blue/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-sober-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getActivityMessage = () => {
    switch (activity.type) {
      case 'task_completed':
        return (
          <>
            <span className="text-sober-blue font-medium">{activity.walletAddress}</span>
            {' completed '}
            <span className="text-white font-medium">{activity.taskTitle}</span>
          </>
        );
      case 'reward_claimed':
        return (
          <>
            <span className="text-sober-blue font-medium">{activity.walletAddress}</span>
            {' claimed '}
            <span className="text-sober-gold font-bold">+{formatReward(activity.rewardAmount!)}</span>
            {' SOL'}
          </>
        );
      case 'streak_milestone':
        return (
          <>
            <span className="text-sober-blue font-medium">{activity.walletAddress}</span>
            {' hit a '}
            <span className="text-sober-orange font-bold">{activity.streakDays}-day streak!</span>
          </>
        );
      case 'user_joined':
        return (
          <>
            <span className="text-sober-blue font-medium">{activity.walletAddress}</span>
            {' joined the SOBER community!'}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
        isNew
          ? 'bg-sober-green/10 border border-sober-green/30 animate-slide-in'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      {getActivityIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-gray-300 text-sm truncate">{getActivityMessage()}</p>
        <div className="flex items-center gap-2 mt-1">
          {activity.rewardAmount && activity.type === 'task_completed' && (
            <span className="text-sober-gold text-xs font-medium">
              +{formatReward(activity.rewardAmount)} SOL
            </span>
          )}
          {activity.txHash && (
            <a
              href={activity.txHash}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-sober-blue/20 hover:bg-sober-blue/30 text-sober-blue text-xs rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Solscan
            </a>
          )}
        </div>
      </div>
      <div className="text-gray-500 text-xs whitespace-nowrap">
        {formatTimeAgo(activity.timestamp)}
      </div>
    </div>
  );
};

const LiveFeed: React.FC = () => {
  const { activityFeed } = useApp();
  const [displayedActivities, setDisplayedActivities] = useState<ActivityFeedItem[]>([]);
  const [newActivityIds, setNewActivityIds] = useState<Set<string>>(new Set());
  const prevFeedRef = useRef<ActivityFeedItem[]>([]);

  // Sync with activity feed and detect new items
  useEffect(() => {
    const prevIds = new Set(prevFeedRef.current.map(a => a.id));
    const newIds = activityFeed
      .filter(a => !prevIds.has(a.id))
      .map(a => a.id);

    if (newIds.length > 0) {
      setNewActivityIds(new Set(newIds));
      setTimeout(() => setNewActivityIds(new Set()), 2000);
    }

    setDisplayedActivities(activityFeed.slice(0, 8));
    prevFeedRef.current = activityFeed;
  }, [activityFeed]);

  return (
    <section className="py-12 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-sober-green rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-sober-green rounded-full animate-ping" />
            </div>
            <h3 className="text-xl font-bold text-white">Live Activity</h3>
          </div>
          <Badge variant="success" size="md">
            {activityFeed.length} recent
          </Badge>
        </div>

        {/* Feed Card */}
        <Card variant="glass" padding="sm">
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {displayedActivities.map(activity => (
              <FeedItem
                key={activity.id}
                activity={activity}
                isNew={newActivityIds.has(activity.id)}
              />
            ))}
          </div>
        </Card>

        {/* Stats Bar */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="text-sober-green font-bold text-lg">
              {activityFeed.filter(a => a.type === 'task_completed').length}
            </div>
            <div className="text-gray-400 text-xs">Tasks Today</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="text-sober-gold font-bold text-lg">
              {formatReward(
                activityFeed
                  .filter(a => a.rewardAmount)
                  .reduce((sum, a) => sum + (a.rewardAmount || 0), 0)
              )}
            </div>
            <div className="text-gray-400 text-xs">SOL Today</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="text-sober-blue font-bold text-lg">
              {activityFeed.filter(a => a.type === 'user_joined').length}
            </div>
            <div className="text-gray-400 text-xs">New Users</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
