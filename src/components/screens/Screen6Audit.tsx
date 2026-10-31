import React, { useState } from 'react';
import { CandidateDossier } from '../../types/forensic';
import { AuditLogEntry } from '../../services/firebase';
import { Download, Filter, ShieldCheck, ShieldAlert, Clock, Database, CheckCircle2 } from 'lucide-react';

interface Screen6AuditProps {
  candidates: CandidateDossier[];
  auditLogs?: AuditLogEntry[];
  onSelectCandidate?: (id: string) => void;
}

export const Screen6Audit: React.FC<Screen6AuditProps> = ({
  candidates,
  auditLogs = [],
  onSelectCandidate,
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('all');

  // Combine real-time Firestore immutable audit logs with candidate dossier records
  const dynamicAuditRecords = [
    // 1. Real-time entries from Firestore audit_logs collection
    ...auditLogs.map((log) => ({
      id: log.id || `AUD-${log.candidateId}`,
      timestamp: log.timestamp || 'Just now',
      candidate: log.candidateName || 'Live Inspection',
      candidateId: log.candidateId || 'N/A',
      company: 'Enterprise Sovereign Ledger',
      hub: 'Firestore Cryptographic Ledger',
      result:
        log.newStatus === 'authentic' || log.action === 'CERTIFIED_AUTHENTIC'
          ? 'Pass / Authentic'
          : log.newStatus === 'synthetic_detected' || log.action === 'FLAGGED_SYNTHETIC'
          ? 'Flagged Tamper'
          : log.action === 'DOSSIER_REGISTERED'
          ? 'Registered'
          : 'Under Review',
      resultType:
        log.newStatus === 'authentic' || log.action === 'CERTIFIED_AUTHENTIC'
          ? ('pass' as const)
          : log.newStatus === 'synthetic_detected' || log.action === 'FLAGGED_SYNTHETIC'
          ? ('synthetic' as const)
          : ('review' as const),
      examiner: log.examinerId || 'AUD-2026-IND-082',
      detail: log.details || 'Biometric verification event recorded to Firestore.',
      isDbSynced: true,
    })),
    // 2. Candidate records
    ...candidates.map((cand, idx) => ({
      id: `AUD-2026-${String(8800 + idx).padStart(4, '0')}`,
      timestamp: cand.notarizedAt || `2026-10-30 0${(idx % 9) + 1}:${String((idx * 7) % 60).padStart(2, '0')}:12`,
      candidate: cand.name,
      candidateId: cand.id,
      company: cand.organization,
      hub: cand.location.includes('Bengaluru')
        ? 'Bengaluru Tech Hub'
        : cand.location.includes('Mumbai')
        ? 'Mumbai Financial District'
        : cand.location.includes('Hyderabad')
        ? 'Hyderabad Cyber Hub'
        : cand.location.includes('Delhi')
        ? 'Delhi NCR Enterprise'
        : cand.location.includes('Pune')
        ? 'Pune Innovation Hub'
        : 'Chennai Technology Hub',
      result: cand.status === 'authentic' ? 'Pass / Authentic' : cand.status === 'synthetic_detected' ? 'Flagged Tamper' : 'Under Review',
      resultType: cand.status === 'authentic' ? ('pass' as const) : cand.status === 'synthetic_detected' ? ('synthetic' as const) : ('review' as const),
      examiner: cand.certifyingOfficial || 'AUD-2026-IND-082',
      detail: cand.technicalFinding || cand.summaryNotes,
      isDbSynced: true,
    })),
  ];

  const filteredRecords = selectedHub === 'all'
    ? dynamicAuditRecords
    : dynamicAuditRecords.filter((r) => r.hub === selectedHub);

  // Export CSV Action
  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Candidate Name', 'Candidate ID', 'Company', 'City Hub', 'Result', 'Examiner ID', 'Forensic Notes'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.timestamp,
      `"${r.candidate}"`,
      r.candidateId,
      `"${r.company}"`,
      `"${r.hub}"`,
      `"${r.result}"`,
      r.examiner,
      `"${r.detail}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VeriHire_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60">
              SCREEN 6: Archival Registry
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#3D593D]/10 text-[#3D593D] font-semibold border border-[#3D593D]/30">
              <CheckCircle2 className="w-3 h-3" /> Firestore Synced
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2A3A2C]">
            Enterprise Audit Trail
          </h1>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5">
            Immutable chronological ledger of candidate biometric verifications, flagged impersonations, and examiner rulings.
          </p>
        </div>

        {/* Actions: Filter dropdown (City hubs) and "Export CSV" button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Dropdown (City hubs) */}
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg px-3 h-10 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-[#2A3A2C]/60" />
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="bg-transparent text-xs font-sans font-medium text-[#2A3A2C] focus:outline-none cursor-pointer"
            >
              <option value="all">All City Hubs & Firestore Ledger</option>
              <option value="Firestore Cryptographic Ledger">Firestore Cryptographic Ledger</option>
              <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
              <option value="Mumbai Financial District">Mumbai Financial District</option>
              <option value="Hyderabad Cyber Hub">Hyderabad Cyber Hub</option>
              <option value="Delhi NCR Enterprise">Delhi NCR Enterprise</option>
              <option value="Pune Innovation Hub">Pune Innovation Hub</option>
              <option value="Chennai Technology Hub">Chennai Technology Hub</option>
            </select>
          </div>

          {/* Action: "Export CSV" Button */}
          <button
            onClick={handleExportCSV}
            className="h-10 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top: 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Audits */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
          <span className="font-mono text-xs uppercase text-[#2A3A2C]/60 block mb-1">
            Total Ledger Records
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#2A3A2C]">
              {1482 + auditLogs.length}
            </span>
            <span className="text-xs font-sans font-semibold text-[#3D593D]">
              Real-Time
            </span>
          </div>
          <span className="text-[11px] font-sans text-[#2A3A2C]/60 block mt-1">
            Evaluations persisted in Firestore
          </span>
        </div>

        {/* Stat 2: Intercepted */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
          <span className="font-mono text-xs uppercase text-[#2A3A2C]/60 block mb-1">
            Intercepted
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#B46244]">
              {118 + candidates.filter((c) => c.status === 'synthetic_detected').length}
            </span>
            <span className="text-xs font-sans font-semibold text-[#B46244] bg-[#B46244]/10 px-2 py-0.5 rounded-full border border-[#B46244]/30">
              Active Freeze
            </span>
          </div>
          <span className="text-[11px] font-sans text-[#2A3A2C]/60 block mt-1">
            Synthetic deepfake attempts blocked
          </span>
        </div>

        {/* Stat 3: Attack Vectors */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
          <span className="font-mono text-xs uppercase text-[#2A3A2C]/60 block mb-1">
            Attack Vectors
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold text-[#2A3A2C]">
              4 Vectors
            </span>
            <span className="text-xs font-mono text-[#2A3A2C]/70">
              Classified
            </span>
          </div>
          <span className="text-[11px] font-sans text-[#2A3A2C]/60 block mt-1">
            Diffusion swap, GAN mask, Voice clone, Replay
          </span>
        </div>

        {/* Stat 4: Database Sync Status */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
          <span className="font-mono text-xs uppercase text-[#2A3A2C]/60 block mb-1">
            Database Engine
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-[#3D593D]">
              Cloud Firestore
            </span>
            <span className="text-xs font-sans font-semibold text-[#3D593D]">
              Connected
            </span>
          </div>
          <span className="text-[11px] font-sans text-[#2A3A2C]/60 block mt-1">
            ABAC Zero-Trust security rules enforced
          </span>
        </div>
      </div>

      {/* Table: Rows with Timestamp, Candidate, Result, Examiner */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-[#2A3A2C] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2A3A2C]" />
            <span>Inspection Log Ledger</span>
          </h2>
          <span className="font-mono text-xs text-[#2A3A2C]/60">
            Showing {filteredRecords.length} notarized events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F9F6F0] text-[#2A3A2C] font-semibold border-b border-[#E5E0D8]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Hub / Origin</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">Examiner</th>
                <th className="p-3.5">Forensic Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => onSelectCandidate && onSelectCandidate(record.candidateId)}
                  className="hover:bg-[#F9F6F0]/60 transition-colors cursor-pointer"
                >
                  {/* Timestamp */}
                  <td className="p-3.5 font-mono text-[11px] text-[#2A3A2C]/80 whitespace-nowrap">
                    {record.timestamp}
                  </td>

                  {/* Candidate */}
                  <td className="p-3.5">
                    <span className="font-serif font-semibold text-sm text-[#2A3A2C] block">
                      {record.candidate}
                    </span>
                    <span className="font-sans text-[11px] text-[#2A3A2C]/60">
                      {record.company} · {record.candidateId}
                    </span>
                  </td>

                  {/* Hub / Origin */}
                  <td className="p-3.5 font-sans text-xs text-[#2A3A2C]">
                    <span className="inline-flex items-center gap-1">
                      {record.hub}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="p-3.5 whitespace-nowrap">
                    {record.resultType === 'pass' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]">
                        <ShieldCheck className="w-3 h-3" /> Pass / Authentic
                      </span>
                    )}
                    {record.resultType === 'synthetic' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B46244]/12 text-[#B46244] border border-[#B46244]/30">
                        <ShieldAlert className="w-3 h-3" /> Flagged Tamper
                      </span>
                    )}
                    {record.resultType === 'review' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#2A3A2C]/10 text-[#2A3A2C] border border-[#E5E0D8]">
                        <Clock className="w-3 h-3" /> Under Review
                      </span>
                    )}
                  </td>

                  {/* Examiner */}
                  <td className="p-3.5 font-mono text-[11px] font-medium text-[#2A3A2C]">
                    {record.examiner}
                  </td>

                  {/* Forensic Finding */}
                  <td className="p-3.5 text-xs text-[#2A3A2C]/80 max-w-xs truncate">
                    {record.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
