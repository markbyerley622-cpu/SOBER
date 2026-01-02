// =============================================================================
// ADMIN API CLIENT - Communicates with the admin verification server
// =============================================================================

import crypto from 'crypto';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admindashboardsober.onrender.com/api/v1';
const API_SECRET = process.env.ADMIN_API_SECRET || 'your-webhook-secret-16-chars';

/**
 * Create HMAC signature for request
 */
function createSignature(payload: string): string {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(payload)
    .digest('hex');
}

/**
 * Make a signed request to the admin API
 */
async function signedRequest<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const payload = JSON.stringify(body);
  const signature = createSignature(payload);

  const response = await fetch(`${ADMIN_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: payload,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || 'Request failed');
  }

  const result = await response.json();
  return result.data;
}

// =============================================================================
// UPLOAD ENDPOINTS
// =============================================================================

export interface UploadRequestResponse {
  uploadUrl: string;
  uploadKey: string;
  uploadToken: string;
  expiresAt: string;
}

export async function requestUploadUrl(
  walletAddress: string,
  taskId: string,
  filename: string,
  contentType: string,
  fileSize: number
): Promise<UploadRequestResponse> {
  return signedRequest('/upload/request', {
    walletAddress,
    taskId,
    filename,
    contentType,
    fileSize,
  });
}

export interface UploadConfirmResponse {
  submissionId: string;
  status: string;
  submittedAt: string;
}

export async function confirmUpload(
  walletAddress: string,
  taskId: string,
  uploadKey: string,
  userNote?: string
): Promise<UploadConfirmResponse> {
  return signedRequest('/upload/confirm', {
    walletAddress,
    taskId,
    uploadKey,
    userNote,
  });
}

// =============================================================================
// USER STATS ENDPOINTS
// =============================================================================

export interface UserStats {
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  isSuspended: boolean;
  suspendReason?: string;
}

export async function getUserStats(walletAddress: string): Promise<UserStats> {
  return signedRequest('/integration/user/stats', { walletAddress });
}

// =============================================================================
// SUBMISSION HISTORY
// =============================================================================

export interface SubmissionHistoryItem {
  id: string;
  taskName: string;
  taskCategory: string;
  status: string;
  rewardAmount: string;
  rewardToken: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface SubmissionHistoryResponse {
  items: SubmissionHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getSubmissionHistory(
  walletAddress: string,
  page: number = 1,
  limit: number = 20
): Promise<SubmissionHistoryResponse> {
  return signedRequest('/integration/submissions/history', {
    walletAddress,
    page,
    limit,
  });
}

// =============================================================================
// SUBMISSION STATUS
// =============================================================================

export interface SubmissionStatus {
  id: string;
  status: string;
  taskName: string;
  rewardAmount: string;
  rewardToken: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rewardTxHash?: string;
}

export async function getSubmissionStatus(
  walletAddress: string,
  submissionId: string
): Promise<SubmissionStatus> {
  return signedRequest('/integration/submission/status', {
    walletAddress,
    submissionId,
  });
}

// =============================================================================
// REWARD CLAIMING
// =============================================================================

export interface ClaimRewardResponse {
  submissionId: string;
  walletAddress: string;
  rewardAmount: string;
  rewardToken: string;
  taskId: string;
  taskName: string;
}

export async function claimReward(
  walletAddress: string,
  submissionId: string
): Promise<ClaimRewardResponse> {
  return signedRequest('/integration/reward/claim', {
    walletAddress,
    submissionId,
  });
}

export async function confirmReward(
  submissionId: string,
  txHash: string
): Promise<{ message: string }> {
  return signedRequest('/integration/reward/confirm', {
    submissionId,
    txHash,
  });
}
