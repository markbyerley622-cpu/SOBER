'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Task, UserTask, ActivityFeedItem } from '@/types';
import { TASKS } from '@/data/tasks';

// =============================================================================
// TYPES
// =============================================================================

interface GlobalStats {
  totalTasksCompleted: number;
  totalRewardsDistributed: number;
  activeUsers: number;
  totalAvailableRewards: number;
  totalTasks: number;
  lastUpdated: Date;
}

interface UserStats {
  tasksCompleted: number;
  tasksPending: number;
  tasksRejected: number;
  totalRewardsEarned: number;
  isSuspended: boolean;
  tier: string;
  tierLevel: number;
  maxRewardMultiplier: number;
  tasksUntilNextTier: number;
}

interface UserSubmission {
  id: string;
  taskId: string;
  taskName: string;
  status: string;
  rewardAmount: number;
  submittedAt: string;
}

interface AppContextType {
  // Tasks state
  tasks: Task[];
  userTasks: UserTask[];

  // Activity feed
  activityFeed: ActivityFeedItem[];

  // Global stats (visible to everyone)
  globalStats: GlobalStats | null;

  // User stats (only when wallet connected)
  userStats: UserStats | null;
  userSubmissions: UserSubmission[];

  // Loading states
  isLoadingGlobalStats: boolean;
  isLoadingUserStats: boolean;

  // Connection state
  isWalletConnected: boolean;

  // Actions
  startTask: (taskId: string) => void;
  submitProof: (taskId: string, file: File | null, notes: string, xPostUrl?: string) => Promise<{ success: boolean; error?: string }>;
  refreshGlobalStats: () => Promise<void>;
  refreshUserStats: () => Promise<void>;

  // UI State
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isProofModalOpen: boolean;
  setIsProofModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function AppProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet();

