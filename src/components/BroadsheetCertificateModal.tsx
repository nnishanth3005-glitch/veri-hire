import React, { useEffect } from 'react';
import { CandidateDossier } from '../types/forensic';
import { X, Printer, ShieldCheck, ShieldAlert, Award, Lock, ArrowLeft } from 'lucide-react';

interface BroadsheetCertificateModalProps {
  candidate: CandidateDossier;
  isOpen: boolean;
  onClose: () => void;
}

export const BroadsheetCertificateModal: React.FC<BroadsheetCertificateModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  // Close on 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAuthentic = candidate.status === 'authentic';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2D211E]/60 backdrop-blur-xs overflow-y-auto"
    >
      {/* Modal Dialog (stop propagation so clicking inside doesn't close) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl max-w-4xl w-full my-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Controls Bar (Always visible at top, hidden when printing) */}
        <div className="p-4 bg-[#F6F3ED] border-b border-[#E5E0D8] flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            {/* Prominent Return Button */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E5E0D8] text-[#1C1C18] text-xs font-sans font-semibold rounded-lg hover:bg-[#FAF8F5] active:bg-[#E5E0D8] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2A3A2C]" />
              <span>← Back to Dashboard</span>
            </button>

            <span className="font-serif text-xs font-semibold text-[#71615D] hidden sm:inline">
              Archival Certification Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="h-8 px-3.5 bg-[#2A3A2C] text-white text-xs font-sans font-medium rounded-lg hover:bg-[#1E2B20] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              title="Close modal (Esc)"
              className="w-8 h-8 rounded-lg border border-[#E5E0D8] bg-[#FFFFFF] text-[#2D211E] hover:bg-[#FAF8F5] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Broad-sheet Content */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-[#FCF9F3] text-[#2D211E] relative">
          {/* Broad-sheet Title */}
          <div className="border-b-2 border-[#2D211E] pb-5 text-center">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#71615D] block mb-1">
              National Forensic Verification Bureau · Enterprise Talent Ledger
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C18] tracking-tight">
              Certificate of Forensic Authenticity & Identity Posture
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-[#524440] mt-1">
              Issued under the Indian Enterprise Cyber-Integrity & Anti-Impersonation Charter
            </p>
          </div>

          {/* Ledger Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#E5E0D8] text-xs font-sans">
            <div>
              <span className="text-[#71615D] text-[10px] uppercase font-mono block">Dossier Reference</span>
              <strong className="font-mono text-sm text-[#1C1C18]">{candidate.id}</strong>
            </div>
            <div>
              <span className="text-[#71615D] text-[10px] uppercase font-mono block">DigiLocker Key</span>
              <strong className="font-mono text-xs text-[#1C1C18]">{candidate.digiLockerReference}</strong>
            </div>
            <div>
              <span className="text-[#71615D] text-[10px] uppercase font-mono block">Notarized Timestamp</span>
              <span className="font-mono text-xs">{candidate.notarizedAt}</span>
            </div>
            <div>
              <span className="text-[#71615D] text-[10px] uppercase font-mono block">Clearance Tier</span>
              <strong className="text-xs text-[#2A3A2C]">{candidate.enterpriseClearanceLevel}</strong>
            </div>
          </div>

          {/* Profile & Metrics Split */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-[#E5E0D8]">
            <div className="sm:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-32 h-32 rounded-lg object-cover border-2 border-[#2A3A2C] shadow-sm bg-[#FFFFFF]"
              />
              <div
                className={`mt-2.5 px-3 py-1 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  isAuthentic
                    ? 'bg-[#6B8E6B]/15 text-[#3D593D] border border-[#6B8E6B]/40'
                    : 'bg-[#B46244]/15 text-[#8E3E23] border border-[#B46244]/40'
                }`}
              >
                {isAuthentic ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {isAuthentic ? 'Verified Authentic' : 'Tamper Detected'}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1C1C18]">{candidate.name}</h2>
              <p className="text-sm font-sans font-medium text-[#434842]">
                {candidate.role} — <span className="text-[#71615D]">{candidate.organization}</span>
              </p>
              <p className="text-xs font-sans text-[#71615D]">Corridor: {candidate.location}</p>

              <div className="mt-4 pt-3 border-t border-[#E5E0D8] grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-[#FFFFFF] p-2 rounded border border-[#E5E0D8]">
                  <span className="text-[10px] font-mono uppercase text-[#71615D] block">3D Liveness Index</span>
                  <span className="font-mono text-sm font-bold text-[#1C1C18]">
                    {candidate.livenessConfidence.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded border border-[#E5E0D8]">
                  <span className="text-[10px] font-mono uppercase text-[#71615D] block">Capillary Pulse</span>
                  <span className="font-mono text-sm font-bold text-[#1C1C18]">
                    {candidate.rppgPulseBpm > 0 ? `${candidate.rppgPulseBpm} BPM` : '0 BPM (Flatline)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Verdict Notes */}
          <div className="py-5 border-b border-[#E5E0D8] space-y-2 text-xs font-sans">
            <h3 className="font-serif text-base font-semibold text-[#1C1C18]">
              Forensic Attestation Verdict
            </h3>
            <p className="leading-relaxed text-[#2D211E]">{candidate.summaryNotes}</p>
            <p className="leading-relaxed text-[#524440]">
              <strong>Technical Finding: </strong> {candidate.technicalFinding}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#71615D] block mb-1">
                Cryptographic Signature Proof
              </span>
              <div className="bg-[#FFFFFF] p-2 rounded border border-[#E5E0D8] font-mono text-[9px] break-all text-[#434842]">
                {candidate.cryptographicHash}
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-[#1C1C18] border-b border-[#2D211E] pb-1 w-52 ml-auto">
                {candidate.certifyingOfficial.split(',')[0]}
              </div>
              <span className="text-xs font-sans font-semibold text-[#1C1C18] mt-1 block">
                {candidate.certifyingOfficial}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar: Prominent Close button so you never get stuck */}
        <div className="p-3 bg-[#F6F3ED] border-t border-[#E5E0D8] flex items-center justify-end gap-3 no-print shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] cursor-pointer shadow-xs"
          >
            Done (Close Certificate)
          </button>
        </div>
      </div>
    </div>
  );
};
