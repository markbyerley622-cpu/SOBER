// =============================================================================
// TEST API - Check connectivity to admin server
// =============================================================================

import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';

export async function GET() {
  try {
    // Test 1: Health check
    const healthResponse = await fetch(`${ADMIN_API_URL.replace('/api/v1', '')}/health`, {
      method: 'GET',
    });

    // Test 2: Public tasks
    const tasksResponse = await fetch(`${ADMIN_API_URL}/public/tasks`, {
      method: 'GET',
    });

    const healthData = healthResponse.ok ? await healthResponse.json() : { error: healthResponse.status };
    const tasksData = tasksResponse.ok ? await tasksResponse.json() : { error: tasksResponse.status };

    return NextResponse.json({
      success: true,
      adminApiUrl: ADMIN_API_URL,
      healthCheck: {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: healthData,
      },
      publicTasks: {
        status: tasksResponse.status,
        ok: tasksResponse.ok,
        taskCount: tasksData.data?.tasks?.length || 0,
        tasks: tasksData.data?.tasks?.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })) || [],
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      adminApiUrl: ADMIN_API_URL,
    }, { status: 500 });
  }
}
