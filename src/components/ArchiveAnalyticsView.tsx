import React, { useState } from 'react';
import { ENTERPRISE_AUDIT_LOGS } from '../data/mockCandidates';
import { ShieldCheck, ShieldAlert, Clock, Download, Filter, Search } from 'lucide-react';

export const ArchiveAnalyticsView: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = ENTERPRISE_AUDIT_LOGS.filter((log: any) => {
    const matchesHub = selectedHub === 'all' || log.hub.toLowerCase() === selectedHub.toLowerCase();
    const matchesSearch =
      log.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesHub && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Executive Broadsheet Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#71615D] tracking-wider block mb-1">
              National Enterprise Talent Ledger · Archival Division
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1C1C18]">
              Indian Enterprise Forensic Audit Archive
            </h1>
            <p className="text-sm font-sans text-[#524440] mt-0.5">
              Comprehensive forensic audit repository across tech corridors (Bengaluru, Hyderabad, Pune, Gurugram, Mumbai, Chennai)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="h-10 px-4 bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-sans font-medium text-[#1C1C18] rounded-lg hover:bg-[#F9F6F0] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Broadsheet CSV / PDF
            </button>
          </div>
        </div>

        {/* 4-KPI Executive Ledger Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E5E0D8]">
          <div className="p-3 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]/60">
            <span className="text-[11px] font-mono uppercase text-[#71615D] block">Total Audits Executed</span>
            <span className="font-serif text-2xl font-bold text-[#1C1C18] block mt-0.5">14,820</span>
            <span className="text-[10px] text-[#3D593D] font-sans font-medium">99.04% Institutional Pass Rate</span>
          </div>

          <div className="p-3 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]/60">
            <span className="text-[11px] font-mono uppercase text-[#71615D] block">Impersonations Intercepted</span>
            <span className="font-serif text-2xl font-bold text-[#8E3E23] block mt-0.5">142</span>
            <span className="text-[10px] text-[#8E3E23] font-sans font-medium">Pipeline Blocked & Revoked</span>
          </div>

          <div className="p-3 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]/60">
            <span className="text-[11px] font-mono uppercase text-[#71615D] block">Primary Attack Vector</span>
            <span className="font-serif text-lg font-bold text-[#1C1C18] block mt-0.5">Diffusion Avatar (62%)</span>
            <span className="text-[10px] text-[#71615D] font-sans">Audio Clone: 28% · Hook: 10%</span>
          </div>

          <div className="p-3 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]/60">
            <span className="text-[11px] font-mono uppercase text-[#71615D] block">Mean Audit Clearance</span>
            <span className="font-serif text-2xl font-bold text-[#2A3A2C] block mt-0.5">1.84 sec</span>
            <span className="text-[10px] text-[#71615D] font-sans">Zero latency interview proctoring</span>
          </div>
        </div>
      </div>

      {/* Audit Registry Table Section */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg overflow-hidden shadow-xs">
        {/* Table Filter Toolbar */}
        <div className="p-4 bg-[#FFFFFF] border-b border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#747872] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, enterprise, or log ID..."
              className="w-full h-9 pl-9 pr-3 text-xs font-sans text-[#1C1C18] bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg placeholder-[#71615D]/60 focus:outline-none focus:border-[#2A3A2C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-[#71615D] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Hub:
            </span>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-sans text-[#1C1C18] rounded-lg focus:outline-none focus:border-[#2A3A2C]"
            >
              <option value="all">All Technology Hubs</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="gurugram">Gurugram</option>
              <option value="chennai">Chennai</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F6F0] text-[#2D211E] text-xs font-sans font-semibold uppercase tracking-wider border-b border-[#E5E0D8] h-11">
                <th className="px-4 py-2">Log Reference</th>
                <th className="px-4 py-2">Enterprise Client</th>
                <th className="px-4 py-2">Candidate & Role</th>
                <th className="px-4 py-2">Technology Corridor</th>
                <th className="px-4 py-2">Forensic Verdict</th>
                <th className="px-4 py-2 text-right">Authenticity Index</th>
                <th className="px-4 py-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-xs font-sans">
              {filteredLogs.map((log: any) => {
                const isPass = log.result.includes('Verified');
                const isFail = log.result.includes('Blocked');

                return (
                  <tr
                    key={log.id}
                    className="h-13 bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-[#71615D]">
                      {log.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1C1C18]">
                      {log.enterprise}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#1C1C18]">{log.candidate}</div>
                      <div className="text-[11px] text-[#71615D]">{log.role}</div>
                    </td>
                    <td className="px-4 py-3 text-[#524440]">
                      {log.hub}
                    </td>
                    <td className="px-4 py-3">
                      {isPass && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]">
                          <ShieldCheck className="w-3 h-3 text-[#3D593D]" />
                          Verified Authentic
                        </span>
                      )}
                      {isFail && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[rgba(180,98,68,0.12)] text-[#8E3E23] border border-[rgba(180,98,68,0.3)]">
                          <ShieldAlert className="w-3 h-3 text-[#8E3E23]" />
                          Synthetic Impersonation Blocked
                        </span>
                      )}
                      {!isPass && !isFail && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[rgba(45,33,30,0.06)] text-[#2D211E] border border-[#E5E0D8]">
                          <Clock className="w-3 h-3 text-[#2D211E]" />
                          Under Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-[#1C1C18] tabular-nums">
                      {log.confidence}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#71615D] tabular-nums">
                      {log.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#F6F3ED] border-t border-[#E5E0D8] text-xs font-sans text-[#71615D] flex items-center justify-between">
          <span>Showing {filteredLogs.length} verified records</span>
          <span className="font-mono">Audited under SEBI Tech Talent Safeguard 2026</span>
        </div>
      </div>
    </div>
  );
};
