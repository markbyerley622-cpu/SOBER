import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, LeaderboardResponse, LeaderboardEntry } from '@/types';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';

// GET /api/leaderboard - Fetch leaderboard data from admin server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const walletAddress = searchParams.get('wallet');

    // Fetch real leaderboard data from admin server
    const adminResponse = await fetch(`${ADMIN_API_URL}/public/leaderboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!adminResponse.ok) {
      throw new Error('Failed to fetch from admin server');
    }

    const adminData = await adminResponse.json();
    const leaderboardEntries = adminData.data?.entries || [];

    // Transform admin data to frontend format
    const entries: LeaderboardEntry[] = leaderboardEntries.slice(0, limit).map((entry: {
      rank: number;
      walletAddress: string;
      tasksCompleted: number;
      totalRewards: number;
    }) => ({
      rank: entry.rank,
      walletAddress: entry.walletAddress,
      displayName: undefined, // Admin server doesn't track display names yet
      tasksCompleted: entry.tasksCompleted,
      streak: 0, // TODO: Add streak tracking to admin server
      totalRewards: entry.totalRewards,
    }));

    let userRank: number | undefined;

    // If wallet provided, find user's rank
    if (walletAddress) {
      const shortWallet = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
      const existingEntry = entries.find(
        (e: LeaderboardEntry) => e.walletAddress === shortWallet || e.walletAddress === walletAddress
      );
      userRank = existingEntry?.rank;
    }

    const response: ApiResponse<LeaderboardResponse> = {
      success: true,
      data: {
        entries,
        totalUsers: adminData.data?.totalUsers || entries.length,
        userRank,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    // Return empty leaderboard on error
    return NextResponse.json({
      success: true,
      data: {
        entries: [],
        totalUsers: 0,
        userRank: undefined,
      },
    });
  }
}
