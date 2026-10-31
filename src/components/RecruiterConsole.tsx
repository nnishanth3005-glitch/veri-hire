import React, { useState } from 'react';
import { CandidateDossier, VerificationRequestDraft } from '../types/forensic';
import {
  UserPlus,
  Send,
  Link,
  Check,
  FileCheck2,
  Download,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Building,
  Search,
  ExternalLink,
  Award,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface RecruiterConsoleProps {
  candidates: CandidateDossier[];
  onOpenCreateModal: () => void;
  onOpenCandidatePortal: (candidateId?: string) => void;
  onViewCertificate: (candidate: CandidateDossier) => void;
}

export const RecruiterConsole: React.FC<RecruiterConsoleProps> = ({
  candidates,
  onOpenCreateModal,
  onOpenCandidatePortal,
  onViewCertificate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = candidates.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const verifiedCount = candidates.filter((c) => c.status === 'authentic').length;
  const flaggedCount = candidates.filter((c) => c.status === 'synthetic_detected').length;
  const reviewCount = candidates.filter((c) => c.status === 'under_review').length;

  const handleCopyLink = (candidateId: string) => {
    const url = `${window.location.origin}/#candidate-portal?req=${candidateId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(candidateId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Recruiter Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#3D593D]" />
              <span>Enterprise Hiring & Talent Integrity Suite</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3D593D]/10 text-[#3D593D] font-bold border border-[#3D593D]/30">
              Recruiter Mode
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A3A2C]">
            Candidate Verification Pipeline
          </h1>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-1 max-w-2xl">
            Dispatch secure pre-offer verification links, monitor DigiLocker and biometric completion, and retrieve cryptographically signed broadsheet certificates.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="h-11 px-5 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create Verification Request</span>
          </button>
        </div>
      </div>

      {/* 4 Status KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-5 shadow-xs">
          <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
            Total Pipeline Requests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#2A3A2C]">
              {candidates.length}
            </span>
            <span className="text-xs font-semibold text-[#2A3A2C]/70 font-mono">
              Active Cases
            </span>
          </div>
          <span className="text-[11px] text-[#2A3A2C]/60 mt-1 block">
            Across executive & engineering tiers
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-5 shadow-xs">
          <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
            Cleared for Offer (Verified)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#3D593D]">
              {verifiedCount}
            </span>
            <span className="text-xs font-semibold text-[#3D593D] font-mono">
              Signed Certs
            </span>
          </div>
          <span className="text-[11px] text-[#2A3A2C]/60 mt-1 block">
            Human presence & DigiLocker verified
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-5 shadow-xs">
          <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
            Under Forensic Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-amber-600">
              {reviewCount}
            </span>
            <span className="text-xs font-semibold text-amber-600 font-mono">
              Tier-2 Panel
            </span>
          </div>
          <span className="text-[11px] text-[#2A3A2C]/60 mt-1 block">
            Secondary scrutiny / proxy checks
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-5 shadow-xs">
          <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
            Offers Blocked (High Risk)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#B46244]">
              {flaggedCount}
            </span>
            <span className="text-xs font-semibold text-[#B46244] font-mono">
              Compromised
            </span>
          </div>
          <span className="text-[11px] text-[#2A3A2C]/60 mt-1 block">
            Synthetic deepfakes intercepted
          </span>
        </div>
      </div>

      {/* Main Table: Candidate Pipeline */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl overflow-hidden shadow-xs">
        {/* Table Controls */}
        <div className="p-4 border-b border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#2A3A2C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, role, organization, or case ID..."
              className="w-full h-10 pl-9 pr-3 text-xs font-sans text-[#2A3A2C] bg-[#F9F6F0] border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#2A3A2C]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#2A3A2C]/70">
            <span>Showing {filtered.length} candidates in pipeline</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F9F6F0] text-[#2A3A2C] font-semibold border-b border-[#E5E0D8]">
              <tr>
                <th className="p-3.5">Candidate & Role</th>
                <th className="p-3.5">Target Enterprise</th>
                <th className="p-3.5">Clearance Tier</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5">Secure Candidate Link</th>
                <th className="p-3.5 text-right">Signed Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filtered.map((candidate) => {
                const isCopied = copiedId === candidate.id;
                const status = candidate.status;
                const riskScore = candidate.riskSignals?.overallRiskScore ?? 4;

                return (
                  <tr key={candidate.id} className="hover:bg-[#F9F6F0]/60 transition-colors">
                    {/* Candidate & Role */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={candidate.avatarUrl}
                          alt={candidate.name}
                          className="w-9 h-9 rounded-lg object-cover border border-[#E5E0D8]"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-[#2A3A2C] block">
                            {candidate.name}
                          </span>
                          <span className="text-[11px] text-[#2A3A2C]/60 block font-sans">
                            {candidate.role} · <span className="font-mono">{candidate.id}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Organization */}
                    <td className="p-3.5 text-xs text-[#2A3A2C]">
                      <span className="font-medium">{candidate.organization}</span>
                      <span className="text-[11px] text-[#2A3A2C]/60 block">
                        {candidate.location}
                      </span>
                    </td>

                    {/* Clearance Tier */}
                    <td className="p-3.5">
                      <span className="font-mono text-xs text-[#2A3A2C] bg-[#F9F6F0] px-2 py-0.5 rounded border border-[#E5E0D8]">
                        {candidate.enterpriseClearanceLevel}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="p-3.5 whitespace-nowrap">
                      {status === 'authentic' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]">
                            <ShieldCheck className="w-3 h-3" /> Cleared for Offer
                          </span>
                          <span className="font-mono text-[10px] text-[#2A3A2C]/60 block">
                            Risk: {riskScore}% · DigiLocker Valid
                          </span>
                        </div>
                      ) : status === 'synthetic_detected' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B46244]/12 text-[#B46244] border border-[#B46244]/30">
                            <ShieldAlert className="w-3 h-3" /> Offer Blocked
                          </span>
                          <span className="font-mono text-[10px] text-[#B46244] block">
                            Risk: {riskScore}% · High-Risk Anomaly
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Manual Review
                          </span>
                          <span className="font-mono text-[10px] text-amber-700 block">
                            Under Examiner Review
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Candidate Link */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(candidate.id)}
                          className="h-8 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#2A3A2C] rounded text-[11px] font-sans font-medium text-[#2A3A2C] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Copy secure verification link for candidate"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-[#3D593D]" /> : <Link className="w-3 h-3 text-[#2A3A2C]/60" />}
                          <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenCandidatePortal(candidate.id)}
                          className="h-8 px-2 bg-[#F9F6F0] hover:bg-[#EAE4DC] border border-[#E5E0D8] rounded text-[11px] text-[#2A3A2C]/70 hover:text-[#2A3A2C] transition-colors cursor-pointer"
                          title="Simulate candidate experience for this request"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Download / View Certificate */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {status === 'authentic' ? (
                        <button
                          onClick={() => onViewCertificate(candidate)}
                          className="h-8 px-3 bg-[#2D211E] hover:bg-[#1C1C18] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Signed Cert</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-[#2A3A2C]/50 italic">
                          {status === 'synthetic_detected' ? 'Certificate Withheld' : 'In Progress'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Boundary Notice Banner */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl flex items-center justify-between text-xs text-[#2A3A2C]/70 font-sans shadow-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#3D593D]" />
          <span>
            <strong>Role-Based Access Control:</strong> Recruiter permissions are scoped to case dispatch, status tracking, and compliance certificate retrieval.
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#2A3A2C]/60">
          Forensic overrides restricted to Lead Examiner Console.
        </span>
      </div>
    </div>
  );
};
