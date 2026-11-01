import React, { useState, useEffect } from 'react';
import { CandidateDossier, ForensicFrame, RiskClassification } from '../../types/forensic';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Layers,
  Activity,
  Volume2,
  Cpu,
  Award,
  AlertTriangle,
  Linkedin,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  FileCheck2,
  XCircle
} from 'lucide-react';
import { LinkedInProfileCardModal } from '../LinkedInProfileCardModal';
import { generateMockLinkedInData } from '../../services/linkedInVerificationService';
import { RiskEngineBreakdown } from '../RiskEngineBreakdown';

interface Screen3ReportProps {
  candidate: CandidateDossier;
  onCertifyAuthentic: (id: string) => void;
  onFlagSynthetic: (id: string) => void;
  onEscalate: (id: string) => void;
  onOpenCertificate: () => void;
  onOverrideRisk?: (id: string, newClass: RiskClassification, reason: string) => void;
}

export const Screen3Report: React.FC<Screen3ReportProps> = ({
  candidate,
  onCertifyAuthentic,
  onFlagSynthetic,
  onEscalate,
  onOpenCertificate,
  onOverrideRisk,
}) => {
  const [activeTab, setActiveTab] = useState<'risk_engine' | 'video_telemetry'>('risk_engine');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<'mesh' | 'rppg' | 'phonation' | 'fourier'>('mesh');
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);

  // Auditor Override Modal State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideClass, setOverrideClass] = useState<RiskClassification>('VERIFIED_HUMAN');
  const [overrideReason, setOverrideReason] = useState('');

  const frames = candidate.frames;
  const currentFrame: ForensicFrame = frames[currentFrameIndex] || frames[0];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, frames.length]);

  useEffect(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  }, [candidate.id]);

  const isFlagged = candidate.status === 'synthetic_detected';

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    if (onOverrideRisk) {
      onOverrideRisk(candidate.id, overrideClass, overrideReason);
    } else {
      if (overrideClass === 'VERIFIED_HUMAN') onCertifyAuthentic(candidate.id);
      else if (overrideClass === 'HIGH_RISK') onFlagSynthetic(candidate.id);
      else onEscalate(candidate.id);
    }
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl p-6 flex flex-col h-full overflow-y-auto shadow-xs">
      {/* Dossier Header */}
      <div className="border-b border-[#E5E0D8] pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#2A3A2C]/60 uppercase">
              {candidate.id}
            </span>
            <span className="text-[#E5E0D8]">·</span>
            <span className="text-xs font-sans text-[#2A3A2C]/70">
              Clearance: {candidate.enterpriseClearanceLevel}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2A3A2C]">
            {candidate.name}
          </h2>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5">
            {candidate.role} — <span className="font-medium text-[#2A3A2C]">{candidate.organization}</span>
          </p>

          {/* Clickable "View LinkedIn Profile" Link & Inspect Card */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsProfileCardOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#0A66C2] hover:bg-[#0A66C2]/15 bg-[#0A66C2]/8 px-3 py-1 rounded border border-[#0A66C2]/30 transition-colors cursor-pointer shadow-2xs"
              title="Open LinkedIn Profile in Secure Sandbox Iframe"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>View LinkedIn Profile (Iframe Sandbox)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
              candidate.linkedInVerified
                ? 'bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]'
                : 'bg-[#B46244]/12 text-[#B46244] border border-[#B46244]/30'
            }`}>
              {candidate.linkedInVerified ? '✓ Profile Matched' : '⚠ Profile Mismatch Flagged'}
            </span>
          </div>
        </div>

        {/* View Mode Toggle: Overview & 5 Checks vs Video Player */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center gap-1 bg-[#F9F6F0] p-1 rounded-lg border border-[#E5E0D8]">
            <button
              onClick={() => setActiveTab('risk_engine')}
              className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'risk_engine' ? 'bg-[#FFFFFF] text-[#2A3A2C] shadow-xs' : 'text-[#2A3A2C]/60 hover:text-[#2A3A2C]'
              }`}
            >
              📊 Overview & 5 Checks
            </button>
            <button
              onClick={() => setActiveTab('video_telemetry')}
              className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'video_telemetry' ? 'bg-[#FFFFFF] text-[#2A3A2C] shadow-xs' : 'text-[#2A3A2C]/60 hover:text-[#2A3A2C]'
              }`}
            >
              🎬 Video Player & Frames
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOverrideModal(true)}
              className="text-xs font-sans text-[#2A3A2C]/70 hover:text-[#2A3A2C] underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Auditor Decision Override</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'risk_engine' ? (
        <RiskEngineBreakdown
          riskSignals={candidate.riskSignals}
          candidateName={candidate.name}
          interviewFaceUrl={candidate.avatarUrl}
          candidateStatus={candidate.status}
          overallScore={candidate.overallAuthenticityScore}
          rppgPulse={candidate.rppgPulseBpm}
        />
      ) : (
        <div className="space-y-5">
          {/* 4 Overlays Toggle Buttons above video */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-semibold text-[#2A3A2C]">
              Forensic Inspection Channel
            </span>
            <div className="flex items-center gap-1 bg-[#F9F6F0] p-1 rounded-lg border border-[#E5E0D8]">
              <button
                onClick={() => setActiveOverlay('mesh')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'mesh' ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs' : 'text-[#2A3A2C]/70'
                }`}
              >
                <Layers className="w-3 h-3" /> Facial Mesh
              </button>
              <button
                onClick={() => setActiveOverlay('rppg')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'rppg' ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs' : 'text-[#2A3A2C]/70'
                }`}
              >
                <Activity className="w-3 h-3" /> rPPG Pulse
              </button>
              <button
                onClick={() => setActiveOverlay('phonation')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'phonation' ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs' : 'text-[#2A3A2C]/70'
                }`}
              >
                <Volume2 className="w-3 h-3" /> Phonation Sync
              </button>
              <button
                onClick={() => setActiveOverlay('fourier')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'fourier' ? 'bg-[#FFFFFF] text-[#2A3A2C] font-semibold shadow-xs' : 'text-[#2A3A2C]/70'
                }`}
              >
                <Cpu className="w-3 h-3" /> Fourier Map
              </button>
            </div>
          </div>

          {/* Video Player: Dark box with Play/Pause, Step Back, Step Forward buttons */}
          <div className="rounded-lg border border-[#E5E0D8] overflow-hidden bg-[#1C1C18]">
            <div className="relative aspect-16/10 flex items-center justify-center overflow-hidden">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className={`w-full h-full object-cover select-none transition-filter ${
                  activeOverlay === 'fourier' ? 'contrast-175 grayscale brightness-90' : ''
                }`}
              />

              {/* Overlays on video */}
              {activeOverlay === 'mesh' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <path
                    d="M 32,45 C 32,65 38,80 50,84 C 62,80 68,65 68,45 C 68,30 62,20 50,18 C 38,20 32,30 32,45 Z"
                    fill="none"
                    stroke={currentFrame.isFlagged ? '#B46244' : '#6B8E6B'}
                    strokeWidth="0.6"
                    strokeDasharray={currentFrame.isFlagged ? '1 1' : 'none'}
                  />
                  <polygon points="38,42 42,40 46,42 42,44" fill="none" stroke="#6B8E6B" strokeWidth="0.5" />
                  <polygon points="54,42 58,40 62,42 58,44" fill="none" stroke="#6B8E6B" strokeWidth="0.5" />
                  <path d="M 44,66 Q 50,64 56,66 Q 50,70 44,66 Z" fill="none" stroke={currentFrame.isFlagged ? '#B46244' : '#6B8E6B'} strokeWidth="0.6" />
                  {currentFrame.isFlagged && (
                    <rect x="28" y="55" width="22" height="18" fill="rgba(180,98,68,0.2)" stroke="#B46244" strokeWidth="0.8" />
                  )}
                </svg>
              )}

              {activeOverlay === 'rppg' && (
                <div className="absolute inset-0 bg-[#1C1C18]/40 p-4 flex flex-col justify-between pointer-events-none">
                  <div className="bg-[#FFFFFF]/95 p-2 rounded border border-[#E5E0D8] text-xs font-mono max-w-xs">
                    <span>Vascular Absorption: </span>
                    <strong className={candidate.rppgPulseBpm > 0 ? 'text-[#3D593D]' : 'text-[#B46244]'}>
                      {candidate.rppgPulseBpm > 0 ? `${candidate.rppgPulseBpm} BPM` : '0 BPM (FLATLINE)'}
                    </strong>
                  </div>
                </div>
              )}

              {activeOverlay === 'phonation' && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFFFF]/95 p-2.5 rounded border border-[#E5E0D8] text-xs font-mono flex justify-between">
                  <span>Phonation Latency: {candidate.audioVisualSyncScore > 70 ? '12ms (Sync)' : '148ms Desync'}</span>
                  <span className={candidate.audioVisualSyncScore > 70 ? 'text-[#3D593D]' : 'text-[#B46244]'}>
                    {isFlagged ? 'Harmonic Cutoff: 8.2 kHz' : 'Natural: 22 kHz'}
                  </span>
                </div>
              )}

              {activeOverlay === 'fourier' && (
                <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 p-2 rounded border border-[#E5E0D8] text-xs font-mono">
                  2D Fourier Residual Grid: {isFlagged ? 'Periodic Disparity' : 'Gaussian Noise'}
                </div>
              )}

              {currentFrame.isFlagged && (
                <div className="absolute top-3 right-3 bg-[#B46244] text-white text-xs font-sans font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
                  <AlertTriangle className="w-3.5 h-3.5" /> Flagged Artifact ({currentFrame.anomalyScore}%)
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-[#1C1C18]/80 text-white font-mono text-[11px] px-2 py-0.5 rounded border border-white/20">
                {currentFrame.timecode} · Frame #{currentFrame.frameNumber}
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="p-3 bg-[#FFFFFF] border-t border-[#E5E0D8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentFrameIndex((prev) => Math.max(prev - 1, 0))}
                  className="w-8 h-8 rounded border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] hover:bg-[#F9F6F0] cursor-pointer"
                  title="Step Back"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 px-3 rounded bg-[#2A3A2C] text-white flex items-center gap-1.5 text-xs font-sans font-medium hover:bg-[#1E2B20] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => setCurrentFrameIndex((prev) => Math.min(prev + 1, frames.length - 1))}
                  className="w-8 h-8 rounded border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] hover:bg-[#F9F6F0] cursor-pointer"
                  title="Step Forward"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="font-mono text-xs text-[#2A3A2C]/60">
                Frame {currentFrameIndex + 1} of {frames.length}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="my-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-sans font-semibold text-[#2A3A2C]">
                Temporal Evidence Timeline
              </span>
              <span className="text-[11px] font-mono text-[#B46244] font-semibold">
                Anomaly Flag Markers
              </span>
            </div>

            <div className="relative bg-[#F9F6F0] h-9 rounded border border-[#E5E0D8] flex items-center px-3">
              <div className="absolute bottom-1 left-3 right-3 h-1 bg-[#6B8E6B]/30 rounded-full" />
              <button
                onClick={() => setCurrentFrameIndex(1)}
                style={{ left: '25%' }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-6 flex flex-col items-center justify-center cursor-pointer group"
                title="Artifact Pin 1"
              >
                <span className="w-2.5 h-5 rounded-xs bg-[#B46244] shadow-xs group-hover:scale-110 transition-transform" />
              </button>
              <div
                style={{ left: `${((currentFrameIndex + 1) / frames.length) * 90}%` }}
                className="absolute w-1.5 h-7 bg-[#2A3A2C] rounded-full pointer-events-none transition-all"
              />
            </div>

            <div className="mt-2 text-xs font-sans text-[#2A3A2C]/80 bg-[#F9F6F0] p-2 rounded border border-[#E5E0D8]">
              <strong>Selected Frame #{currentFrame.frameNumber}: </strong>
              <span>{currentFrame.description}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-2.5 mt-auto">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onCertifyAuthentic(candidate.id)}
            className="h-10 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer shadow-xs"
          >
            Certify Authentic (Issue Clearance)
          </button>

          <button
            onClick={() => onFlagSynthetic(candidate.id)}
            className="h-10 px-4 bg-[#B46244] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#9C5237] transition-colors cursor-pointer shadow-xs"
          >
            Flag High Risk / Block Offer
          </button>

          <button
            onClick={onOpenCertificate}
            className="h-10 px-4 bg-[#2D211E] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1C1C18] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Generate Certificate</span>
          </button>
        </div>

        <button
          onClick={() => onEscalate(candidate.id)}
          className="h-10 px-3.5 bg-[#FFFFFF] border border-[#E5E0D8] text-[#2A3A2C] text-xs font-sans font-medium rounded-lg hover:bg-[#F9F6F0] transition-colors cursor-pointer shadow-xs"
        >
          Escalate to Panel
        </button>
      </div>

      {/* Auditor Override Dialog */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-[#2A3A2C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 block mb-1">
                Auditor Manual Override Gate
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2A3A2C]">
                Override Risk Verdict: {candidate.name}
              </h3>
              <p className="text-xs text-[#2A3A2C]/70 mt-1">
                Human examiners can override automated model scores with a mandatory cryptographic justification.
              </p>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase mb-1">
                  New Official Classification
                </label>
                <select
                  value={overrideClass}
                  onChange={(e) => setOverrideClass(e.target.value as any)}
                  className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-semibold text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                >
                  <option value="VERIFIED_HUMAN">VERIFIED HUMAN (Low Risk)</option>
                  <option value="MANUAL_REVIEW">MANUAL REVIEW (Secondary Scrutiny)</option>
                  <option value="HIGH_RISK">HIGH RISK / BLOCK OFFER (Impersonation)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase mb-1">
                  Mandatory Auditor Justification
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Secondary telephonic screening confirmed vocal formants match; network packet throttling accounted for temporary landmark jitter."
                  required
                  rows={3}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="h-9 px-3 border border-[#E5E0D8] rounded-lg text-xs text-[#2A3A2C]/70 hover:bg-[#F9F6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2A3A2C] text-white rounded-lg text-xs font-semibold hover:bg-[#1E2B20]"
                >
                  Apply & Record to Audit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Linked LinkedIn Profile Card Modal */}
      {isProfileCardOpen && (
        <LinkedInProfileCardModal
          candidate={candidate}
          profileData={generateMockLinkedInData(candidate)}
          isOpen={isProfileCardOpen}
          onClose={() => setIsProfileCardOpen(false)}
        />
      )}
    </div>
  );
};