  // Task state
  const [tasks] = useState<Task[]>(TASKS);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);

  // Global stats (visible to everyone)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [isLoadingGlobalStats, setIsLoadingGlobalStats] = useState(true);

  // User stats (only when connected)
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false);

  // UI state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Polling interval ref
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // =========================================================================
  // FETCH GLOBAL STATS (For Everyone)
  // =========================================================================
  const refreshGlobalStats = useCallback(async () => {
    try {
      const response = await fetch('/api/global-stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGlobalStats({
            totalTasksCompleted: data.data.totalTasksCompleted,
            totalRewardsDistributed: data.data.totalRewardsDistributed,
            activeUsers: data.data.activeUsers,
            totalAvailableRewards: data.data.totalAvailableRewards,
            totalTasks: data.data.totalTasks,
            lastUpdated: new Date(data.data.lastUpdated),
          });

          // Update activity feed
          if (data.data.recentActivity) {
            setActivityFeed(data.data.recentActivity.map((a: {
              id: string;
              type: string;
              walletAddress: string;
              taskName?: string;
              rewardAmount?: number;
              timestamp: string;
              txHash?: string;
            }) => ({
              id: a.id,
              type: a.type as ActivityFeedItem['type'],
              walletAddress: a.walletAddress,
              taskTitle: a.taskName,
              rewardAmount: a.rewardAmount,
              timestamp: new Date(a.timestamp),
              txHash: a.txHash, // Solscan transaction link
            })));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
    } finally {
      setIsLoadingGlobalStats(false);
    }
  }, []);

  // =========================================================================
  // FETCH USER STATS (When Wallet Connected)
  // =========================================================================
  const refreshUserStats = useCallback(async () => {
    if (!publicKey) {
      setUserStats(null);
      setUserSubmissions([]);
      return;
    }

    setIsLoadingUserStats(true);
    try {
      const response = await fetch('/api/user-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserStats({
            tasksCompleted: data.data.tasksCompleted,
            tasksPending: data.data.tasksPending,
            tasksRejected: data.data.tasksRejected,
            totalRewardsEarned: data.data.totalRewardsEarned,
            isSuspended: data.data.isSuspended,
            tier: data.data.tier,
            tierLevel: data.data.tierLevel,
            maxRewardMultiplier: data.data.maxRewardMultiplier,
            tasksUntilNextTier: data.data.tasksUntilNextTier,
          });

          // Map submissions to userTasks format
          const submissions = data.data.submissions || [];
          setUserSubmissions(submissions);

          // Update userTasks based on submissions
          const newUserTasks: UserTask[] = submissions.map((s: UserSubmission) => {
            // Find task ID from name
            const task = tasks.find(t => t.title === s.taskName);
            return {
              taskId: task?.id || s.taskId,
              walletAddress: publicKey.toString(),
              status: mapAdminStatusToTaskStatus(s.status),
              submittedAt: new Date(s.submittedAt),
            };
          });
          setUserTasks(newUserTasks);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setIsLoadingUserStats(false);
    }
  }, [publicKey, tasks]);

  // =========================================================================
  // POLLING FOR REAL-TIME UPDATES
  // =========================================================================
  useEffect(() => {
    // Initial fetch
    refreshGlobalStats();

    // Poll every 5 seconds for near real-time updates
    pollIntervalRef.current = setInterval(() => {
      refreshGlobalStats();
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [refreshGlobalStats]);

  // Fetch user stats when wallet connects/disconnects
  useEffect(() => {
    if (connected && publicKey) {
      refreshUserStats();
    } else {
      setUserStats(null);
      setUserSubmissions([]);
      setUserTasks([]);
    }
  }, [connected, publicKey, refreshUserStats]);

  // =========================================================================
  // TASK ACTIONS
  // =========================================================================

  const startTask = useCallback((taskId: string) => {
    if (!publicKey) return;

    setUserTasks(prev => {
      const existing = prev.find(ut => ut.taskId === taskId);
      if (existing) {
        return prev.map(ut =>
          ut.taskId === taskId
            ? { ...ut, status: 'in_progress' as const }
            : ut
        );
      }
      return [
        ...prev,
        {
          taskId,
          walletAddress: publicKey.toString(),
          status: 'in_progress' as const,
        },
      ];
    });
  }, [publicKey]);

  const submitProof = useCallback(async (
    taskId: string,
    file: File | null,
    notes: string,
    xPostUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    try {
      const formData = new FormData();
      formData.append('walletAddress', publicKey.toString());
      formData.append('taskId', taskId);
      formData.append('proofType', task.proofType);
      if (notes) formData.append('notes', notes);
      if (file) formData.append('file', file);
      if (xPostUrl) formData.append('xPostUrl', xPostUrl);

      const response = await fetch('/api/submit-task', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to pending_review
        setUserTasks(prev =>
          prev.map(ut =>
            ut.taskId === taskId
              ? {
                  ...ut,
                  status: 'pending_review' as const,
                  submittedAt: new Date(),
                }
              : ut
          )
        );

        // Refresh user stats after successful submission
        await refreshUserStats();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Submission failed' };
      }
    } catch (error) {
      console.error('Submit proof error:', error);
      return { success: false, error: 'Failed to submit proof' };
    }
  }, [publicKey, tasks, refreshUserStats]);

  // =========================================================================
  // CONTEXT VALUE
  // =========================================================================

  const value: AppContextType = {
    tasks,
    userTasks,
    activityFeed,
    globalStats,
    userStats,
    userSubmissions,
    isLoadingGlobalStats,
    isLoadingUserStats,
    isWalletConnected: connected,
    startTask,
    submitProof,
    refreshGlobalStats,
    refreshUserStats,
    selectedTask,
    setSelectedTask,
    isProofModalOpen,
    setIsProofModalOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// =============================================================================
// HELPERS
// =============================================================================

function mapAdminStatusToTaskStatus(adminStatus: string): UserTask['status'] {
  switch (adminStatus) {
    case 'PENDING':
    case 'UNDER_REVIEW':
      return 'pending_review';
    case 'APPROVED':
    case 'REWARD_PENDING':
    case 'REWARD_PAID':
      return 'completed';
    case 'REJECTED':
    case 'EXPIRED':
    case 'FLAGGED':
      return 'available'; // Allow retry
    default:
      return 'available';
  }
}
