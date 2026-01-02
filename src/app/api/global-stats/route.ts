// =============================================================================
// GLOBAL STATS API - Returns platform-wide statistics (no wallet required)
// =============================================================================

import { NextResponse } from 'next/server';
import { globalStatsCache, recentActivity } from '@/lib/webhook-store';
import { TASKS } from '@/data/tasks';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';

// Calculate total available rewards from all tasks
const totalAvailableRewards = TASKS.reduce((sum, task) => sum + task.rewardAmount, 0);

export async function GET() {
  try {
    // Try to fetch from admin server first
    let adminStats = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(`${ADMIN_API_URL}/public/stats`, {
        next: { revalidate: 10 }, // Cache for 10 seconds
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        adminStats = data.data;
      }
    } catch {
      // Silently fall back to local cache if admin server unavailable
      // This is expected during development or when admin server is down
    }

    // Merge admin stats with local cache
    const stats = adminStats || globalStatsCache;
    const activities = adminStats?.recentActivity || recentActivity.slice(0, 20);

    return NextResponse.json({
      success: true,
      data: {
        // Platform stats
        totalTasksCompleted: stats.totalTasksCompleted || 0,
        totalRewardsDistributed: stats.totalRewardsDistributed || 0,
        activeUsers: stats.activeUsers || 0,

        // Available rewards info
        totalAvailableRewards,
        totalTasks: stats.totalTasks || TASKS.length,

        // Recent activity (anonymized wallet addresses)
        recentActivity: activities.map((activity: {
          id: string;
          type: string;
          walletAddress: string;
          taskName: string;
          rewardAmount: number;
          timestamp: string | Date;
          txHash?: string;
        }) => ({
          id: activity.id,
          type: activity.type,
          walletAddress: activity.walletAddress,
          taskName: activity.taskName,
          rewardAmount: activity.rewardAmount,
          timestamp: activity.timestamp,
          txHash: activity.txHash, // Solscan transaction link for verification
        })),

        // Cache info
        lastUpdated: stats.lastUpdated || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Global stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
