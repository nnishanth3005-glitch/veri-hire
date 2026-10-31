import { CandidateDossier } from '../types/forensic';

export const INITIAL_CANDIDATES: CandidateDossier[] = [
  // CANONICAL CASE 1: Real Candidate (Verified Human)
  {
    id: 'DOS-2026-IND-0982',
    name: 'Aarav Sharma',
    role: 'Lead ML Systems Architect',
    organization: 'Tata Consultancy Enterprise Cloud',
    location: 'Bengaluru, Karnataka',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    interviewDate: 'Oct 28, 2026',
    status: 'authentic',
    overallAuthenticityScore: 96.0,
    livenessConfidence: 97.5,
    audioVisualSyncScore: 98.2,
    facialMeshCoherence: 97.8,
    rppgPulseBpm: 72,
    aadhaarVaultStatus: 'verified',
    digiLockerReference: 'DL-2026-KA-889104',
    flaggedFrameCount: 0,
    videoDurationSec: 24,
    frames: [
      { frameNumber: 1, timestampSec: 0.0, timecode: '00:00.00', isFlagged: false, anomalyScore: 2.1, description: 'Natural ambient lighting coherence across facial surface.' },
      { frameNumber: 48, timestampSec: 2.0, timecode: '00:02.00', isFlagged: false, anomalyScore: 1.8, description: 'Micro-saccadic ocular movement patterns within physiological baselines.' },
      { frameNumber: 120, timestampSec: 5.0, timecode: '00:05.00', isFlagged: false, anomalyScore: 2.4, description: 'Spontaneous bilateral blink cycle: 180ms duration, natural eyelid elasticity.' },
      { frameNumber: 192, timestampSec: 8.0, timecode: '00:08.00', isFlagged: false, anomalyScore: 1.5, description: 'Capillary hemoperfusion verified via forehead rPPG extraction (72.4 BPM).' },
      { frameNumber: 264, timestampSec: 11.0, timecode: '00:11.00', isFlagged: false, anomalyScore: 2.0, description: 'Phoneme-viseme aperture alignment confirmed with zero audio phase lag.' },
      { frameNumber: 360, timestampSec: 15.0, timecode: '00:15.00', isFlagged: false, anomalyScore: 1.9, description: 'Skin subsurface scattering consistent across 45-degree rotational turn.' },
      { frameNumber: 480, timestampSec: 20.0, timecode: '00:20.00', isFlagged: false, anomalyScore: 2.2, description: 'Aadhaar demographic biometric hash matches cryptographic institutional ledger.' },
      { frameNumber: 576, timestampSec: 24.0, timecode: '00:24.00', isFlagged: false, anomalyScore: 1.7, description: 'Full temporal sequence validated; zero latent diffusion artifacts.' },
    ],
    summaryNotes: 'Candidate authenticated with highest forensic confidence. Biological pulse wave (rPPG) exhibits healthy periodicity. Face embedding matches Aadhaar photo with 96.4% cosine similarity.',
    technicalFinding: 'Green-channel forehead/cheek FFT reveals sharp 1.2 Hz peak (72 BPM, SNR +18.4 dB). Zero boundary warping or GAN high-frequency residual noise.',
    certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
    notarizedAt: '2026-10-28T14:32:00 IST',
    cryptographicHash: 'SHA256: 8a7c93e41b2289f6d140e90c29f8a4e511bb7330a1c6e12e',
    enterpriseClearanceLevel: 'Tier-1 Executive',
    linkedInUrl: 'https://linkedin.com/in/aarav-sharma-ml-systems',
    linkedInVerified: true,
    riskSignals: {
      deepfakeArtifactRisk: 4,      // 0.30 x 4 = 1.2
      livenessFailureRisk: 6,       // 0.25 x 6 = 1.5
      faceMismatchRisk: 4,          // 0.20 x 4 = 0.8
      documentMismatchRisk: 2,      // 0.15 x 2 = 0.3
      profileInconsistencyRisk: 5,  // 0.10 x 5 = 0.5
      overallRiskScore: 4,          // Sum = 4.3 -> 4% (Low Risk)
      classification: 'VERIFIED_HUMAN',
      rppgBpm: 72,
      rppgSignalQuality: 'Good',
      rppgSnrDb: 18.4,
      blinkRatePerMin: 18,
      headPoseVariance: 0.12,
      landmarkJitterMm: 0.4,
      faceToIdSimilarity: 96.4,
      idDocumentType: 'Aadhaar e-KYC',
      idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      documentHash: '0x8a7c93e41b2289f6d140e90c29f8a4e511bb7330',
      digiLockerStatus: 'verified',
      linkedInClaimMatches: [
        { claim: 'Current Org: Tata Consultancy Services', matched: true, detail: 'Verified via enterprise domain email & graph lookup' },
        { claim: 'Title: Lead ML Systems Architect (4.2 yrs)', matched: true, detail: 'Matched against DigiLocker experience certificate' },
        { claim: 'Education: B.Tech CSE (IIT Madras)', matched: true, detail: 'DigiLocker NAD degree repository confirmed' },
      ],
      explanations: {
        artifacts: 'Nominal baseline. Negligible residual pixel variance; clean frequency spectrum across 576 frames.',
        liveness: 'Normal spontaneous blink rate (18/min), 3D facial mesh stability <0.5mm variance, natural head movement.',
        faceMatch: 'FaceNet embeddings of webcam stream vs DigiLocker Aadhaar photo yield 96.4% cosine similarity.',
        document: 'UIDAI DigiLocker biometric hash signed with official controller key (DL-2026-KA-889104).',
        profile: 'Consented LinkedIn profile graph strictly aligns with corporate domain credentials and career timeline.',
      },
    },
  },

  // CANONICAL CASE 2: Deepfake Candidate (High Risk / Block Offer)
  {
    id: 'DOS-2026-IND-0984',
    name: 'Ananya Deshmukh (Synthetic)',
    role: 'Staff Distributed Systems Engineer',
    organization: 'Infosys EdgeVerve Platforms',
    location: 'Hyderabad, Telangana',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    interviewDate: 'Oct 29, 2026',
    status: 'synthetic_detected',
    overallAuthenticityScore: 16.0,
    livenessConfidence: 18.0,
    audioVisualSyncScore: 24.0,
    facialMeshCoherence: 19.4,
    rppgPulseBpm: 0,
    aadhaarVaultStatus: 'tampered',
    digiLockerReference: 'DL-2026-TS-003912 [REVOKED]',
    flaggedFrameCount: 14,
    videoDurationSec: 24,
    frames: [
      { frameNumber: 1, timestampSec: 0.0, timecode: '00:00.00', isFlagged: false, anomalyScore: 12.0, description: 'Initial frame buffer nominal; slight frequency attenuation at jawline boundary.' },
      { frameNumber: 36, timestampSec: 1.5, timecode: '00:01.50', isFlagged: true, anomalyScore: 88.4, artifactType: 'diffusion_boundary', description: 'Latent diffusion seam detected around left mandibular angle; unnatural pixel jitter.', anomalyCoordinates: { x: 28, y: 55, width: 22, height: 18 } },
      { frameNumber: 96, timestampSec: 4.0, timecode: '00:04.00', isFlagged: true, anomalyScore: 94.1, artifactType: 'rppg_flatline', description: 'Zero capillary pulse detected in forehead region; static synthetic color map.', anomalyCoordinates: { x: 38, y: 18, width: 24, height: 15 } },
      { frameNumber: 168, timestampSec: 7.0, timecode: '00:07.00', isFlagged: true, anomalyScore: 91.8, artifactType: 'temporal_warping', description: 'Rapid head tilt produces ghosting distortion across earlobe and cervical plane.', anomalyCoordinates: { x: 62, y: 45, width: 20, height: 25 } },
      { frameNumber: 288, timestampSec: 12.0, timecode: '00:12.00', isFlagged: true, anomalyScore: 97.2, artifactType: 'phonation_jitter', description: 'Synthetic voice clone detected: audio spectrum displays sharp 8.2 kHz harmonic cutoff.', anomalyCoordinates: { x: 42, y: 68, width: 16, height: 14 } },
      { frameNumber: 384, timestampSec: 16.0, timecode: '00:16.00', isFlagged: true, anomalyScore: 89.6, artifactType: 'compression_ghosting', description: 'Double eyelid phantom boundary discovered during blink reconstruction.', anomalyCoordinates: { x: 35, y: 32, width: 30, height: 12 } },
    ],
    summaryNotes: 'Critical Synthetic Intrusion: Real-time neural mask detected. Generative diffusion face-swap rendered over virtual camera driver. Zero biological vascular perfusion extracted.',
    technicalFinding: 'Forehead/cheek green channel FFT shows flatline noise floor (-4.8 dB SNR). Boundary artifacts typical of style-based GAN / FaceForensics++ deepfake models.',
    certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
    notarizedAt: '2026-10-29T16:15:20 IST',
    cryptographicHash: 'SHA256: 3c91d8e404b98fa109403810ef899011749c81928374a810',
    enterpriseClearanceLevel: 'Tier-2 Principal',
    linkedInUrl: 'https://linkedin.com/in/ananya-deshmukh-security',
    linkedInVerified: false,
    riskSignals: {
      deepfakeArtifactRisk: 94,     // 0.30 x 94 = 28.2
      livenessFailureRisk: 86,      // 0.25 x 86 = 21.5
      faceMismatchRisk: 72,         // 0.20 x 72 = 14.4
      documentMismatchRisk: 85,     // 0.15 x 85 = 12.75
      profileInconsistencyRisk: 75, // 0.10 x 75 = 7.5
      overallRiskScore: 84,         // Sum = 84.35 -> 84% (High Risk)
      classification: 'HIGH_RISK',
      rppgBpm: 0,
      rppgSignalQuality: 'Degraded / Flatline',
      rppgSnrDb: -4.8,
      blinkRatePerMin: 3,
      headPoseVariance: 0.84,
      landmarkJitterMm: 3.8,
      faceToIdSimilarity: 42.1,
      idDocumentType: 'Aadhaar e-KYC',
      idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      documentHash: '0x3c91d8e404b98fa109403810ef899011749c8192',
      digiLockerStatus: 'mismatch',
      linkedInClaimMatches: [
        { claim: 'Current Org: Infosys EdgeVerve', matched: false, detail: 'Employment claim unverified in DigiLocker EPFO ledger' },
        { claim: 'Profile Photo Biometric Match', matched: false, detail: 'Claimed LinkedIn photo belongs to another registered individual' },
        { claim: 'Tenure: 6.5 Years Distributed Systems', matched: false, detail: 'Profile created 14 days ago; synthetic persona traits' },
      ],
      explanations: {
        artifacts: 'High-frequency 2D checkerboard grid detected along mandibular seam. Distinct signs of neural face-swapping.',
        liveness: 'Severe liveness failure: blink rate severely suppressed (3/min), landmark jitter 3.8mm, abnormal eyelid interpolation.',
        faceMatch: 'Only 42.1% cosine similarity with uploaded Aadhaar photo; synthetic warping distorts facial geometry.',
        document: 'DigiLocker certificate signature failed cryptographic validation; revoked reference hash.',
        profile: 'LinkedIn profile displays synthetic account hallmarks with zero verified corporate tenure endorsements.',
      },
    },
  },

  // CANONICAL CASE 3: Identity Mismatch / Proxy Interviewer (Manual Review)
  {
    id: 'DOS-2026-IND-0986',
    name: 'Rohan Verma (Proxy Mismatch)',
    role: 'Principal Security Researcher',
    organization: 'Razorpay Core Engineering',
    location: 'Pune, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    interviewDate: 'Oct 30, 2026',
    status: 'under_review',
    overallAuthenticityScore: 56.0,
    livenessConfidence: 94.0,
    audioVisualSyncScore: 92.0,
    facialMeshCoherence: 95.0,
    rppgPulseBpm: 78,
    aadhaarVaultStatus: 'unverified',
    digiLockerReference: 'DL-2026-MH-442189 [MISMATCH]',
    flaggedFrameCount: 4,
    videoDurationSec: 24,
    frames: [
      { frameNumber: 1, timestampSec: 0.0, timecode: '00:00.00', isFlagged: false, anomalyScore: 4.0, description: 'Subject is a living biological human. Natural pulse and reflections present.' },
      { frameNumber: 60, timestampSec: 2.5, timecode: '00:02.50', isFlagged: true, anomalyScore: 82.0, description: 'Facial embedding mismatch: Current speaker face distance >0.68 from DigiLocker photo.' },
      { frameNumber: 180, timestampSec: 7.5, timecode: '00:07.50', isFlagged: true, anomalyScore: 85.0, description: 'Candidate answering for "Rohan Verma", but physical facial landmarks match unregistered male proxy.' },
    ],
    summaryNotes: 'IDENTITY MISMATCH ALERT (Proxy Interviewer Scheme): The person speaking on the webcam is a real living human (clean 78 BPM pulse, 0 artifacts), but their face does NOT match the uploaded Aadhaar/PAN ID photo of the candidate.',
    technicalFinding: 'rPPG extraction is healthy (78 BPM, +16.2 dB SNR). Zero deepfake masks. However, ArcFace / FaceNet embedding distance is 0.72 (Similarity: 34.2%), indicating a proxy actor taking the technical interview on behalf of the registered applicant.',
    certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
    notarizedAt: '2026-10-30T10:15:00 IST',
    cryptographicHash: 'SHA256: d188e7a4b9c100184716928e990c74921b774c10a90b4112',
    enterpriseClearanceLevel: 'Tier-2 Principal',
    linkedInUrl: 'https://linkedin.com/in/rohan-verma-distributed-systems',
    linkedInVerified: false,
    riskSignals: {
      deepfakeArtifactRisk: 8,      // 0.30 x 8 = 2.4 (Not an AI face!)
      livenessFailureRisk: 10,      // 0.25 x 10 = 2.5 (Living human!)
      faceMismatchRisk: 90,         // 0.20 x 90 = 18.0 (Crucial red flag: Wrong Person!)
      documentMismatchRisk: 70,     // 0.15 x 70 = 10.5
      profileInconsistencyRisk: 55, // 0.10 x 55 = 5.5
      overallRiskScore: 39,         // Sum = 38.9 -> 39% (Manual Review required)
      classification: 'MANUAL_REVIEW',
      rppgBpm: 78,
      rppgSignalQuality: 'Good',
      rppgSnrDb: 16.2,
      blinkRatePerMin: 16,
      headPoseVariance: 0.18,
      landmarkJitterMm: 0.5,
      faceToIdSimilarity: 34.2,     // Severe mismatch!
      idDocumentType: 'PAN Card',
      idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
      documentHash: '0xd188e7a4b9c100184716928e990c74921b774c10',
      digiLockerStatus: 'mismatch',
      linkedInClaimMatches: [
        { claim: 'Current Org: Razorpay Core Engineering', matched: true, detail: 'Document belongs to candidate, but speaker is an unverified proxy' },
        { claim: 'Biometric Face-to-ID Verification', matched: false, detail: 'Speaker face has 0.72 ArcFace distance from PAN card image' },
        { claim: 'Audio Voiceprint vs Historical Audio', matched: false, detail: 'Pitch formant mismatch with previous telephonic screening' },
      ],
      explanations: {
        artifacts: 'Zero generative deepfake artifacts. Natural high-frequency dermal textures and optical lighting.',
        liveness: 'Subject is confirmed biologically alive. Natural pulse detected at 78 BPM; spontaneous blink cycle.',
        faceMatch: 'CRITICAL FAILURE: Speaker face matches uploaded PAN document with only 34.2% confidence. Classic proxy interview substitution.',
        document: 'PAN document itself is authentic, but does NOT correspond to the individual currently speaking on video.',
        profile: 'LinkedIn identity exists for Rohan Verma, but video biometric signature belongs to a different proxy engineer.',
      },
    },
  },

  // Supporting Candidate 4: Priya Nair
  {
    id: 'DOS-2026-IND-0985',
    name: 'Priya Nair',
    role: 'VP Cloud Infrastructure',
    organization: 'Reliance Jio Digital Platform',
    location: 'Mumbai, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    interviewDate: 'Oct 29, 2026',
    status: 'authentic',
    overallAuthenticityScore: 98.9,
    livenessConfidence: 99.1,
    audioVisualSyncScore: 98.4,
    facialMeshCoherence: 99.0,
    rppgPulseBpm: 68,
    aadhaarVaultStatus: 'verified',
    digiLockerReference: 'DL-2026-MH-442189',
    flaggedFrameCount: 0,
    videoDurationSec: 24,
    frames: [
      { frameNumber: 1, timestampSec: 0.0, timecode: '00:00.00', isFlagged: false, anomalyScore: 2.0, description: 'Natural corneal reflections match multi-point studio key light.' },
      { frameNumber: 144, timestampSec: 6.0, timecode: '00:06.00', isFlagged: false, anomalyScore: 2.1, description: 'Hemoglobin absorption fluctuations detected across cheek tissue (68.1 BPM).' },
    ],
    summaryNotes: 'Identity confirmed authentic across all biometric vectors. Pristine biological signal, natural physiological tremor, and verified executive credentials.',
    technicalFinding: 'Skin perfusion indices within natural limits. No compression ghosting or virtual video hardware layer identified.',
    certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
    notarizedAt: '2026-10-29T11:45:00 IST',
    cryptographicHash: 'SHA256: d188e7a4b9c100184716928e990c74921b774c10a90b4112',
    enterpriseClearanceLevel: 'Tier-1 Executive',
    linkedInUrl: 'https://linkedin.com/in/priya-nair-cloud-infra',
    linkedInVerified: true,
    riskSignals: {
      deepfakeArtifactRisk: 2,
      livenessFailureRisk: 3,
      faceMismatchRisk: 3,
      documentMismatchRisk: 2,
      profileInconsistencyRisk: 4,
      overallRiskScore: 3,
      classification: 'VERIFIED_HUMAN',
      rppgBpm: 68,
      rppgSignalQuality: 'Good',
      rppgSnrDb: 19.8,
      blinkRatePerMin: 19,
      headPoseVariance: 0.11,
      landmarkJitterMm: 0.3,
      faceToIdSimilarity: 98.2,
      idDocumentType: 'Passport',
      idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      documentHash: '0x99a1029384710293847102938471029384710293',
      digiLockerStatus: 'verified',
      linkedInClaimMatches: [
        { claim: 'Executive Experience: VP Cloud Infrastructure', matched: true, detail: 'Verified via Reliance Jio enterprise corporate DNS' },
        { claim: 'Passport Biometric Chip', matched: true, detail: 'e-Passport cryptographically signed by ICAO root cert' },
      ],
      explanations: {
        artifacts: 'Optical illumination and specular skin reflection conform precisely to physical key lights.',
        liveness: 'Micro-vascular blood perfusion validated (68 BPM) with high signal-to-noise ratio (+19.8 dB).',
        faceMatch: '98.2% face embedding match with verified e-Passport photograph.',
        document: 'ICAO biometric passport signature validated through DigiLocker e-KYC vault.',
        profile: 'Flawless career alignment across corporate filings and executive leadership registry.',
      },
    },
  },
];

