import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ACTIVITY_FEED } from '@/data/mock';
import { ApiResponse, ActivityFeedResponse } from '@/types';

// GET /api/activity - Fetch recent activity feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In production, this would:
    // 1. Query real-time events from database
    // 2. Support WebSocket/SSE for live updates
    // 3. Filter by activity type if needed

    const activities = MOCK_ACTIVITY_FEED.slice(offset, offset + limit);
    const hasMore = offset + limit < MOCK_ACTIVITY_FEED.length;

    const response: ApiResponse<ActivityFeedResponse> = {
      success: true,
      data: {
        activities,
        hasMore,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity feed',
      },
      { status: 500 }
    );
  }
}
