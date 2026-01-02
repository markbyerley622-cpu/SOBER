// =============================================================================
// WEBHOOK DATA STORE - Shared state for webhook updates
// =============================================================================

// In-memory store for real-time updates (in production, use Redis or similar)
export const statusUpdates: Map<string, {
  submissionId: string;
  status: string;
  walletAddress: string;
  taskName: string;
  rewardAmount: string;
  rejectionReason?: string;
  timestamp: Date;
}> = new Map();

// Global stats cache (updated by webhooks)
export let globalStatsCache = {
  totalTasksCompleted: 0,
  totalRewardsDistributed: 0,
  activeUsers: 0,
  lastUpdated: new Date(),
};

export function updateGlobalStats(updates: Partial<typeof globalStatsCache>) {
  globalStatsCache = { ...globalStatsCache, ...updates, lastUpdated: new Date() };
}

// Recent activity for live feed
export const recentActivity: Array<{
  id: string;
  type: string;
  walletAddress: string;
  taskName: string;
  rewardAmount: number;
  timestamp: Date;
  txHash?: string;
}> = [];
