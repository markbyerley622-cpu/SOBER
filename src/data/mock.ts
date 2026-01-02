import { LeaderboardEntry, ActivityFeedItem } from '@/types';

// Mock leaderboard data
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    walletAddress: '7xKp...3mNv',
    displayName: 'SoberChamp',
    tasksCompleted: 47,
    totalRewards: 23500,
    streak: 45,
  },
  {
    rank: 2,
    walletAddress: '9aRt...7bKq',
    displayName: 'ClearMind',
    tasksCompleted: 42,
    totalRewards: 21000,
    streak: 38,
  },
  {
    rank: 3,
    walletAddress: '3cWz...9pLm',
    displayName: 'FreshStart',
    tasksCompleted: 39,
    totalRewards: 19500,
    streak: 30,
  },
  {
    rank: 4,
    walletAddress: '5dXy...2nJk',
    tasksCompleted: 35,
    totalRewards: 17500,
    streak: 28,
  },
  {
    rank: 5,
    walletAddress: '8eFg...4oHi',
    displayName: 'NewDawn',
    tasksCompleted: 33,
    totalRewards: 16500,
    streak: 25,
  },
  {
    rank: 6,
    walletAddress: '2gHj...6qRs',
    tasksCompleted: 31,
    totalRewards: 15500,
    streak: 22,
  },
  {
    rank: 7,
    walletAddress: '4iKl...8sTu',
    displayName: 'Clarity',
    tasksCompleted: 28,
    totalRewards: 14000,
    streak: 20,
  },
  {
    rank: 8,
    walletAddress: '6jMn...0uVw',
    tasksCompleted: 26,
    totalRewards: 13000,
    streak: 18,
  },
  {
    rank: 9,
    walletAddress: '1kOp...2wXy',
    displayName: 'Mindful',
    tasksCompleted: 24,
    totalRewards: 12000,
    streak: 15,
  },
  {
    rank: 10,
    walletAddress: '3lQr...4yZa',
    tasksCompleted: 22,
    totalRewards: 11000,
    streak: 14,
  },
];

// Helper to generate random recent activity
const generateRecentActivity = (): ActivityFeedItem[] => {
  const activities: ActivityFeedItem[] = [
    {
      id: '1',
      type: 'task_completed',
      walletAddress: '7xKp...3mNv',
      taskTitle: 'Daily Check-In',
      rewardAmount: 50,
      timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    },
    {
      id: '2',
      type: 'reward_claimed',
      walletAddress: '9aRt...7bKq',
      rewardAmount: 1000,
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    },
    {
      id: '3',
      type: 'streak_milestone',
      walletAddress: '3cWz...9pLm',
      streakDays: 30,
      rewardAmount: 5000,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: '4',
      type: 'task_completed',
      walletAddress: '5dXy...2nJk',
      taskTitle: 'Environment Reset',
      rewardAmount: 500,
      timestamp: new Date(Date.now() - 420000), // 7 minutes ago
    },
    {
      id: '5',
      type: 'user_joined',
      walletAddress: '8eFg...4oHi',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    },
    {
      id: '6',
      type: 'task_completed',
      walletAddress: '2gHj...6qRs',
      taskTitle: 'Mindful Moment',
      rewardAmount: 200,
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    },
    {
      id: '7',
      type: 'reward_claimed',
      walletAddress: '4iKl...8sTu',
      rewardAmount: 750,
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
    },
    {
      id: '8',
      type: 'task_completed',
      walletAddress: '6jMn...0uVw',
      taskTitle: 'Healthy Body Challenge',
      rewardAmount: 250,
      timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
    },
    {
      id: '9',
      type: 'streak_milestone',
      walletAddress: '1kOp...2wXy',
      streakDays: 7,
      rewardAmount: 1000,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    },
    {
      id: '10',
      type: 'task_completed',
      walletAddress: '3lQr...4yZa',
      taskTitle: 'Sober Buddy Referral',
      rewardAmount: 1000,
      timestamp: new Date(Date.now() - 2100000), // 35 minutes ago
    },
  ];

  return activities;
};

export const MOCK_ACTIVITY_FEED = generateRecentActivity();

// Platform stats
export const PLATFORM_STATS = {
  totalUsers: 12847,
  totalTasksCompleted: 89432,
  totalRewardsDistributed: 4521500,
  activeStreaks: 3241,
};

// Helper function to format time ago
export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Helper to shorten wallet address
export const shortenAddress = (address: string): string => {
  if (address.includes('...')) return address; // Already shortened
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Helper to format reward amount
export const formatReward = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};
