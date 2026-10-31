import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Video,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Clock,
  ArrowRight,
  Lock,
  Building,
  User,
  Briefcase,
  HelpCircle,
  RefreshCw,
  Camera,
  Check,
  LogOut,
  Sparkles,
  FileText,
  Fingerprint,
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';
import { CandidateDossier, VerificationRequestDraft } from '../types/forensic';
import { calculateExplainableRisk } from '../data/mockCandidates';

interface CandidateUser {
  name?: string;
  email?: string;
  photoUrl?: string;
}

interface CandidatePortalProps {
  requestDraft?: VerificationRequestDraft;
  candidateUser?: CandidateUser;
  onSubmitVerification: (dossier: CandidateDossier) => void;
  onExitPortal: () => void;
}

interface JobOpening {
  id: string;
  title: string;
  organization: string;
  location: string;
  ctc: string;
  type: string;
  department: string;
}

const PRESET_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'JOB-2026-AI-01',
    title: 'Senior AI & ML Platform Engineer',
    organization: 'Tata Consultancy Enterprise Cloud',
    location: 'Mumbai / Hybrid',
    ctc: '₹28,00,000 – ₹36,00,000 / yr',
    type: 'Full-Time',
    department: 'Artificial Intelligence & Sovereign Models',
  },
  {
    id: 'JOB-2026-BE-02',
    title: 'Principal Distributed Systems Architect',
    organization: 'Infosys FinTech Labs',
    location: 'Bengaluru / Hybrid',
    ctc: '₹32,00,000 – ₹42,00,000 / yr',
    type: 'Full-Time',
    department: 'Core Banking Infrastructure',
  },
  {
    id: 'JOB-2026-SEC-03',
    title: 'Senior Cloud Security & Trust Specialist',
    organization: 'Wipro Digital Trust',
    location: 'Hyderabad / Remote',
    ctc: '₹26,00,000 – ₹34,00,000 / yr',
    type: 'Full-Time',
    department: 'Cyber Defense & Biometric Security',
  },
  {
    id: 'JOB-2026-FS-04',
    title: 'Lead Full-Stack Web Systems Engineer',
    organization: 'Enterprise Sovereign Cloud',
    location: 'Pune / Remote',
    ctc: '₹24,00,000 – ₹32,00,000 / yr',
    type: 'Full-Time',
    department: 'Enterprise Talent Cloud',
  },
];

