export type AuditStatus = 'authentic' | 'synthetic_detected' | 'under_review';

export type RiskClassification = 'VERIFIED_HUMAN' | 'MANUAL_REVIEW' | 'HIGH_RISK';

export type UserRole = 'candidate' | 'recruiter' | 'auditor';

export interface ForensicFrame {
  frameNumber: number;
  timestampSec: number;
  timecode: string;
  isFlagged: boolean;
  anomalyScore: number; // 0 - 100
  artifactType?: 'diffusion_boundary' | 'phonation_jitter' | 'rppg_flatline' | 'temporal_warping' | 'compression_ghosting';
  description: string;
  anomalyCoordinates?: { x: number; y: number; width: number; height: number };
}

export interface RiskSignalBreakdown {
  // 5-signal explainable risk model
  deepfakeArtifactRisk: number; // Weight: 0.30
  livenessFailureRisk: number;  // Weight: 0.25
  faceMismatchRisk: number;     // Weight: 0.20
  documentMismatchRisk: number; // Weight: 0.15
  profileInconsistencyRisk: number; // Weight: 0.10
  overallRiskScore: number;     // 0 - 100 calculated
  classification: RiskClassification; // 0-30: VERIFIED_HUMAN, 31-60: MANUAL_REVIEW, 61-100: HIGH_RISK

  // Physiological rPPG & Motion Signals
  rppgBpm: number;
  rppgSignalQuality: 'Good' | 'Moderate' | 'Degraded / Flatline';
  rppgSnrDb: number;
  blinkRatePerMin: number;
  headPoseVariance: number;
  landmarkJitterMm: number;

  // FaceNet / ArcFace ID Comparison
  faceToIdSimilarity: number; // 0 - 100%
  idDocumentType: 'Aadhaar e-KYC' | 'PAN Card' | 'Passport';
  idDocumentPhotoUrl: string;
  documentHash: string;
  digiLockerStatus: 'verified' | 'mismatch' | 'pending';

  // LinkedIn Consistency Checklist
  linkedInClaimMatches: {
    claim: string;
    matched: boolean;
    detail: string;
  }[];

  // Specific risk factor narrative explanations
  explanations: {
    artifacts: string;
    liveness: string;
    faceMatch: string;
    document: string;
    profile: string;
  };
}

export interface CandidateDossier {
  id: string; // e.g., "DOS-2026-IND-0982"
  name: string;
  role: string;
  organization: string;
  location: string;
  avatarUrl: string;
  interviewDate: string;
  status: AuditStatus;
  overallAuthenticityScore: number; // 0 - 100%
  livenessConfidence: number;
  audioVisualSyncScore: number;
  facialMeshCoherence: number;
  rppgPulseBpm: number;
  aadhaarVaultStatus: 'verified' | 'tampered' | 'unverified';
  digiLockerReference: string;
  flaggedFrameCount: number;
  videoDurationSec: number;
  frames: ForensicFrame[];
  summaryNotes: string;
  technicalFinding: string;
  certifyingOfficial: string;
  notarizedAt: string;
  cryptographicHash: string;
  enterpriseClearanceLevel: 'Tier-1 Executive' | 'Tier-2 Principal' | 'Tier-3 Engineering';
  linkedInUrl?: string;
  linkedInVerified?: boolean;
  
  // Explainable 5-Pillar Risk Engine
  riskSignals: RiskSignalBreakdown;
  
  // Auditor override audit trace
  auditorOverride?: {
    overriddenAt: string;
    examinerId: string;
    previousClassification: RiskClassification;
    newClassification: RiskClassification;
    justification: string;
  };

  // Video recording URL / sample
  videoUrl?: string;
}

export type ForensicOverlayMode = 'none' | 'mesh' | 'rppg' | 'audio_sync' | 'residual';

export interface VerificationRequestDraft {
  candidateName: string;
  candidateEmail: string;
  role: string;
  organization: string;
  idDocumentType: 'Aadhaar e-KYC' | 'PAN Card' | 'Passport';
  referencePhotoUrl?: string;
  clearanceLevel: 'Tier-1 Executive' | 'Tier-2 Principal' | 'Tier-3 Engineering';
  customNotes?: string;
}
