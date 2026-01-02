import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ProofSubmission } from '@/types';

// POST /api/tasks/submit - Submit proof for a task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, walletAddress, proofType, proofUrl, notes } = body;

    // Validate required fields
    if (!taskId || !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: taskId and walletAddress',
        },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Validate the wallet signature
    // 2. Upload proof to IPFS/Arweave
    // 3. Create a database record
    // 4. Queue for verification (if needed)
    // 5. Trigger reward distribution on verification

    const submission: ProofSubmission = {
      taskId,
      walletAddress,
      proofType: proofType || 'check-in',
      proofUrl,
      notes,
      submittedAt: new Date(),
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const response: ApiResponse<{ submission: ProofSubmission; message: string }> = {
      success: true,
      data: {
        submission,
        message: 'Proof submitted successfully. Verification in progress.',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit proof',
      },
      { status: 500 }
    );
  }
}
