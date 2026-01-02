import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User } from '@/types';

// GET /api/user/[wallet] - Fetch user profile by wallet address
export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = params;

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required',
        },
        { status: 400 }
      );
    }

    // In production, this would query the database for user data
    // For v1, returning mock data based on wallet

    // Check if this is a new user (would create account in production)
    const isNewUser = Math.random() > 0.5;

    const user: User = isNewUser
      ? {
          walletAddress: wallet,
          tasksCompleted: 0,
          totalRewards: 0,
          currentStreak: 0,
          longestStreak: 0,
          joinedAt: new Date(),
        }
      : {
          walletAddress: wallet,
          tasksCompleted: Math.floor(Math.random() * 20) + 1,
          totalRewards: Math.floor(Math.random() * 10000) + 500,
          currentStreak: Math.floor(Math.random() * 14) + 1,
          longestStreak: Math.floor(Math.random() * 30) + 7,
          joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          rank: Math.floor(Math.random() * 500) + 10,
        };

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user data',
      },
      { status: 500 }
    );
  }
}
