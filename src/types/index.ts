// Core type definitions for the SOBER platform

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  rewardAmount: number; // in $SOBER tokens
  difficulty: 'easy' | 'medium' | 'hard';
  proofType: ProofType;
  status: TaskStatus;
  completedCount: number; // how many users have completed this
  icon: string; // image path from /public
}

export type TaskCategory =
  | 'alcohol-free'
  | 'smoke-free'
  | 'fitness'
  | 'mindfulness'
  | 'community'
  | 'accountability';

export type ProofType =
  | 'image'
  | 'video'
  | 'check-in'
  | 'referral'
  | 'streak';

export type TaskStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'pending_review'
  | 'completed';

export interface UserTask {
  taskId: string;
  walletAddress: string;
  status: TaskStatus;
  proofUrl?: string;
  submittedAt?: Date;
  completedAt?: Date;
  rewardTxHash?: string;
}

export interface User {
  walletAddress: string;
  displayName?: string;
  tasksCompleted: number;
  totalRewards: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: Date;
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayName?: string;
  tasksCompleted: number;
  totalRewards: number;
  streak: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'task_completed' | 'reward_claimed' | 'streak_milestone' | 'user_joined';
  walletAddress: string;
  taskTitle?: string;
  rewardAmount?: number;
  streakDays?: number;
  timestamp: Date;
  txHash?: string; // Solscan transaction link for reward verification
}

export interface ProofSubmission {
  taskId: string;
  walletAddress: string;
  proofType: ProofType;
  proofUrl?: string;
  notes?: string;
  submittedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TasksResponse {
  tasks: Task[];
  userTasks?: UserTask[];
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalUsers: number;
  userRank?: number;
}

export interface ActivityFeedResponse {
  activities: ActivityFeedItem[];
  hasMore: boolean;
}
