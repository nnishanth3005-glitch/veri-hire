import React, { useState } from 'react';
import { CandidateDossier, AuditStatus } from '../types/forensic';
import { Search, ShieldAlert, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

interface DossierListingProps {
  candidates: CandidateDossier[];
  selectedCandidateId: string;
  onSelectCandidate: (id: string) => void;
}

export const DossierListing: React.FC<DossierListingProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AuditStatus>('all');

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg flex flex-col h-full overflow-hidden shadow-xs">
      {/* Panel Header */}
      <div className="p-5 border-b border-[#E5E0D8] bg-[#FFFFFF]">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="font-serif text-xl font-semibold text-[#1C1C18]">
            Candidate Dossier Registry
          </h2>
          <span className="font-mono text-xs font-semibold text-[#71615D] tabular-nums">
            {filteredCandidates.length} Active Audits
          </span>
        </div>
        <p className="text-xs text-[#524440] font-sans">
          High-stakes talent verification for Indian enterprise ecosystems
        </p>

        {/* Search Input */}
        <div className="relative mt-3.5">
          <Search className="w-4 h-4 text-[#747872] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, dossier ID, or enterprise..."
            className="w-full h-10 pl-9 pr-3 text-xs font-sans text-[#1C1C18] bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg placeholder-[#71615D]/60 focus:outline-none focus:border-[#2A3A2C] transition-colors"
          />
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 mt-3 p-1 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]/60">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 px-2 text-xs font-sans font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer text-center ${
              statusFilter === 'all'
                ? 'bg-[#FFFFFF] text-[#1C1C18] shadow-xs font-semibold border border-[#E5E0D8]/50'
                : 'text-[#524440] hover:text-[#1C1C18]'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setStatusFilter('synthetic_detected')}
            className={`flex-1 py-1.5 px-2 text-xs font-sans font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer text-center ${
              statusFilter === 'synthetic_detected'
                ? 'bg-[#FFFFFF] text-[#8E3E23] shadow-xs font-semibold border border-[#E5E0D8]/50'
                : 'text-[#524440] hover:text-[#8E3E23]'
            }`}
          >
            Flagged ({candidates.filter((c) => c.status === 'synthetic_detected').length})
          </button>
          <button
            onClick={() => setStatusFilter('authentic')}
            className={`flex-1 py-1.5 px-2 text-xs font-sans font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer text-center ${
              statusFilter === 'authentic'
                ? 'bg-[#FFFFFF] text-[#3D593D] shadow-xs font-semibold border border-[#E5E0D8]/50'
                : 'text-[#524440] hover:text-[#3D593D]'
            }`}
          >
            Pass ({candidates.filter((c) => c.status === 'authentic').length})
          </button>
          <button
            onClick={() => setStatusFilter('under_review')}
            className={`flex-1 py-1.5 px-2 text-xs font-sans font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer text-center ${
              statusFilter === 'under_review'
                ? 'bg-[#FFFFFF] text-[#1C1C18] shadow-xs font-semibold border border-[#E5E0D8]/50'
                : 'text-[#524440] hover:text-[#1C1C18]'
            }`}
          >
            Review ({candidates.filter((c) => c.status === 'under_review').length})
          </button>
        </div>
      </div>

      {/* Dossier Item List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E5E0D8]">
        {filteredCandidates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-sans text-[#71615D]">No candidate dossiers match your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-3 text-xs text-[#2A3A2C] font-semibold underline underline-offset-2 hover:text-[#1E2B20]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const isSelected = candidate.id === selectedCandidateId;

            return (
              <div
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate.id)}
                className={`p-4 transition-colors cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-l-2 border-l-[#2A3A2C]'
                    : 'hover:bg-[#FAF8F5]/60 bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Portrait Thumbnail */}
                  <div className="relative shrink-0">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=2A3A2C&color=FFFFFF&size=256&font-size=0.33`;
                      }}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E5E0D8] bg-[#F6F3ED]"
                    />
                    {candidate.status === 'synthetic_detected' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B46244] text-white flex items-center justify-center text-[9px] font-bold">
                        !
                      </span>
                    )}
                  </div>

                  {/* Candidate Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <h3 className="font-serif text-base font-semibold text-[#1C1C18] truncate">
                        {candidate.name}
                      </h3>
                      <span className="font-mono text-[11px] text-[#71615D] shrink-0 tabular-nums">
                        {candidate.id}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-[#434842] font-medium truncate">
                      {candidate.role}
                    </p>
                    <p className="text-xs font-sans text-[#71615D] truncate">
                      {candidate.organization}
                    </p>

                    {/* Unboxed Metadata with Typographic Separators */}
                    <div className="flex items-center gap-2 mt-2 text-[11px] font-sans text-[#71615D]">
                      <span>{candidate.location.split(',')[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{candidate.interviewDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{candidate.enterpriseClearanceLevel}</span>
                    </div>

                    {/* Status Pill & Tabular Metrics */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E5E0D8]/60">
                      {candidate.status === 'authentic' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]">
                          <ShieldCheck className="w-3 h-3 text-[#3D593D]" />
                          Authentic
                        </span>
                      )}
                      {candidate.status === 'synthetic_detected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider bg-[rgba(180,98,68,0.12)] text-[#8E3E23] border border-[rgba(180,98,68,0.3)]">
                          <ShieldAlert className="w-3 h-3 text-[#8E3E23]" />
                          Synthetic Detected
                        </span>
                      )}
                      {candidate.status === 'under_review' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider bg-[rgba(45,33,30,0.06)] text-[#2D211E] border border-[#E5E0D8]">
                          <Clock className="w-3 h-3 text-[#2D211E]" />
                          Under Review
                        </span>
                      )}

                      <div className="text-right">
                        <span className="font-mono text-xs font-semibold text-[#1C1C18] tabular-nums">
                          {candidate.overallAuthenticityScore.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-[#71615D] font-sans ml-1">authenticity</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 self-center shrink-0 transition-transform ${
                      isSelected ? 'text-[#2A3A2C] translate-x-0.5' : 'text-[#C3C8C0]'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Panel Footer Summary */}
      <div className="p-3.5 bg-[#F6F3ED] border-t border-[#E5E0D8] text-[11px] font-sans text-[#71615D] flex items-center justify-between">
        <span>Aadhaar Biometric e-KYC: Synced</span>
        <span className="font-mono tabular-nums">SEBI / RBI Talent Safe Standard</span>
      </div>
    </div>
  );
};
