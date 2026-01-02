import { NextRequest, NextResponse } from 'next/server';
import { TASKS } from '@/data/tasks';
import { ApiResponse, TasksResponse } from '@/types';

// GET /api/tasks - Fetch all available tasks
export async function GET(request: NextRequest) {
  try {
    // In production, this would fetch from a database
    // For v1, we're using static task definitions

    const response: ApiResponse<TasksResponse> = {
      success: true,
      data: {
        tasks: TASKS,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tasks',
      },
      { status: 500 }
    );
  }
}
