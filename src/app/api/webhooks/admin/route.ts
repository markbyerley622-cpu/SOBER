// =============================================================================
// WEBHOOK ENDPOINT - Receives status updates from admin server
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  statusUpdates,
  globalStatsCache,
  updateGlobalStats,
  recentActivity
} from '@/lib/webhook-store';

const WEBHOOK_SECRET = process.env.ADMIN_WEBHOOK_SECRET || 'your-webhook-secret-16-chars';

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 401 }
      );
    }

    const body = await request.text();

    // Verify signature
    try {
      if (!verifyWebhookSignature(body, signature)) {
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid signature format' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    // Admin server sends { eventType, timestamp, data } structure
    const { eventType, data } = event;

    // Guard against missing data
    if (!data) {
      console.error('Webhook received with no data:', event);
      return NextResponse.json({ success: true, received: eventType });
    }

    switch (eventType) {
      case 'submission.approved': {
        // Update status for the user
        statusUpdates.set(data.submissionId, {
          submissionId: data.submissionId,
          status: 'APPROVED',
          walletAddress: data.walletAddress,
          taskName: data.taskName || 'Task',
          rewardAmount: data.rewardAmount,
          timestamp: new Date(),
        });

        // Update global stats
        updateGlobalStats({
          totalTasksCompleted: globalStatsCache.totalTasksCompleted + 1,
          totalRewardsDistributed: globalStatsCache.totalRewardsDistributed + parseFloat(data.rewardAmount || '0'),
        });

        // Add to activity feed
        recentActivity.unshift({
          id: data.submissionId,
          type: 'task_completed',
          walletAddress: data.walletAddress?.slice(0, 4) + '...' + data.walletAddress?.slice(-4),
          taskName: data.taskName || 'Task',
          rewardAmount: parseFloat(data.rewardAmount || '0'),
          timestamp: new Date(),
          txHash: data.txHash,
        });

        // Keep only last 100 activities
        if (recentActivity.length > 100) {
          recentActivity.pop();
        }
        break;
      }

      case 'submission.rejected': {
        statusUpdates.set(data.submissionId, {
          submissionId: data.submissionId,
          status: 'REJECTED',
          walletAddress: data.walletAddress,
          taskName: data.taskName || 'Task',
          rewardAmount: data.rewardAmount,
          rejectionReason: data.reason,
          timestamp: new Date(),
        });
        break;
      }

      case 'reward.paid': {
        // Add to activity feed as reward claimed with tx hash
        recentActivity.unshift({
          id: data.submissionId,
          type: 'reward_claimed',
          walletAddress: data.walletAddress?.slice(0, 4) + '...' + data.walletAddress?.slice(-4),
          taskName: data.taskName || 'Task',
          rewardAmount: parseFloat(data.rewardAmount || '0'),
          timestamp: new Date(),
          txHash: data.txHash,
        });

        if (recentActivity.length > 100) {
          recentActivity.pop();
        }
        break;
      }

      case 'user.suspended': {
        // Handle user suspension notification
        console.log('User suspended:', data.walletAddress);
        break;
      }
    }

    return NextResponse.json({ success: true, received: eventType });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
