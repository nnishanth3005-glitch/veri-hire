import React, { useState, useEffect, useMemo } from 'react';
import { CandidateDossier, AuditStatus } from '../../types/forensic';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FolderOpen,
  ChevronRight,
  Linkedin,
  UserPlus,
  X,
  Plus,
  ExternalLink,
  RefreshCw,
  Filter,
  Send,
  Sparkles,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { Screen3Report } from './Screen3Report';
import {
  fetchBatchLinkedInVerifications,
  LinkedInProfileData
} from '../../services/linkedInVerificationService';
import { LinkedInProfileCardModal } from '../LinkedInProfileCardModal';

interface Screen2DashboardProps {
  candidates: CandidateDossier[];
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string | null) => void;
  onUpdateCandidateStatus: (id: string, newStatus: AuditStatus) => void;
  onOpenCertificate: () => void;
  onAddCandidate?: (candidate: CandidateDossier) => void;
  onOpenCreateRequestModal?: () => void;
  onOpenCandidatePortal?: () => void;
}

export const Screen2Dashboard: React.FC<Screen2DashboardProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onUpdateCandidateStatus,
  onOpenCertificate,
  onAddCandidate,
  onOpenCreateRequestModal,
  onOpenCandidatePortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AuditStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock Data Fetcher State
  const [linkedInRecords, setLinkedInRecords] = useState<Record<string, LinkedInProfileData>>({});
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(true);
  const [activeProfileModalCandidate, setActiveProfileModalCandidate] = useState<CandidateDossier | null>(null);

  // Run mock data fetcher on mount and whenever candidate list changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLinkedIn(true);

    fetchBatchLinkedInVerifications(candidates)
      .then((records) => {
        if (isMounted) {
          setLinkedInRecords(records);
          setIsLoadingLinkedIn(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingLinkedIn(false);
      });

    return () => {
      isMounted = false;
    };
  }, [candidates]);

  // New Candidate Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('Bengaluru, Karnataka');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newStatus, setNewStatus] = useState<AuditStatus>('authentic');

  // Dynamic status counts reflecting active search query
  const statusCounts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = (c: CandidateDossier) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    };

    const searchMatched = candidates.filter(matchesQuery);

    return {
      all: searchMatched.length,
      synthetic_detected: searchMatched.filter((c) => c.status === 'synthetic_detected').length,
      authentic: searchMatched.filter((c) => c.status === 'authentic').length,
      under_review: searchMatched.filter((c) => c.status === 'under_review').length,
      totalAll: candidates.length,
    };
  }, [candidates, searchQuery]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'synthetic_detected'
          ? c.status === 'synthetic_detected'
          : statusFilter === 'authentic'
          ? c.status === 'authentic'
          : statusFilter === 'under_review'
          ? c.status === 'under_review'
          : true;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim()) return;

    const newId = `DOS-2026-IND-${Math.floor(2000 + Math.random() * 8000)}`;
    const isAuthentic = newStatus === 'authentic';
    const isSynthetic = newStatus === 'synthetic_detected';

    const newDossier: CandidateDossier = {
      id: newId,
      name: newName.trim(),
      role: newRole.trim() || 'Senior Software Engineer',
      organization: newCompany.trim(),
      location: newLocation,
      avatarUrl: isAuthentic
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      interviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: newStatus,
      overallAuthenticityScore: isAuthentic ? 99.1 : isSynthetic ? 19.4 : 76.5,
      livenessConfidence: isAuthentic ? 98.8 : isSynthetic ? 22.0 : 78.0,
      audioVisualSyncScore: isAuthentic ? 99.0 : isSynthetic ? 31.0 : 75.0,
      facialMeshCoherence: isAuthentic ? 99.2 : isSynthetic ? 21.5 : 80.0,
      rppgPulseBpm: isSynthetic ? 0 : 72,
      aadhaarVaultStatus: isSynthetic ? 'tampered' : 'verified',
      digiLockerReference: `DL-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`,
      flaggedFrameCount: isSynthetic ? 12 : 0,
      videoDurationSec: 24,
      summaryNotes: isAuthentic
        ? 'Manual enrollment verified. Biometric micro-pulses and physical ocular motility validated.'
        : isSynthetic
        ? 'Synthetic neural mask detected. Real-time face-swap artifact identified.'
        : 'Under active forensic evaluation.',
      technicalFinding: isSynthetic
        ? '0 BPM rPPG pulse flatline. Fourier checkerboard frequency spikes.'
        : 'Multi-spectral coherence confirmed across 60fps feed.',
      certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
      notarizedAt: new Date().toISOString(),
      cryptographicHash: `SHA256: 0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      enterpriseClearanceLevel: 'Tier-2 Principal',
      linkedInUrl: newLinkedIn.trim() || `https://linkedin.com/in/${newName.toLowerCase().replace(/\s+/g, '-')}`,
      linkedInVerified: isAuthentic,
      frames: [
        {
          frameNumber: 1,
          timestampSec: 0.0,
          timecode: '00:00.00',
          isFlagged: isSynthetic,
          anomalyScore: isSynthetic ? 89.0 : 1.2,
          description: isSynthetic ? 'Diffusion seam detected on boundary' : 'Natural ambient illumination verified',
        },
      ],
      riskSignals: {
        deepfakeArtifactRisk: isSynthetic ? 92 : 4,
        livenessFailureRisk: isSynthetic ? 85 : 6,
        faceMismatchRisk: isSynthetic ? 40 : 4,
        documentMismatchRisk: isSynthetic ? 80 : 2,
        profileInconsistencyRisk: isSynthetic ? 60 : 5,
        overallRiskScore: isSynthetic ? 81 : 4,
        classification: isSynthetic ? 'HIGH_RISK' : 'VERIFIED_HUMAN',
        rppgBpm: isSynthetic ? 0 : 72,
        rppgSignalQuality: isSynthetic ? 'Degraded / Flatline' : 'Good',
        rppgSnrDb: isSynthetic ? -4.5 : 18.2,
        blinkRatePerMin: isSynthetic ? 4 : 18,
        headPoseVariance: 0.12,
        landmarkJitterMm: isSynthetic ? 3.4 : 0.4,
        faceToIdSimilarity: isSynthetic ? 45.0 : 96.0,
        idDocumentType: 'Aadhaar e-KYC',
        idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        documentHash: '0x889104abcdef1234567890',
        digiLockerStatus: isSynthetic ? 'mismatch' : 'verified',
        linkedInClaimMatches: [
          { claim: `Current Org: ${newCompany.trim()}`, matched: isAuthentic, detail: 'DigiLocker cross-match' },
        ],
        explanations: {
          artifacts: isSynthetic ? 'High-frequency GAN grid artifacts' : 'Nominal baseline.',
          liveness: isSynthetic ? '0 BPM rPPG pulse flatline' : '72 BPM pulse confirmed.',
          faceMatch: isSynthetic ? '45% FaceNet similarity' : '96% FaceNet similarity.',
          document: isSynthetic ? 'Signature revoked' : 'DigiLocker valid.',
          profile: isSynthetic ? 'Claim mismatch' : 'Profile verified.',
        },
      },
    };

    if (onAddCandidate) {
      onAddCandidate(newDossier);
    }
    onSelectCandidate(newId);
    setIsAddModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewRole('');
    setNewLinkedIn('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: One-Click Demo Benchmark Scenarios Bar & Recruiter Action */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#3D593D]" />
            <span>Judge Pitch Scenarios:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Scenario 1: Real Candidate */}
            <button
              onClick={() => onSelectCandidate('DOS-2026-IND-0982')}
              className={`h-8 px-3 rounded-lg text-xs font-sans font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                selectedCandidate?.id === 'DOS-2026-IND-0982'
                  ? 'bg-[#3D593D] text-white border-[#3D593D]'
                  : 'bg-[#3D593D]/10 hover:bg-[#3D593D]/20 text-[#3D593D] border-[#3D593D]/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1. Verified Human (Aarav)</span>
            </button>

            {/* Scenario 2: Deepfake FaceSwap */}
            <button
              onClick={() => onSelectCandidate('DOS-2026-IND-0984')}
              className={`h-8 px-3 rounded-lg text-xs font-sans font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                selectedCandidate?.id === 'DOS-2026-IND-0984'
                  ? 'bg-[#B46244] text-white border-[#B46244]'
                  : 'bg-[#B46244]/10 hover:bg-[#B46244]/20 text-[#B46244] border-[#B46244]/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>2. Deepfake Mask (Ananya)</span>
            </button>

            {/* Scenario 3: Identity Mismatch / Proxy Interviewer */}
            <button
              onClick={() => onSelectCandidate('DOS-2026-IND-0986')}
              className={`h-8 px-3 rounded-lg text-xs font-sans font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                selectedCandidate?.id === 'DOS-2026-IND-0986'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3. Proxy Mismatch (Rohan)</span>
            </button>
          </div>
        </div>

        {/* Recruiter / Candidate Workflow Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onOpenCandidatePortal && (
            <button
              onClick={onOpenCandidatePortal}
              className="h-8 px-3 bg-[#FFFFFF] border border-[#3D593D] text-[#3D593D] hover:bg-[#3D593D]/5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Send className="w-3 h-3" />
              <span>Candidate Portal</span>
            </button>
          )}

          {onOpenCreateRequestModal && (
            <button
              onClick={onOpenCreateRequestModal}
              className="h-8 px-3.5 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New Verification Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 40% Left Panel */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 flex flex-col h-[calc(100vh-210px)] min-h-[600px] shadow-xs">
          {/* Left Panel Title with Add Dossier action */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#2A3A2C]">
                Candidate Dossiers
              </h2>
              <span className="font-mono text-xs text-[#2A3A2C]/60">
                {filteredCandidates.length} Active Records
              </span>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 px-2.5 bg-[#2A3A2C] text-white text-[11px] font-sans font-medium rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              title="Add more people to the database"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Person</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#2A3A2C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, company, or ID..."
              className="w-full h-10 pl-9 pr-3 text-xs font-sans text-[#2A3A2C] bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg placeholder-[#2A3A2C]/40 focus:outline-none focus:border-[#2A3A2C] transition-colors"
            />
          </div>

          {/* 4 Status Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8] mb-3 text-center">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`py-2 px-1 text-[11px] font-sans rounded-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                statusFilter === 'all'
                  ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs border-[#E5E0D8]'
                  : 'border-transparent text-[#2A3A2C]/65 hover:text-[#2A3A2C] hover:bg-[#FFFFFF]/50'
              }`}
            >
              <span className="truncate leading-tight font-medium">All</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === 'all' ? 'bg-[#2A3A2C] text-white' : 'bg-[#2A3A2C]/10 text-[#2A3A2C]'
                }`}
              >
                {statusCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('synthetic_detected')}
              className={`py-2 px-1 text-[11px] font-sans rounded-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                statusFilter === 'synthetic_detected'
                  ? 'bg-[#FFFFFF] text-[#B46244] font-semibold shadow-xs border-[#B46244]/40'
                  : 'border-transparent text-[#2A3A2C]/65 hover:text-[#B46244] hover:bg-[#FFFFFF]/50'
              }`}
            >
              <span className="truncate leading-tight font-medium">Flagged</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === 'synthetic_detected' ? 'bg-[#B46244] text-white' : 'bg-[#B46244]/15 text-[#B46244]'
                }`}
              >
                {statusCounts.synthetic_detected}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('authentic')}
              className={`py-2 px-1 text-[11px] font-sans rounded-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                statusFilter === 'authentic'
                  ? 'bg-[#FFFFFF] text-[#3D593D] font-semibold shadow-xs border-[#3D593D]/40'
                  : 'border-transparent text-[#2A3A2C]/65 hover:text-[#3D593D] hover:bg-[#FFFFFF]/50'
              }`}
            >
              <span className="truncate leading-tight font-medium">Verified</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === 'authentic' ? 'bg-[#3D593D] text-white' : 'bg-[#3D593D]/15 text-[#3D593D]'
                }`}
              >
                {statusCounts.authentic}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('under_review')}
              className={`py-2 px-1 text-[11px] font-sans rounded-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                statusFilter === 'under_review'
                  ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs border-[#2A3A2C]/30'
                  : 'border-transparent text-[#2A3A2C]/65 hover:text-[#2A3A2C] hover:bg-[#FFFFFF]/50'
              }`}
            >
              <span className="truncate leading-tight font-medium">Review</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === 'under_review' ? 'bg-[#2A3A2C] text-white' : 'bg-[#2A3A2C]/10 text-[#2A3A2C]'
                }`}
              >
                {statusCounts.under_review}
              </span>
            </button>
          </div>

          {/* Scrolling List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E0D8] pr-1">
            {filteredCandidates.map((candidate) => {
              const isSelected = candidate.id === selectedCandidate?.id;
              const riskScore = candidate.riskSignals?.overallRiskScore ?? Math.round(100 - candidate.overallAuthenticityScore);

              return (
                <div
                  key={candidate.id}
                  onClick={() => onSelectCandidate(candidate.id)}
                  className={`p-3.5 transition-colors cursor-pointer rounded-lg my-1 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#F9F6F0] border-l-2 border-l-[#2A3A2C]'
                      : 'hover:bg-[#F9F6F0]/60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-serif text-sm font-semibold text-[#2A3A2C] truncate">
                          {candidate.name}
                        </h3>
                        {candidate.linkedInUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProfileModalCandidate(candidate);
                            }}
                            className="shrink-0 p-1 text-[#0A66C2] hover:bg-[#0A66C2]/15 rounded transition-colors"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-[#2A3A2C]/60 shrink-0 ml-2">
                        {candidate.id}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-[#2A3A2C]/70 truncate">
                      {candidate.organization} · {candidate.role}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {candidate.riskSignals?.classification === 'VERIFIED_HUMAN' || candidate.status === 'authentic' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3D593D]/10 text-[#3D593D] border border-[#3D593D]/30">
                            <ShieldCheck className="w-3 h-3" /> Real Human (Safe)
                          </span>
                        ) : candidate.riskSignals?.classification === 'HIGH_RISK' || candidate.status === 'synthetic_detected' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B46244]/15 text-[#B46244] border border-[#B46244]/40">
                            <ShieldAlert className="w-3 h-3" /> AI Deepfake (Blocked)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/40">
                            <Clock className="w-3 h-3" /> ID Mismatch (Review)
                          </span>
                        )}

                        <span className="text-[10px] font-sans text-[#2A3A2C]/65 hidden sm:inline">
                          {candidate.riskSignals?.idDocumentType || 'DigiLocker'}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`font-mono text-xs font-extrabold ${
                            riskScore <= 30
                              ? 'text-[#3D593D]'
                              : riskScore <= 60
                              ? 'text-amber-600'
                              : 'text-[#B46244]'
                          }`}
                        >
                          {riskScore <= 30 ? '0 Risk' : `${riskScore}% Risk`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#2A3A2C]' : 'text-[#E5E0D8]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 60% Right Panel */}
        <div className="lg:col-span-7 h-[calc(100vh-210px)] min-h-[600px]">
          {selectedCandidate ? (
            <Screen3Report
              candidate={selectedCandidate}
              onCertifyAuthentic={(id) => onUpdateCandidateStatus(id, 'authentic')}
              onFlagSynthetic={(id) => onUpdateCandidateStatus(id, 'synthetic_detected')}
              onEscalate={(id) => onUpdateCandidateStatus(id, 'under_review')}
              onOpenCertificate={onOpenCertificate}
            />
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-12 h-full flex flex-col items-center justify-center text-center shadow-xs">
              <FolderOpen className="w-12 h-12 text-[#2A3A2C]/40 mb-3" />
              <h3 className="font-serif text-lg font-semibold text-[#2A3A2C]">
                Select a candidate to inspect risk breakdown
              </h3>
            </div>
          )}
        </div>
      </div>

      {/* Add New Candidate Dossier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1C18]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8] mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2A3A2C]" />
                <h3 className="font-serif text-lg font-bold text-[#2A3A2C]">
                  Register Candidate Dossier
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C]/60 hover:text-[#2A3A2C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase text-[#2A3A2C] mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Varun Chawla"
                  className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase text-[#2A3A2C] mb-1">
                    Enterprise / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Wipro Digital"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase text-[#2A3A2C] mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Lead DevSecOps"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-3.5 border border-[#E5E0D8] text-xs font-sans font-medium text-[#2A3A2C] rounded-lg hover:bg-[#F9F6F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enroll Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Linked LinkedIn Profile Card Modal */}
      {activeProfileModalCandidate && (
        <LinkedInProfileCardModal
          candidate={activeProfileModalCandidate}
          profileData={linkedInRecords[activeProfileModalCandidate.id] || null}
          isOpen={Boolean(activeProfileModalCandidate)}
          onClose={() => setActiveProfileModalCandidate(null)}
          onRefreshData={(updated) => {
            setLinkedInRecords((prev) => ({
              ...prev,
              [updated.candidateId]: updated,
            }));
          }}
        />
      )}
    </div>
  );
};
