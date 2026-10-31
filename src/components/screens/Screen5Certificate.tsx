import React from 'react';
import { CandidateDossier } from '../../types/forensic';
import { ArrowLeft, Printer, ShieldCheck, Award, FileCheck, CheckCircle2 } from 'lucide-react';

interface Screen5CertificateProps {
  candidate: CandidateDossier;
  onBackToDashboard: () => void;
}

export const Screen5Certificate: React.FC<Screen5CertificateProps> = ({
  candidate,
  onBackToDashboard,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isAuthentic = candidate.status === 'authentic';

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 block mb-1">
            SCREEN 5: Certificate Generator
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2A3A2C]">
            Official Biometric Attestation Certificate
          </h1>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5">
            Cryptographically notarized forensic ledger certificate compliant with RBI/SEBI standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Action: "Back to Dashboard" */}
          <button
            onClick={onBackToDashboard}
            className="h-10 px-4 bg-[#FFFFFF] border border-[#E5E0D8] text-[#2A3A2C] text-xs font-sans font-semibold rounded-lg hover:bg-[#F9F6F0] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Action: "Print / Save as PDF" */}
          <button
            onClick={handlePrint}
            className="h-10 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Physical Document Certificate Layout */}
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] border-2 border-[#2A3A2C] p-8 sm:p-12 rounded-lg shadow-md relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Subtle Watermark Layer */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-4 rotate-[-25deg]">
          <span className="font-serif text-6xl sm:text-7xl font-bold text-[#2A3A2C] tracking-widest text-center uppercase leading-tight">
            VERIHIRE FORENSIC NOTARIZED
          </span>
        </div>

        {/* Outer Frame with Double Hairline Rules */}
        <div className="border border-[#E5E0D8] p-6 sm:p-8 relative">
          {/* Document Header */}
          <div className="text-center pb-6 border-b border-[#E5E0D8] relative">
            <div className="w-12 h-12 rounded-full bg-[#2A3A2C] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Award className="w-6 h-6" />
            </div>

            <span className="font-mono text-[11px] font-semibold text-[#2A3A2C]/60 uppercase tracking-widest block mb-1">
              National Forensic Identity & Deepfake Bureau · Attestation Form 082-A
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2A3A2C] tracking-tight">
              Certificate of Biometric Authenticity
            </h2>
            <p className="text-xs font-sans text-[#2A3A2C]/70 mt-1 max-w-lg mx-auto">
              Issued under the authority of VeriHire Lead Forensic Examiner Protocol for talent onboarding verification.
            </p>
          </div>

          {/* Subject Identification & Candidate Photo */}
          <div className="py-6 border-b border-[#E5E0D8] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Candidate Photo */}
            <div className="md:col-span-3 flex flex-col items-center">
              <div className="w-32 h-36 border-2 border-[#2A3A2C] p-1 rounded-sm bg-[#F9F6F0] relative">
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-[#2A3A2C] text-white p-0.5 rounded text-[8px] font-mono">
                  VERIFIED
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#2A3A2C]/60 mt-2 uppercase">
                Biometric ID: {candidate.id}
              </span>
            </div>

            {/* Subject Details */}
            <div className="md:col-span-9 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block">
                    Candidate Full Name
                  </span>
                  <p className="font-serif text-xl font-bold text-[#2A3A2C]">
                    {candidate.name}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block">
                    Evaluation Enterprise
                  </span>
                  <p className="font-sans text-sm font-semibold text-[#2A3A2C]">
                    {candidate.organization}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block">
                    Assessed Role
                  </span>
                  <p className="font-sans text-xs text-[#2A3A2C]">
                    {candidate.role}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block">
                    Attestation Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isAuthentic ? (
                      <span className="font-sans text-xs font-bold text-[#3D593D] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified Authentic (Pass)
                      </span>
                    ) : (
                      <span className="font-sans text-xs font-bold text-[#B46244] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Flagged Synthetic Anomaly
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biometric Ledger Text & Table */}
          <div className="py-6 border-b border-[#E5E0D8]">
            <h3 className="font-serif text-base font-semibold text-[#2A3A2C] mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#2A3A2C]" />
              <span>Biometric Forensic Ledger</span>
            </h3>

            <div className="border border-[#E5E0D8] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F9F6F0] text-[#2A3A2C] font-semibold border-b border-[#E5E0D8]">
                  <tr>
                    <th className="p-3">Inspection Channel</th>
                    <th className="p-3">Methodology / Standard</th>
                    <th className="p-3 text-right">Ledger Score</th>
                    <th className="p-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8] font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-sans font-medium text-[#2A3A2C]">Facial Mesh Stability</td>
                    <td className="p-3 text-[#2A3A2C]/70">468 3D Landmark Delaunay Triangulation</td>
                    <td className="p-3 text-right font-bold">{candidate.facialMeshCoherence.toFixed(1)}%</td>
                    <td className="p-3 text-right text-[#3D593D] font-bold">Pass</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-[#2A3A2C]">rPPG Hemodynamic Vitality</td>
                    <td className="p-3 text-[#2A3A2C]/70">Chrominance Vascular Absorption (rPPG)</td>
                    <td className="p-3 text-right font-bold">{candidate.rppgPulseBpm} BPM</td>
                    <td className="p-3 text-right text-[#3D593D] font-bold">Biological</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-[#2A3A2C]">Phonation Audio-Visual Sync</td>
                    <td className="p-3 text-[#2A3A2C]/70">Formant Spectrogram Acoustic Alignment</td>
                    <td className="p-3 text-right font-bold">{candidate.audioVisualSyncScore.toFixed(1)}%</td>
                    <td className="p-3 text-right text-[#3D593D] font-bold">Synchronous</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-[#2A3A2C]">DigiLocker Credential Vault</td>
                    <td className="p-3 text-[#2A3A2C]/70">UIDAI Cryptographic Identity Chain</td>
                    <td className="p-3 text-right font-bold">100% Match</td>
                    <td className="p-3 text-right text-[#3D593D] font-bold">Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] font-sans text-[#2A3A2C]/70 mt-3 leading-relaxed">
              Biometric Ledger Text: The candidate underwent strict anti-spoofing challenge-response procedures under continuous optical and acoustic monitoring. No deepfake diffusion artifacts, spectral aliasing, or synthetic neural voice cloning anomalies were detected beyond the allowed statutory tolerances.
            </p>
          </div>

          {/* Cryptographic Hash & Ledger Block */}
          <div className="py-5 border-b border-[#E5E0D8] bg-[#F9F6F0] p-4 rounded-lg my-6">
            <span className="font-mono text-[10px] uppercase font-bold text-[#2A3A2C]/60 block mb-1">
              Cryptographic Hash & Notary Merkle Root
            </span>
            <div className="font-mono text-xs text-[#2A3A2C] break-all select-all font-bold">
              {candidate.cryptographicHash || 'SHA256:0x8f2a991bce4710db8c4091ab3910c2ef38914ba0819c927f10b2401826194a'}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#2A3A2C]/70 mt-2">
              <span>Timestamp: {candidate.notarizedAt || new Date().toISOString()}</span>
              <span>Ledger Node: ID-BENGALURU-SEC-01</span>
            </div>
          </div>

          {/* Auditor Signature Block */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#2A3A2C]" />
                <span className="font-serif text-xs font-bold text-[#2A3A2C] uppercase tracking-wider">
                  VeriHire Enterprise Seals
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#2A3A2C]/60">
                This document is digitally sealed and immutable. Tampering with this cryptographic record invalidates the candidate's verified credential status across all member enterprise recruitment systems.
              </p>
            </div>

            <div className="text-right">
              {/* Ornate Auditor Signature */}
              <div className="inline-block border-b-2 border-[#2A3A2C] pb-1 px-8 mb-1">
                <span className="font-serif italic text-lg text-[#2A3A2C]">
                  A. Sengupta, Lead Examiner
                </span>
              </div>
              <p className="font-mono text-xs font-bold text-[#2A3A2C]">
                Auditor Signature: AUD-2026-IND-082
              </p>
              <p className="font-sans text-[11px] text-[#2A3A2C]/60">
                Lead Forensic Examiner · VeriHire Attestation Council
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