// Helper to compute overall risk using the specified weighted formula
export function calculateExplainableRisk(signals: {
  deepfakeArtifactRisk: number;
  livenessFailureRisk: number;
  faceMismatchRisk: number;
  documentMismatchRisk: number;
  profileInconsistencyRisk: number;
}) {
  const score =
    0.30 * signals.deepfakeArtifactRisk +
    0.25 * signals.livenessFailureRisk +
    0.20 * signals.faceMismatchRisk +
    0.15 * signals.documentMismatchRisk +
    0.10 * signals.profileInconsistencyRisk;

  const rounded = Math.round(score);
  let classification: 'VERIFIED_HUMAN' | 'MANUAL_REVIEW' | 'HIGH_RISK' = 'VERIFIED_HUMAN';
  if (rounded > 60) {
    classification = 'HIGH_RISK';
  } else if (rounded >= 31) {
    classification = 'MANUAL_REVIEW';
  }

  return { overallRiskScore: rounded, classification };
}

export const ENTERPRISE_AUDIT_LOGS = [
  { id: 'LOG-8821', hub: 'Bengaluru', enterprise: 'Tata Consultancy Services', candidate: 'Aarav Sharma', role: 'Lead ML Systems Architect', result: 'Verified Authentic', confidence: '99.4%', date: '2026-10-28 14:32' },
  { id: 'LOG-8822', hub: 'Hyderabad', enterprise: 'Infosys EdgeVerve', candidate: 'Rohan Verma', role: 'Staff Distributed Systems Engineer', result: 'Synthetic Impersonation Blocked', confidence: '18.6%', date: '2026-10-29 16:15' },
  { id: 'LOG-8823', hub: 'Mumbai', enterprise: 'Reliance Jio Digital', candidate: 'Priya Nair', role: 'VP Cloud Infrastructure', result: 'Verified Authentic', confidence: '98.9%', date: '2026-10-29 11:45' },
  { id: 'LOG-8824', hub: 'Pune', enterprise: 'Razorpay Core Engineering', candidate: 'Ananya Deshmukh', role: 'Principal Security Researcher', result: 'Under Tier-2 Review', confidence: '78.4%', date: '2026-10-30 01:10' },
];
