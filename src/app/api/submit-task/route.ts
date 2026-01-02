// =============================================================================
// SUBMIT TASK API - Handles task submission to admin server
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { TASKS } from '@/data/tasks';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:4000/api/v1';
const API_SECRET = process.env.ADMIN_API_SECRET || 'your-webhook-secret-16-chars';

// Cache for admin server task mappings (frontendId -> adminUUID)
let taskIdCache: Map<string, string> | null = null;
let cacheExpiry = 0;

function createSignature(payload: string): string {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(payload)
    .digest('hex');
}

// Fetch tasks from admin server and build ID mapping
async function getAdminTaskId(frontendTaskId: string): Promise<string | null> {
  const now = Date.now();

  // Use cache if valid (5 minute TTL)
  if (taskIdCache && now < cacheExpiry) {
    return taskIdCache.get(frontendTaskId) || null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    // Fetch tasks from admin server
    const response = await fetch(`${ADMIN_API_URL}/public/tasks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Failed to fetch admin tasks:', response.status);
      return null;
    }

    const data = await response.json();
    const adminTasks = data.data?.tasks || data.tasks || [];

    // Build mapping by matching task titles
    taskIdCache = new Map();
    for (const adminTask of adminTasks) {
      // Find matching frontend task by title
      const frontendTask = TASKS.find(
        t => t.title.toLowerCase() === adminTask.name?.toLowerCase() ||
             t.title.toLowerCase() === adminTask.title?.toLowerCase()
      );
      if (frontendTask && adminTask.id) {
        taskIdCache.set(frontendTask.id, adminTask.id);
      }
    }

    cacheExpiry = now + 5 * 60 * 1000; // 5 minutes
    return taskIdCache.get(frontendTaskId) || null;
  } catch (error) {
    console.error('Error fetching admin tasks:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const walletAddress = formData.get('walletAddress') as string;
    const taskId = formData.get('taskId') as string;
    const proofType = formData.get('proofType') as string;
    const notes = formData.get('notes') as string | null;
    const file = formData.get('file') as File | null;
    const xPostUrl = formData.get('xPostUrl') as string | null; // X/Twitter post link

    if (!walletAddress || !taskId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Look up the admin server task UUID
    const adminTaskId = await getAdminTaskId(taskId);
    if (!adminTaskId) {
      return NextResponse.json(
        { success: false, error: 'Task not found on server. Please try again later.' },
        { status: 400 }
      );
    }

    // For check-in type tasks, we don't need a file
    if (proofType === 'check-in' || proofType === 'streak') {
      // Create a simple submission without file upload
      const confirmPayload = JSON.stringify({
        walletAddress,
        taskId: adminTaskId,
        uploadKey: `checkin-${Date.now()}`,
        userNote: notes || 'Daily check-in',
      });
      const confirmSignature = createSignature(confirmPayload);

      const confirmResponse = await fetch(`${ADMIN_API_URL}/upload/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': confirmSignature,
        },
        body: confirmPayload,
      });

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json();
        return NextResponse.json(
          { success: false, error: error.error?.message || 'Submission failed' },
          { status: confirmResponse.status }
        );
      }

      const result = await confirmResponse.json();
      return NextResponse.json({
        success: true,
        data: {
          submissionId: result.data.submissionId,
          status: result.data.status,
          submittedAt: result.data.submittedAt,
        },
      });
    }

    // For X post link submissions (community share tasks)
    if (xPostUrl) {
      // Validate X/Twitter URL
      const xUrlPattern = /^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/i;
      if (!xUrlPattern.test(xPostUrl)) {
        return NextResponse.json(
          { success: false, error: 'Invalid X/Twitter post URL' },
          { status: 400 }
        );
      }

      const confirmPayload = JSON.stringify({
        walletAddress,
        taskId: adminTaskId,
        uploadKey: `xpost-${Date.now()}`,
        userNote: notes ? `${xPostUrl}\n\n${notes}` : xPostUrl,
      });
      const confirmSignature = createSignature(confirmPayload);

      const confirmResponse = await fetch(`${ADMIN_API_URL}/upload/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': confirmSignature,
        },
        body: confirmPayload,
      });

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json();
        return NextResponse.json(
          { success: false, error: error.error?.message || 'Submission failed' },
          { status: confirmResponse.status }
        );
      }

      const result = await confirmResponse.json();
      return NextResponse.json({
        success: true,
        data: {
          submissionId: result.data.submissionId,
          status: result.data.status,
          submittedAt: result.data.submittedAt,
        },
      });
    }

    // For image/video submissions, we need to handle file upload
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Proof file or X post link required for this task type' },
        { status: 400 }
      );
    }

    // Step 1: Request signed upload URL from admin server
    const uploadRequestPayload = JSON.stringify({
      walletAddress,
      taskId: adminTaskId,
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    });
    const uploadRequestSignature = createSignature(uploadRequestPayload);

    const uploadUrlResponse = await fetch(`${ADMIN_API_URL}/upload/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': uploadRequestSignature,
      },
      body: uploadRequestPayload,
    });

    if (!uploadUrlResponse.ok) {
      const error = await uploadUrlResponse.json();
      return NextResponse.json(
        { success: false, error: error.error?.message || 'Failed to get upload URL' },
        { status: uploadUrlResponse.status }
      );
    }

    const uploadUrlData = await uploadUrlResponse.json();
    const { uploadUrl, uploadKey } = uploadUrlData.data;

    // Step 2: Upload file directly to S3/MinIO
    const fileBuffer = await file.arrayBuffer();
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Step 3: Confirm upload with admin server
    const confirmPayload = JSON.stringify({
      walletAddress,
      taskId: adminTaskId,
      uploadKey,
      userNote: notes || undefined,
    });
    const confirmSignature = createSignature(confirmPayload);

    const confirmResponse = await fetch(`${ADMIN_API_URL}/upload/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': confirmSignature,
      },
      body: confirmPayload,
    });

    if (!confirmResponse.ok) {
      const error = await confirmResponse.json();
      return NextResponse.json(
        { success: false, error: error.error?.message || 'Submission failed' },
        { status: confirmResponse.status }
      );
    }

    const result = await confirmResponse.json();
    return NextResponse.json({
      success: true,
      data: {
        submissionId: result.data.submissionId,
        status: result.data.status,
        submittedAt: result.data.submittedAt,
      },
    });
  } catch (error) {
    console.error('Submit task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
