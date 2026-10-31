import { CandidateDossier } from '../types/forensic';

export type LinkedInVerificationStatus = 'Profile Matched' | 'Unverified' | 'Mismatch Flagged';

export interface LinkedInProfileData {
  candidateId: string;
  fullName: string;
  headline: string;
  currentCompany: string;
  companyMatch: boolean;
  location: string;
  connections: string;
  profileUrl: string;
  avatarUrl: string;
  verificationStatus: LinkedInVerificationStatus;
  verificationScore: number;
  faceEmbeddingDistance: number; // 0.0 - 1.0 (lower is better match)
  employmentHistoryYears: number;
  verifiedAt: string;
  crossReferenceHash: string;
  auditNotes: string;
}

// In-memory cache for mock data fetcher
const verificationCache = new Map<string, LinkedInProfileData>();

export function generateMockLinkedInData(candidate: CandidateDossier): LinkedInProfileData {
  const isAuthentic = candidate.status === 'authentic';
  const isSynthetic = candidate.status === 'synthetic_detected';

  let status: LinkedInVerificationStatus = 'Unverified';
  let score = 75;
  let faceDist = 0.38;

  if (isAuthentic) {
    status = 'Profile Matched';
    score = Math.floor(96 + Math.random() * 4);
    faceDist = 0.08;
  } else if (isSynthetic) {
    status = 'Mismatch Flagged';
    score = Math.floor(12 + Math.random() * 15);
    faceDist = 0.84;
  } else {
    status = 'Unverified';
    score = 68;
    faceDist = 0.42;
  }

  const cleanHandle = candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    candidateId: candidate.id,
    fullName: candidate.name,
    headline: `${candidate.role} at ${candidate.organization}`,
    currentCompany: candidate.organization,
    companyMatch: isAuthentic,
    location: candidate.location || 'Bengaluru, Karnataka',
    connections: isAuthentic ? '500+ connections' : '42 connections',
    profileUrl: candidate.linkedInUrl || `https://linkedin.com/in/${cleanHandle}`,
    avatarUrl: candidate.avatarUrl,
    verificationStatus: status,
    verificationScore: score,
    faceEmbeddingDistance: faceDist,
    employmentHistoryYears: isAuthentic ? 8 : 1,
    verifiedAt: new Date().toISOString(),
    crossReferenceHash: `LNK-HASH-0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    auditNotes: isAuthentic
      ? 'Identity verified. Professional career timeline and face embeddings match video interview subject with 99.4% confidence.'
      : isSynthetic
      ? 'Critical Identity Discrepancy: Interview video subject does not match registered biometric face embeddings of the authentic LinkedIn account owner.'
      : 'Preliminary match. Career history verified; awaiting secondary optical verification review.',
  };
}

/**
 * Mock Data Fetcher:
 * Simulates an asynchronous network query to LinkedIn Identity & Cross-Reference API.
 */
export async function fetchCandidateLinkedInVerification(
  candidate: CandidateDossier,
  delayMs = 450
): Promise<LinkedInProfileData> {
  // Check cache first for instant subsequent returns
  if (verificationCache.has(candidate.id)) {
    return verificationCache.get(candidate.id)!;
  }

  // Simulate realistic network latency
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const result = generateMockLinkedInData(candidate);
  verificationCache.set(candidate.id, result);
  return result;
}

/**
 * Batch Mock Data Fetcher:
 * Fetches LinkedIn verification statuses for all candidate entries in the dashboard.
 */
export async function fetchBatchLinkedInVerifications(
  candidates: CandidateDossier[]
): Promise<Record<string, LinkedInProfileData>> {
  // Simulate network round-trip for batch
  await new Promise((resolve) => setTimeout(resolve, 350));

  const recordMap: Record<string, LinkedInProfileData> = {};
  for (const c of candidates) {
    if (!verificationCache.has(c.id)) {
      verificationCache.set(c.id, generateMockLinkedInData(c));
    }
    recordMap[c.id] = verificationCache.get(c.id)!;
  }

  return recordMap;
}
