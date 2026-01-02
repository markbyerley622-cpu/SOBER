// =============================================================================
// TEST API - Check connectivity to admin server
// =============================================================================

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';
const API_SECRET = process.env.ADMIN_API_SECRET || 'sober-shared-secret-2024';

function createSignature(payload: string): string {
  return crypto.createHmac('sha256', API_SECRET).update(payload).digest('hex');
}

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

    // Test 3: POST test to debug endpoint
    const testPayload = JSON.stringify({ test: 'hello', timestamp: Date.now() });
    const testSignature = createSignature(testPayload);

    let postTestResult;
    try {
      const postTestResponse = await fetch(`${ADMIN_API_URL.replace('/api/v1', '')}/debug/test-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': testSignature,
        },
        body: testPayload,
      });
      postTestResult = {
        status: postTestResponse.status,
        ok: postTestResponse.ok,
        data: await postTestResponse.json(),
      };
    } catch (postError) {
      postTestResult = {
        error: postError instanceof Error ? postError.message : 'POST test failed',
      };
    }

    const healthData = healthResponse.ok ? await healthResponse.json() : { error: healthResponse.status };
    const tasksData = tasksResponse.ok ? await tasksResponse.json() : { error: tasksResponse.status };

    return NextResponse.json({
      success: true,
      adminApiUrl: ADMIN_API_URL,
      apiSecret: API_SECRET.substring(0, 10) + '...',
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
      postTest: postTestResult,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      adminApiUrl: ADMIN_API_URL,
    }, { status: 500 });
  }
}
