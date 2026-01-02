// =============================================================================
// USER STATS API - Returns user-specific stats (requires wallet)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';
const API_SECRET = process.env.ADMIN_API_SECRET || 'your-webhook-secret-16-chars';

function createSignature(payload: string): string {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(payload)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Fetch user stats from admin server
    const statsPayload = JSON.stringify({ walletAddress });
    const statsSignature = createSignature(statsPayload);

    const statsResponse = await fetch(`${ADMIN_API_URL}/integration/user/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': statsSignature,
      },
      body: statsPayload,
    });

    // Fetch submission history
    const historyPayload = JSON.stringify({ walletAddress, page: 1, limit: 50 });
    const historySignature = createSignature(historyPayload);

    const historyResponse = await fetch(`${ADMIN_API_URL}/integration/submissions/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': historySignature,
      },
      body: historyPayload,
    });

    let userStats = {
      totalApproved: 0,
      totalRejected: 0,
      totalPending: 0,
      isSuspended: false,
    };

    let submissions: Array<{
      id: string;
      taskName: string;
      status: string;
      rewardAmount: string;
      submittedAt: string;
    }> = [];

    if (statsResponse.ok) {
      const data = await statsResponse.json();
      userStats = data.data;
    }

    if (historyResponse.ok) {
      const data = await historyResponse.json();
      submissions = data.data.items;
    }

    // Calculate total rewards earned (from approved submissions)
    const totalRewardsEarned = submissions
      .filter(s => s.status === 'APPROVED' || s.status === 'REWARD_PENDING' || s.status === 'REWARD_PAID')
      .reduce((sum, s) => sum + parseFloat(s.rewardAmount), 0);

    // Determine tier based on completed tasks
    const tier = calculateTier(userStats.totalApproved);

    return NextResponse.json({
      success: true,
      data: {
        // User stats
        tasksCompleted: userStats.totalApproved,
        tasksPending: userStats.totalPending,
        tasksRejected: userStats.totalRejected,
        totalRewardsEarned,
        isSuspended: userStats.isSuspended,

        // Tier info
        tier: tier.name,
        tierLevel: tier.level,
        maxRewardMultiplier: tier.maxReward,
        tasksUntilNextTier: tier.tasksUntilNext,

        // Submission history
        submissions: submissions.map(s => ({
          id: s.id,
          taskName: s.taskName,
          status: s.status,
          rewardAmount: parseFloat(s.rewardAmount),
          submittedAt: s.submittedAt,
        })),
      },
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

// Tiered reward system
function calculateTier(completedTasks: number): {
  name: string;
  level: number;
  maxReward: number;
  tasksUntilNext: number;
} {
  if (completedTasks >= 20) {
    return {
      name: 'Diamond',
      level: 4,
      maxReward: 0.15,
      tasksUntilNext: 0,
    };
  } else if (completedTasks >= 10) {
    return {
      name: 'Gold',
      level: 3,
      maxReward: 0.12,
      tasksUntilNext: 20 - completedTasks,
    };
  } else if (completedTasks >= 5) {
    return {
      name: 'Silver',
      level: 2,
      maxReward: 0.10,
      tasksUntilNext: 10 - completedTasks,
    };
  } else {
    return {
      name: 'Bronze',
      level: 1,
      maxReward: 0.05,
      tasksUntilNext: 5 - completedTasks,
    };
  }
}