export const CandidatePortal: React.FC<CandidatePortalProps> = ({
  requestDraft,
  candidateUser,
  onSubmitVerification,
  onExitPortal,
}) => {
  // Navigation / Workflow steps: 'job_application' -> 'consent_terms' -> 'digilocker' -> 'webcam' -> 'analyzing' -> 'status_page'
  const [step, setStep] = useState<'job_application' | 'consent_terms' | 'digilocker' | 'webcam' | 'analyzing' | 'status_page'>('job_application');

  // Job Application State
  const [selectedJob, setSelectedJob] = useState<JobOpening>(
    requestDraft
      ? {
          id: 'JOB-REQUESTED',
          title: requestDraft.role,
          organization: requestDraft.organization,
          location: 'Bengaluru / Hybrid',
          ctc: '₹30,00,000 – ₹40,00,000 / yr',
          type: 'Full-Time',
          department: 'Requested Role',
        }
      : PRESET_JOB_OPENINGS[0]
  );
  const [candidateName, setCandidateName] = useState(
    candidateUser?.name || requestDraft?.candidateName || 'Nishanth N'
  );
  const [candidateEmail, setCandidateEmail] = useState(
    candidateUser?.email || requestDraft?.candidateEmail || 'candidate@verihire.demo'
  );
  const [candidatePhone, setCandidatePhone] = useState('+91 98765 43210');
  const [candidateExperience, setCandidateExperience] = useState('4.5 Years');

  // Terms & Conditions and Biometric Consent State
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [biometricConsentAgreed, setBiometricConsentAgreed] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(true);

  // DigiLocker e-KYC state
  const [digiLockerLinked, setDigiLockerLinked] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('8819 0422 9104');
  const [idDocumentType, setIdDocumentType] = useState<'Aadhaar e-KYC' | 'PAN Card' | 'Passport'>('Aadhaar e-KYC');

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [simulatedPulse, setSimulatedPulse] = useState(74);

  // Completed dossier receipt
  const [submittedDossier, setSubmittedDossier] = useState<CandidateDossier | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  // Start webcam when step changes to 'webcam'
  useEffect(() => {
    if (step === 'webcam') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('Webcam permission not granted or device missing:', err);
      setCameraError('Webcam not detected or permission denied. You can proceed with High-Fidelity Camera Simulation.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        setSimulatedPulse(Math.floor(72 + Math.sin(prev * 0.5) * 3));

        if (prev >= 24) {
          clearInterval(timerRef.current);
          handleFinishRecording();
          return 25;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleFinishRecording = () => {
    setIsRecording(false);
    stopCamera();
    setStep('analyzing');

    // Simulate multi-signal risk engine computation
    setTimeout(() => {
      const newDossierId = `DOS-2026-IND-${Math.floor(Math.random() * 9000 + 1000)}`;

      // Calculate signals with clean baseline for authentic candidate
      const signals = {
        deepfakeArtifactRisk: 4.2,
        livenessFailureRisk: 5.1,
        faceMismatchRisk: 3.8,
        documentMismatchRisk: 2.1,
        profileInconsistencyRisk: 4.0,
      };

      const { overallRiskScore, classification } = calculateExplainableRisk(signals);

      const newDossier: CandidateDossier = {
        id: newDossierId,
        name: candidateName,
        role: selectedJob.title,
        organization: selectedJob.organization,
        location: selectedJob.location,
        avatarUrl: candidateUser?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        interviewDate: new Date().toISOString().split('T')[0],
        status: 'authentic',
        overallAuthenticityScore: 97.4,
        livenessConfidence: 96.8,
        audioVisualSyncScore: 97.2,
        facialMeshCoherence: 98.1,
        rppgPulseBpm: simulatedPulse,
        aadhaarVaultStatus: 'verified',
        digiLockerReference: 'DL-2026-KA-889104',
        flaggedFrameCount: 0,
        videoDurationSec: 25,
        frames: [
          { frameNumber: 12, timestampSec: 0.4, timecode: '00:00:00.400', isFlagged: false, anomalyScore: 2.1, description: 'Direct gaze established. Nominal baseline.' },
          { frameNumber: 48, timestampSec: 1.6, timecode: '00:00:01.600', isFlagged: false, anomalyScore: 3.4, description: 'Micro-vascular green-channel capillary pulsation active.' },
          { frameNumber: 124, timestampSec: 4.1, timecode: '00:00:04.100', isFlagged: false, anomalyScore: 4.0, description: 'Blink cycle completed. Zero temporal boundary flicker.' },
          { frameNumber: 210, timestampSec: 7.0, timecode: '00:00:07.000', isFlagged: false, anomalyScore: 3.8, description: '3D head-pose variation aligned with anatomical landmarks.' },
        ],
        summaryNotes: `Candidate verified for ${selectedJob.title} at ${selectedJob.organization}.`,
        technicalFinding: 'Green-channel photoplethysmography confirms normal 74 BPM cardiac perfusion. DigiLocker e-KYC hash validated.',
        notarizedAt: new Date().toISOString(),
        certifyingOfficial: 'DIGILOCKER-SOVEREIGN-SEAL',
        cryptographicHash: `SHA256: ${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        enterpriseClearanceLevel: 'Tier-1 Executive',
        linkedInUrl: 'https://linkedin.com/in/verified-candidate',
        linkedInVerified: true,
        riskSignals: {
          ...signals,
          overallRiskScore,
          classification,
          rppgBpm: simulatedPulse,
          rppgSignalQuality: 'Good',
          rppgSnrDb: 18.2,
          blinkRatePerMin: 18,
          headPoseVariance: 0.12,
          landmarkJitterMm: 0.4,
          faceToIdSimilarity: 96.4,
          idDocumentType: idDocumentType,
          idDocumentPhotoUrl: candidateUser?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          documentHash: '0x881904229104abcdef1234567890',
          digiLockerStatus: 'verified',
          linkedInClaimMatches: [
            { claim: `Current Org: ${selectedJob.organization}`, matched: true, detail: 'Enterprise domain verification match' },
            { claim: 'DigiLocker Identity Cross-Check', matched: true, detail: 'National biometric ledger hash matches video face' },
          ],
          explanations: {
            artifacts: 'Nominal baseline. Negligible residual pixel variance.',
            liveness: 'Spontaneous bilateral blink cycle; 3D facial mesh stability <0.5mm.',
            faceMatch: 'FaceNet cosine similarity 96.4% with DigiLocker ID photo.',
            document: 'DigiLocker certificate cryptographically verified.',
            profile: 'Profile credentials align with interview transcript.',
          },
        },
      };

      setSubmittedDossier(newDossier);
      onSubmitVerification(newDossier);
      setStep('status_page');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A2C] flex flex-col font-sans w-full overflow-x-hidden">
      {/* Top Banner: Candidate Secure Verification Header (ALWAYS VISIBLE SIGN OUT BUTTON, NO HORIZONTAL SCROLL) */}
      <header className="bg-[#FFFFFF] border-b border-[#E5E0D8] py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 w-full">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#2A3A2C] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold text-[#2A3A2C] block leading-tight">
                  VeriHire
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D593D]/10 text-[#3D593D] font-bold border border-[#3D593D]/20">
                  Candidate Portal
                </span>
              </div>
              <span className="text-[11px] font-sans text-[#2A3A2C]/60 block">
                Job Application & Sovereign Biometric Verification
              </span>
            </div>
          </div>

          {/* Right: Candidate User Badge + Direct Sign Out Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* User details badge */}
            <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#2A3A2C]/80 bg-[#F9F6F0] px-3 py-1.5 rounded-lg border border-[#E5E0D8]">
              {candidateUser?.photoUrl ? (
                <img
                  src={candidateUser.photoUrl}
                  alt={candidateName}
                  className="w-5 h-5 rounded-full object-cover border border-[#E5E0D8]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#2A3A2C] text-white text-[10px] flex items-center justify-center font-bold">
                  {candidateName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-semibold text-xs leading-none text-[#2A3A2C]">
                  {candidateName}
                </span>
                <span className="text-[10px] font-mono text-[#2A3A2C]/60 leading-tight">
                  {candidateEmail}
                </span>
              </div>
            </div>

            {/* Direct Sign Out Button (Prominent & Always Visible Without Scrolling) */}
            <button
              onClick={onExitPortal}
              title="Sign Out of Candidate Portal"
              className="h-9 px-3.5 rounded-lg border border-[#B46244]/40 bg-[#B46244]/10 text-[#B46244] hover:bg-[#B46244] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors text-xs font-sans font-semibold shrink-0 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        {/* Step Progress Indicator (Interactive & Clearly Visible) */}
        {step !== 'status_page' && (
          <div className="mb-8 w-full bg-[#FFFFFF] p-3 sm:p-4 rounded-xl border border-[#E5E0D8] shadow-xs">
            <div className="flex items-center justify-between overflow-x-auto gap-2">
              {/* Step 1: Job Application */}
              <button
                type="button"
                onClick={() => setStep('job_application')}
                className={`flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer ${
                  step === 'job_application' ? 'text-[#2A3A2C]' : 'text-[#3D593D]'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    step === 'job_application'
                      ? 'bg-[#2A3A2C] text-white ring-2 ring-[#2A3A2C]/20'
                      : 'bg-[#3D593D] text-white'
                  }`}
                >
                  1
                </span>
                <span className="hidden sm:inline">1. Job Application</span>
                <span className="sm:hidden">1. Job</span>
              </button>

              <div className="w-6 sm:w-10 h-0.5 bg-[#E5E0D8] shrink-0" />

              {/* Step 2: Terms & DPDP Consent */}
              <button
                type="button"
                onClick={() => setStep('consent_terms')}
                className={`flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer ${
                  step === 'consent_terms'
                    ? 'text-[#2A3A2C]'
                    : termsAgreed && biometricConsentAgreed
                    ? 'text-[#3D593D]'
                    : 'text-[#2A3A2C]/50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    step === 'consent_terms'
                      ? 'bg-[#2A3A2C] text-white ring-2 ring-[#2A3A2C]/20'
                      : termsAgreed && biometricConsentAgreed
                      ? 'bg-[#3D593D] text-white'
                      : 'bg-[#E5E0D8] text-[#2A3A2C]/60'
                  }`}
                >
                  2
                </span>
                <span className="hidden sm:inline">2. Terms & Consent</span>
                <span className="sm:hidden">2. Terms</span>
              </button>

              <div className="w-6 sm:w-10 h-0.5 bg-[#E5E0D8] shrink-0" />

              {/* Step 3: DigiLocker e-KYC */}
              <button
                type="button"
                onClick={() => {
                  if (termsAgreed && biometricConsentAgreed) setStep('digilocker');
                }}
                className={`flex items-center gap-2 text-xs font-semibold shrink-0 ${
                  termsAgreed && biometricConsentAgreed ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                } ${
                  step === 'digilocker'
                    ? 'text-[#2A3A2C]'
                    : digiLockerLinked
                    ? 'text-[#3D593D]'
                    : 'text-[#2A3A2C]/50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    step === 'digilocker'
                      ? 'bg-[#2A3A2C] text-white ring-2 ring-[#2A3A2C]/20'
                      : digiLockerLinked
                      ? 'bg-[#3D593D] text-white'
                      : 'bg-[#E5E0D8] text-[#2A3A2C]/60'
                  }`}
                >
                  3
                </span>
                <span className="hidden sm:inline">3. DigiLocker e-KYC</span>
                <span className="sm:hidden">3. e-KYC</span>
              </button>

              <div className="w-6 sm:w-10 h-0.5 bg-[#E5E0D8] shrink-0" />

              {/* Step 4: Webcam Interview */}
              <button
                type="button"
                onClick={() => {
                  if (digiLockerLinked) setStep('webcam');
                }}
                className={`flex items-center gap-2 text-xs font-semibold shrink-0 ${
                  digiLockerLinked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                } ${step === 'webcam' || step === 'analyzing' ? 'text-[#2A3A2C]' : 'text-[#2A3A2C]/50'}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    step === 'webcam' || step === 'analyzing'
                      ? 'bg-[#2A3A2C] text-white ring-2 ring-[#2A3A2C]/20'
                      : 'bg-[#E5E0D8] text-[#2A3A2C]/60'
                  }`}
                >
                  4
                </span>
                <span className="hidden sm:inline">4. 25s Webcam</span>
                <span className="sm:hidden">4. Webcam</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 1: JOB APPLICATION & CANDIDATE PROFILE (OPEN & VISIBLE)
            ======================================================== */}
        {step === 'job_application' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-[#E5E0D8] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#3D593D] font-bold block mb-1">
                    Step 1 of 4 · Employment Application
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A3A2C]">
                    Apply for Open Position & Start Verification
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-[#F9F6F0] px-3 py-1.5 rounded-lg border border-[#E5E0D8] text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#3D593D]" />
                  <span>Enterprise Talent Gateway</span>
                </div>
              </div>

              {/* Job Selection Grid */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A3A2C]/80 font-mono">
                  Select Job Opening you are applying for:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {PRESET_JOB_OPENINGS.map((job) => {
                    const isSelected = selectedJob.id === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#2A3A2C] bg-[#F9F6F0] shadow-sm'
                            : 'border-[#E5E0D8] bg-[#FFFFFF] hover:border-[#2A3A2C]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[10px] text-[#2A3A2C]/60 block mb-0.5">
                              {job.department}
                            </span>
                            <h3 className="font-serif font-bold text-sm text-[#2A3A2C]">
                              {job.title}
                            </h3>
                            <p className="text-xs font-medium text-[#2A3A2C]/70 mt-1 flex items-center gap-1.5">
                              <Building className="w-3 h-3 text-[#2A3A2C]/60" />
                              <span>{job.organization}</span>
                            </p>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-[#2A3A2C] bg-[#2A3A2C]' : 'border-[#E5E0D8]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#E5E0D8] flex items-center justify-between text-[11px] font-mono text-[#2A3A2C]/70">
                          <span>{job.location}</span>
                          <span className="font-semibold text-[#3D593D]">{job.ctc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Profile Details */}
              <div className="p-4 sm:p-5 bg-[#F9F6F0] rounded-xl border border-[#E5E0D8] space-y-4 mb-6">
                <span className="font-mono text-xs font-bold text-[#2A3A2C] block">
                  Your Candidate Application Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Nishanth N"
                      className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                      Contact Email (Verified via Google / SSO)
                    </label>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                      Mobile / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                      Relevant Experience
                    </label>
                    <input
                      type="text"
                      value={candidateExperience}
                      onChange={(e) => setCandidateExperience(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                    />
                  </div>
                </div>
              </div>

              {/* Action: Proceed to Terms & Conditions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs font-sans text-[#2A3A2C]/70">
                  Applying for: <strong className="text-[#2A3A2C]">{selectedJob.title}</strong> at {selectedJob.organization}
                </span>

                <button
                  type="button"
                  onClick={() => setStep('consent_terms')}
                  className="w-full sm:w-auto h-11 px-6 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Apply & Review Terms and Conditions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: TERMS AND CONDITIONS & BIOMETRIC CONSENT (OPEN & VISIBLE)
            ======================================================== */}
        {step === 'consent_terms' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#E5E0D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#3D593D] font-bold block mb-1">
                  Step 2 of 4 · Terms & Statutory Disclosure
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2A3A2C]">
                  Terms and Conditions & DPDP Act 2023 Consent
                </h2>
              </div>
              <span className="px-3 py-1 bg-[#3D593D]/10 text-[#3D593D] border border-[#3D593D]/30 rounded-lg text-xs font-mono font-semibold">
                UIDAI & Indian DPDP Act Compliant
              </span>
            </div>

            {/* Application Summary Box */}
            <div className="p-3.5 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#2A3A2C]/60 block font-mono text-[10px] uppercase">Applicant</span>
                <span className="font-bold text-[#2A3A2C]">{candidateName} ({candidateEmail})</span>
              </div>
              <div className="text-right">
                <span className="text-[#2A3A2C]/60 block font-mono text-[10px] uppercase">Applying For</span>
                <span className="font-semibold text-[#2A3A2C]">{selectedJob.title}</span>
              </div>
            </div>

            {/* Terms and Conditions Accordion Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#2A3A2C] uppercase tracking-wider">
                  VeriHire Enterprise Biometric & Identity Terms
                </span>
                <button
                  type="button"
                  onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                  className="text-xs text-[#2A3A2C]/60 hover:text-[#2A3A2C] underline cursor-pointer"
                >
                  {isTermsExpanded ? 'Collapse Terms' : 'Expand Full Terms'}
                </button>
              </div>

              {isTermsExpanded && (
                <div className="p-4 bg-[#F9F6F0] rounded-xl border border-[#E5E0D8] space-y-3 text-xs leading-relaxed max-h-72 overflow-y-auto">
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#2A3A2C]">1. Purpose of Processing & Employment Verification</h4>
                    <p className="text-[#2A3A2C]/80">
                      VeriHire processes candidate interview telemetry solely to confirm biological human presence, prevent generative deepfake impersonation, and verify credentials against government identity databases for employment consideration.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-[#2A3A2C]">2. Biometric Modalities & Remote Photoplethysmography (rPPG)</h4>
                    <p className="text-[#2A3A2C]/80">
                      During the 20–25 second webcam interview, passive optical sensors measure micro-vascular blood flow fluctuations (rPPG) in forehead and cheek regions to detect authentic cardiovascular pulse rhythm (42–240 BPM). 3D facial landmark jitter is examined to detect generative virtual camera loops.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-[#2A3A2C]">3. DigiLocker Government Credential Cross-Check</h4>
                    <p className="text-[#2A3A2C]/80">
                      You authorize VeriHire via the National API Setu sandbox to cross-reference your Aadhaar or PAN photo embedding against the webcam recording. Cosine similarity score is certified cryptographically.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-[#2A3A2C]">4. Data Retention, Sovereignty & Erasure (Indian DPDP Act 2023)</h4>
                    <p className="text-[#2A3A2C]/80">
                      In compliance with the Digital Personal Data Protection Act 2023, raw biometric video and audio frames are strictly stored in Indian cloud zones and purged post-review. A non-reversible SHA-256 cryptographic hash is recorded on the tamper-evident audit ledger.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-[#2A3A2C]">5. Right to Withdraw Consent</h4>
                    <p className="text-[#2A3A2C]/80">
                      You retain the absolute right to abort the verification session at any time prior to clicking 'Submit'. No biometric data is preserved upon withdrawal.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Explicit Consent Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 bg-[#FFFFFF] border-2 border-[#E5E0D8] rounded-xl cursor-pointer hover:border-[#2A3A2C] transition-colors">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#2A3A2C] focus:ring-[#2A3A2C] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-sans text-[#2A3A2C] leading-snug">
                  <strong>Terms and Conditions Agreement:</strong> I have read, understood, and agree to the VeriHire Employment Integrity Terms and Conditions.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-[#FFFFFF] border-2 border-[#E5E0D8] rounded-xl cursor-pointer hover:border-[#2A3A2C] transition-colors">
                <input
                  type="checkbox"
                  checked={biometricConsentAgreed}
                  onChange={(e) => setBiometricConsentAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#2A3A2C] focus:ring-[#2A3A2C] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-sans text-[#2A3A2C] leading-snug">
                  <strong>Statutory Biometric Consent:</strong> I voluntarily authorize VeriHire to record a 20–25s webcam interview for automated rPPG cardiovascular pulse estimation, 3D facial motion analysis, and DigiLocker ID match.
                </span>
              </label>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setStep('job_application')}
                className="text-xs font-sans text-[#2A3A2C]/60 hover:text-[#2A3A2C] cursor-pointer"
              >
                ← Back to Job Selection
              </button>

              <button
                type="button"
                disabled={!termsAgreed || !biometricConsentAgreed}
                onClick={() => setStep('digilocker')}
                className="h-11 px-6 bg-[#2A3A2C] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <span>Accept Terms & Proceed to DigiLocker ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: DIGILOCKER GOVERNMENT ID MATCH (OPEN & VISIBLE)
            ======================================================== */}
        {step === 'digilocker' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#E5E0D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#3D593D] font-bold block mb-1">
                  Step 3 of 4 · Government Credential Retrieval
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2A3A2C]">
                  DigiLocker Sandbox Verification
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#3D593D]/10 text-[#3D593D] font-bold border border-[#3D593D]/30">
                API Setu Sandbox Active
              </span>
            </div>

            <p className="text-xs text-[#2A3A2C]/80 leading-relaxed">
              Verify your official national identity document. VeriHire extracts the cryptographic reference photograph and SHA-256 hash to compare with your live webcam interview.
            </p>

            <div className="p-5 bg-[#F9F6F0] rounded-xl border border-[#E5E0D8] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1 font-mono">
                    Credential Type
                  </label>
                  <select
                    value={idDocumentType}
                    onChange={(e: any) => setIdDocumentType(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  >
                    <option value="Aadhaar e-KYC">Aadhaar Card (UIDAI e-KYC)</option>
                    <option value="PAN Card">PAN Card (Income Tax Dept)</option>
                    <option value="Passport">Passport (Ministry of External Affairs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1 font-mono">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  />
                </div>
              </div>

              {digiLockerLinked ? (
                <div className="p-4 bg-[#3D593D]/10 border border-[#3D593D]/30 rounded-xl flex items-center gap-3 text-xs text-[#3D593D]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold block">
                      DigiLocker Record Successfully Retrieved & Cryptographically Verified!
                    </span>
                    <span className="text-[11px] text-[#3D593D]/80 block font-mono mt-0.5">
                      SHA-256 Registered: 0x881904229104abcdef1234567890 · Portrait Reference Extracted
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDigiLockerLinked(true)}
                  className="w-full h-11 bg-[#FFFFFF] border-2 border-[#3D593D] text-[#3D593D] hover:bg-[#3D593D]/5 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Fetch & Verify via DigiLocker Sandbox API</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setStep('consent_terms')}
                className="text-xs font-sans text-[#2A3A2C]/60 hover:text-[#2A3A2C] cursor-pointer"
              >
                ← Back to Terms
              </button>

              <button
                type="button"
                disabled={!digiLockerLinked}
                onClick={() => setStep('webcam')}
                className="h-11 px-6 bg-[#2A3A2C] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <span>Proceed to Guided Webcam Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: 20-25s GUIDED WEBCAM INTERVIEW (OPEN & VISIBLE)
            ======================================================== */}
        {step === 'webcam' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#E5E0D8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#3D593D] font-bold block mb-0.5">
                  Step 4 of 4 · Guided Biometric Interview
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A3A2C]">
                  20–25 Second Live Identity Verification
                </h2>
              </div>

              {/* Countdown clock */}
              <div className="flex items-center gap-2 font-mono text-xs font-bold px-3 py-1.5 bg-[#F9F6F0] border border-[#E5E0D8] rounded-lg">
                <Clock className="w-4 h-4 text-[#B46244]" />
                <span>{String(recordingSeconds).padStart(2, '0')}s / 25s</span>
              </div>
            </div>

            {/* Guidance Prompts for Candidate */}
            <div className="p-3.5 bg-[#F9F6F0] rounded-xl border border-[#E5E0D8] text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-[#3D593D] block">
                Guided Audio-Visual Prompt:
              </span>
              <p className="text-[#2A3A2C] font-semibold text-sm">
                {recordingSeconds < 6
                  ? 'Prompt 1: "Look directly into the lens and state your full name."'
                  : recordingSeconds < 13
                  ? `Prompt 2: "State the role: '${selectedJob.title}'."`
                  : recordingSeconds < 20
                  ? 'Prompt 3: "Turn your head slowly left and right to verify 3D depth."'
                  : 'Final check: Maintain direct eye contact with the camera.'}
              </p>
            </div>

            {/* Video Viewport Container */}
            <div className="relative w-full aspect-video bg-[#1A241C] rounded-xl overflow-hidden border border-[#E5E0D8] flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-white/50 mx-auto" />
                  <p className="text-xs text-white/80 font-sans">
                    Camera Simulation Mode Enabled (Ready for Test)
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded transition-colors"
                  >
                    Retry Webcam Connection
                  </button>
                </div>
              )}

              {/* Real-time Facial Mesh Bounding Box Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-60 border-2 border-dashed border-[#6B8E6B] rounded-3xl relative flex items-center justify-center opacity-80">
                  <span className="absolute -top-3 bg-[#2A3A2C] text-[#F9F6F0] text-[9px] font-mono px-2 py-0.5 rounded">
                    Forehead & Cheek rPPG ROI
                  </span>
                  {/* Subtle scanning line */}
                  {isRecording && (
                    <div className="w-full h-0.5 bg-[#6B8E6B] animate-pulse shadow-xs" />
                  )}
                </div>
              </div>

              {/* Real-Time Pulse Rate Telemetry Overlay */}
              <div className="absolute bottom-4 left-4 bg-[#2A3A2C]/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#E57373] animate-ping" />
                <span>rPPG Pulse: {isRecording ? `${simulatedPulse} BPM` : '74 BPM (Standby)'}</span>
              </div>

              {isRecording && (
                <div className="absolute top-4 right-4 bg-[#B46244] text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>RECORDING</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('digilocker')}
                className="text-xs font-sans text-[#2A3A2C]/60 hover:text-[#2A3A2C] cursor-pointer"
              >
                ← Back to DigiLocker
              </button>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="h-11 px-6 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start 25s Verification Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishRecording}
                    className="h-11 px-6 bg-[#B46244] hover:bg-[#9B4D33] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Finish & Submit Early</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: ANALYZING STATE
            ======================================================== */}
        {step === 'analyzing' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-8 max-w-md mx-auto w-full text-center space-y-4 shadow-sm">
            <RefreshCw className="w-10 h-10 text-[#3D593D] animate-spin mx-auto" />
            <h2 className="font-serif text-xl font-bold text-[#2A3A2C]">
              Cryptographically Sealing Verification
            </h2>
            <p className="text-xs text-[#2A3A2C]/70 font-sans leading-relaxed">
              Extracting rPPG capillary signal, verifying facial landmark consistency against DigiLocker national credential ledger...
            </p>
            <div className="h-1.5 w-full bg-[#E5E0D8] rounded-full overflow-hidden">
              <div className="h-full bg-[#2A3A2C] animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 6: CANDIDATE STATUS PAGE (PROTECTED & INSULATED)
            ======================================================== */}
        {step === 'status_page' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 sm:p-8 max-w-xl mx-auto w-full text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#3D593D]/10 border-2 border-[#3D593D] flex items-center justify-center text-[#3D593D] mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#3D593D] font-bold block mb-1">
                Verification Sealed & Successfully Submitted
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2A3A2C]">
                Thank You, {candidateName}
              </h2>
              <p className="text-xs font-sans text-[#2A3A2C]/70 mt-1">
                Your biometric recording, DigiLocker validation, and job application are securely notarized.
              </p>
            </div>

            {/* Candidate-facing status card (NO internal risk math or override tools!) */}
            <div className="p-4 sm:p-5 bg-[#F9F6F0] rounded-xl border border-[#E5E0D8] text-left space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E0D8]">
                <span className="font-mono text-xs text-[#2A3A2C]/70 font-semibold">
                  Application Status
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3D593D]/10 text-[#3D593D] border border-[#3D593D]/30 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Submitted & Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[#2A3A2C]/60 uppercase block">Employer</span>
                  <span className="font-semibold text-[#2A3A2C]">{selectedJob.organization}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#2A3A2C]/60 uppercase block">Position Applied</span>
                  <span className="font-semibold text-[#2A3A2C]">{selectedJob.title}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#2A3A2C]/60 uppercase block">Case Dossier Reference</span>
                  <span className="font-mono text-[11px] text-[#2A3A2C]">{submittedDossier?.id || 'DOS-2026-IND-0982'}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#2A3A2C]/60 uppercase block">DigiLocker Verification</span>
                  <span className="font-mono text-[11px] text-[#3D593D] font-semibold">Matched e-KYC Valid</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E0D8] text-[11px] font-mono text-[#2A3A2C]/60">
                <span>Receipt Hash: {submittedDossier?.cryptographicHash || 'SHA256: 0x881904229104abcdef1234567890'}</span>
              </div>
            </div>

            <p className="text-xs font-sans text-[#2A3A2C]/70 leading-relaxed">
              The hiring panel and forensic audit desk have received your notarized submission. You will be contacted regarding next steps.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('job_application')}
                className="w-full sm:flex-1 h-11 border border-[#E5E0D8] bg-[#FFFFFF] hover:bg-[#F9F6F0] text-[#2A3A2C] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply for Another Role
              </button>

              <button
                type="button"
                onClick={onExitPortal}
                className="w-full sm:flex-1 h-11 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Out / Exit Portal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E0D8] bg-[#FFFFFF] py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-[#2A3A2C]/60">
          <span>VeriHire Candidate Portal · TLS 256-Bit Encrypted Biometric Session</span>
          <div className="flex items-center gap-3">
            <span>DPDP Act 2023 Compliant</span>
            <span>·</span>
            <span>UIDAI Verified e-KYC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
