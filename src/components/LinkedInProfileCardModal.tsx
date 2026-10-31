import React, { useState } from 'react';
import {
  Linkedin,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RefreshCw,
  X,
  CheckCircle2,
  Building,
  MapPin,
  Users,
  Award,
  Hash,
  Lock,
  ArrowLeft,
  ArrowRight,
  Globe,
  Briefcase,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';
import { LinkedInProfileData, fetchCandidateLinkedInVerification } from '../services/linkedInVerificationService';
import { CandidateDossier } from '../types/forensic';

interface LinkedInProfileCardModalProps {
  candidate: CandidateDossier;
  profileData: LinkedInProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: (updated: LinkedInProfileData) => void;
}

export const LinkedInProfileCardModal: React.FC<LinkedInProfileCardModalProps> = ({
  candidate,
  profileData,
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentData, setCurrentData] = useState<LinkedInProfileData | null>(profileData);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const data = currentData || profileData;
  const isMatched = data?.verificationStatus === 'Profile Matched';
  const isFlagged = data?.verificationStatus === 'Mismatch Flagged';

  const profileUrl = candidate.linkedInUrl || data?.profileUrl || `https://www.linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleReverify = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await fetchCandidateLinkedInVerification(candidate, 800);
      setCurrentData(refreshed);
      if (onRefreshData) {
        onRefreshData(refreshed);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C18]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:hidden">
      {/* Outer Browser Frame Container */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[820px] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Browser Chrome Window Header */}
        <div className="bg-[#F4F1EA] border-b border-[#E5E0D8] px-4 py-2.5 flex items-center justify-between gap-3 select-none">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#E57373] hover:opacity-80 transition-opacity cursor-pointer"
              title="Close Sandbox View"
            />
            <div className="w-3 h-3 rounded-full bg-[#FFB74D]" />
            <div className="w-3 h-3 rounded-full bg-[#81C784]" />
            
            {/* Nav controls */}
            <div className="hidden sm:flex items-center gap-1 ml-3 text-[#2A3A2C]/50">
              <button className="p-1 rounded hover:bg-[#E5E0D8]/60 cursor-not-allowed opacity-40">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded hover:bg-[#E5E0D8]/60 cursor-not-allowed opacity-40">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReverify}
                disabled={isRefreshing}
                className="p-1 rounded hover:bg-[#E5E0D8]/60 hover:text-[#2A3A2C] transition-colors cursor-pointer"
                title="Reload simulated iframe"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Browser Address Bar */}
          <div className="flex-1 max-w-lg mx-2 bg-[#FFFFFF] border border-[#E5E0D8] rounded-md px-3 py-1 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 text-xs font-mono text-[#2A3A2C]/80">
              <Lock className="w-3.5 h-3.5 text-[#3D593D] shrink-0" />
              <span className="truncate">{profileUrl}</span>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#3D593D]/10 text-[#3D593D]">
                TLS 1.3 SECURE
              </span>
              <button
                onClick={handleCopyUrl}
                className="p-1 text-[#2A3A2C]/60 hover:text-[#2A3A2C] cursor-pointer"
                title="Copy profile link"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-[#3D593D]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Window Actions */}
          <div className="flex items-center gap-1.5">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#2A3A2C]/70 hover:text-[#0A66C2] rounded hover:bg-[#E5E0D8]/50 transition-colors"
              title="Open real profile in external browser tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-[#2A3A2C]/70 hover:text-[#B46244] rounded hover:bg-[#E5E0D8]/50 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Forensic Sandbox Notice Bar */}
        <div className="bg-[#2A3A2C] text-[#F9F6F0] px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-[#2A3A2C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
            <span>SANDBOX EMBED · ISOLATED DOMAIN SIMULATOR (VERIHIRE FORENSIC RUNTIME)</span>
          </div>
          <span className="hidden sm:inline opacity-70">
            Dossier ID: {candidate.id}
          </span>
        </div>

        {/* Simulated Iframe Viewport Content */}
        <div className="flex-1 overflow-y-auto bg-[#F3F2EF]">
          
          {/* Simulated LinkedIn Navigation Bar */}
          <div className="bg-[#FFFFFF] border-b border-[#E5E0D8] px-4 py-2 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
                in
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#EDF3F8] rounded-md px-2.5 py-1 text-xs text-[#2A3A2C]/60">
                <Globe className="w-3.5 h-3.5" />
                <span className="font-sans">Search professionals, articles, companies...</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-sans text-[#2A3A2C]/70">
              <span className="font-semibold text-[#0A66C2] border-b-2 border-[#0A66C2] pb-0.5">Profile</span>
              <span className="hidden sm:inline hover:text-[#2A3A2C]">Experience</span>
              <span className="hidden sm:inline hover:text-[#2A3A2C]">Recommendations</span>
              <span className="hidden sm:inline hover:text-[#2A3A2C]">Credentials</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-4 space-y-4">
            
            {/* Candidate Profile Card in Iframe */}
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg overflow-hidden shadow-xs">
              
              {/* Profile Background Banner */}
              <div className="h-28 bg-linear-to-r from-[#1E293B] via-[#0A66C2] to-[#0284C7] relative p-3 flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-wider font-semibold bg-black/40 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                  PROFESSIONAL IDENTITY RECORD
                </span>
                <span className="text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded">
                  Status: 200 OK
                </span>
              </div>

              {/* Profile Header Details */}
              <div className="px-5 pb-5 pt-0 relative">
                <div className="flex justify-between items-end -mt-12 mb-3">
                  <div className="w-24 h-24 rounded-full border-4 border-[#FFFFFF] overflow-hidden bg-[#F9F6F0] shadow-md relative">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                    {isMatched && (
                      <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A66C2] border-2 border-white flex items-center justify-center text-white" title="Verified Badge">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Verification Pill */}
                  <div className="mb-2">
                    {isMatched && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-[#3D593D]/12 text-[#3D593D] border border-[#3D593D]/30 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Profile Matched</span>
                      </span>
                    )}
                    {isFlagged && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-[#B46244]/15 text-[#B46244] border border-[#B46244]/30 shadow-xs">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Mismatch Flagged</span>
                      </span>
                    )}
                    {!isMatched && !isFlagged && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-[#2A3A2C]/10 text-[#2A3A2C] border border-[#E5E0D8] shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Identity Information */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-[#2A3A2C]">
                      {candidate.name}
                    </h3>
                    <span className="text-xs font-mono text-[#2A3A2C]/50">
                      ({candidate.id})
                    </span>
                  </div>

                  <p className="text-sm font-sans text-[#2A3A2C]/85 mt-1 font-medium">
                    {data?.headline || `${candidate.role} at ${candidate.organization}`}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-sans text-[#2A3A2C]/70">
                    <span className="flex items-center gap-1 font-medium text-[#2A3A2C]">
                      <Building className="w-3.5 h-3.5 text-[#2A3A2C]/50" />
                      <span>{candidate.organization}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2A3A2C]/50" />
                      <span>{candidate.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#0A66C2] font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{data?.connections || '500+ connections'}</span>
                    </span>
                  </div>

                  {/* LinkedIn Action Buttons (Mocked) */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E5E0D8]">
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-[#0A66C2] text-white text-xs font-sans font-semibold rounded-full hover:bg-[#084e96] transition-colors flex items-center gap-1.5"
                    >
                      <span>Connect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      className="px-4 py-1.5 border border-[#0A66C2] text-[#0A66C2] text-xs font-sans font-semibold rounded-full hover:bg-[#0A66C2]/10 transition-colors"
                    >
                      Message
                    </button>
                    <button
                      type="button"
                      onClick={handleReverify}
                      disabled={isRefreshing}
                      className="px-3 py-1.5 border border-[#E5E0D8] text-[#2A3A2C]/70 text-xs font-sans font-medium rounded-full hover:bg-[#F9F6F0] transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span>{isRefreshing ? 'Re-auditing...' : 'Re-verify Feed'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Inspection Suite Overlay in Iframe */}
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E0D8]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2A3A2C]" />
                  <h4 className="font-serif text-sm font-bold text-[#2A3A2C]">
                    Forensic Cross-Reference Intelligence
                  </h4>
                </div>
                <span className="font-mono text-[10px] text-[#2A3A2C]/60">
                  SHA-256 LEDGER CHECK
                </span>
              </div>

              {/* 2x2 Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2.5 bg-[#F9F6F0] rounded border border-[#E5E0D8]">
                  <span className="block text-[10px] font-mono uppercase text-[#2A3A2C]/60">
                    Biometric Face Embedding Distance
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`font-mono text-lg font-bold ${isMatched ? 'text-[#3D593D]' : isFlagged ? 'text-[#B46244]' : 'text-[#2A3A2C]'}`}>
                      {data?.faceEmbeddingDistance.toFixed(2) || '0.08'}
                    </span>
                    <span className="text-[10px] text-[#2A3A2C]/60">
                      {isMatched ? '(Cosine ≤ 0.20 Match)' : '(High Divergence)'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#F9F6F0] rounded border border-[#E5E0D8]">
                  <span className="block text-[10px] font-mono uppercase text-[#2A3A2C]/60">
                    Employment History Consensus
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`font-mono text-lg font-bold ${isMatched ? 'text-[#3D593D]' : 'text-[#2A3A2C]'}`}>
                      {isMatched ? '100% Match' : isFlagged ? 'Conflict Flagged' : 'Pending'}
                    </span>
                    <span className="text-[10px] text-[#2A3A2C]/60">
                      {data?.employmentHistoryYears || 5} yrs declared
                    </span>
                  </div>
                </div>
              </div>

              {/* Forensic finding note */}
              <div className={`p-3 rounded border text-xs font-sans ${
                isMatched
                  ? 'bg-[#3D593D]/8 border-[#3D593D]/30 text-[#2A3A2C]'
                  : isFlagged
                  ? 'bg-[#B46244]/10 border-[#B46244]/30 text-[#B46244]'
                  : 'bg-[#F9F6F0] border-[#E5E0D8] text-[#2A3A2C]'
              }`}>
                <span className="font-semibold block mb-0.5">
                  {isMatched ? 'Attestation Consensus: Identity Confirmed' : isFlagged ? 'Alert: Potential Identity Spoofing' : 'Status Note'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {data?.auditNotes}
                </p>
              </div>

              {/* Cryptographic hash */}
              <div className="mt-2.5 pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-[10px] font-mono text-[#2A3A2C]/60">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>{data?.crossReferenceHash}</span>
                </span>
                <span>Verified: {data?.verifiedAt ? new Date(data.verifiedAt).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>

            {/* Experience Section in Iframe */}
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-[#2A3A2C]" />
                <h4 className="font-serif text-sm font-bold text-[#2A3A2C]">
                  Experience Record
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-[#F9F6F0] border border-[#E5E0D8] flex items-center justify-center font-bold text-[#2A3A2C] text-sm shrink-0">
                    <Building className="w-5 h-5 text-[#2A3A2C]/60" />
                  </div>
                  <div>
                    <h5 className="text-xs font-sans font-bold text-[#2A3A2C]">
                      {candidate.role}
                    </h5>
                    <p className="text-xs text-[#2A3A2C]/80 font-medium">
                      {candidate.organization} · Full-time
                    </p>
                    <p className="text-[11px] font-mono text-[#2A3A2C]/50 mt-0.5">
                      2021 — Present · {candidate.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Credentials */}
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-[#2A3A2C]" />
                <h4 className="font-serif text-sm font-bold text-[#2A3A2C]">
                  Education & Verified Certifications
                </h4>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-[#F9F6F0] border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] shrink-0">
                  <Award className="w-5 h-5 text-[#2A3A2C]/60" />
                </div>
                <div>
                  <h5 className="text-xs font-sans font-bold text-[#2A3A2C]">
                    Indian Institute of Technology (IIT)
                  </h5>
                  <p className="text-xs text-[#2A3A2C]/80">
                    B.Tech / M.Tech in Computer Science & Applied Biometrics
                  </p>
                  <p className="text-[11px] font-mono text-[#2A3A2C]/50 mt-0.5">
                    Clearance: {candidate.enterpriseClearanceLevel}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#F4F1EA] border-t border-[#E5E0D8] px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#2A3A2C]/70">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0A66C2]" />
            <span>LINKEDIN APPLIED CROSS-REFERENCE API V2</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3.5 bg-[#0A66C2] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#084e96] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Open in Real Browser</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={onClose}
              className="h-8 px-3.5 bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-sans font-medium text-[#2A3A2C] rounded-lg hover:bg-[#F9F6F0] transition-colors cursor-pointer"
            >
              Close Sandbox
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
