import React, { useState, useEffect } from 'react';
import { CandidateDossier, ForensicFrame, ForensicOverlayMode } from '../types/forensic';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Activity,
  Layers,
  Volume2,
  FileText,
  AlertTriangle,
  Award,
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';

interface ForensicInspectorProps {
  candidate: CandidateDossier;
  onUpdateCandidateStatus: (id: string, newStatus: 'authentic' | 'synthetic_detected' | 'under_review') => void;
  onOpenCertificateModal: () => void;
}

export const ForensicInspector: React.FC<ForensicInspectorProps> = ({
  candidate,
  onUpdateCandidateStatus,
  onOpenCertificateModal,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<ForensicOverlayMode>('mesh');
  const [inspectorNotes, setInspectorNotes] = useState(candidate.summaryNotes);

  const frames = candidate.frames;
  const currentFrame: ForensicFrame = frames[currentFrameIndex] || frames[0];

  // Auto-play simulation across key forensic frames
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  // When candidate changes, reset frame to 0
  useEffect(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setInspectorNotes(candidate.summaryNotes);
  }, [candidate.id]);

  const handleNextFrame = () => {
    setCurrentFrameIndex((prev) => Math.min(prev + 1, frames.length - 1));
  };

  const handlePrevFrame = () => {
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
  };

  const isFlaggedCandidate = candidate.status === 'synthetic_detected';

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg flex flex-col h-full overflow-y-auto shadow-xs">
      {/* Dossier Header */}
      <div className="p-6 border-b border-[#E5E0D8] bg-[#FFFFFF]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-[#71615D] tracking-wider uppercase">
                Official Forensic Dossier
              </span>
              <span aria-hidden="true" className="text-[#C3C8C0]">·</span>
              <span className="font-mono text-xs font-semibold text-[#2A3A2C] bg-[#F6F3ED] px-2 py-0.5 rounded border border-[#E5E0D8]">
                {candidate.id}
              </span>
              <span aria-hidden="true" className="text-[#C3C8C0]">·</span>
              <span className="text-xs font-sans text-[#71615D]">
                Clearance: {candidate.enterpriseClearanceLevel}
              </span>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1C1C18]">
              {candidate.name}
            </h1>

            <p className="text-sm font-sans text-[#434842] mt-0.5">
              {candidate.role} · <span className="text-[#71615D]">{candidate.organization}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs font-sans text-[#71615D]">
              <span>{candidate.location}</span>
              <span aria-hidden="true">·</span>
              <span>Interview Date: {candidate.interviewDate}</span>
              <span aria-hidden="true">·</span>
              <span>DigiLocker: <strong className="font-mono text-[#1C1C18]">{candidate.digiLockerReference}</strong></span>
            </div>
          </div>

          {/* Right Verdict Capsule */}
          <div className="flex flex-col items-start md:items-end shrink-0 gap-2">
            {candidate.status === 'authentic' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-[rgba(107,142,107,0.12)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]">
                <ShieldCheck className="w-4 h-4 text-[#3D593D]" />
                Identity Certified Authentic
              </div>
            )}
            {candidate.status === 'synthetic_detected' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-[rgba(180,98,68,0.12)] text-[#8E3E23] border border-[rgba(180,98,68,0.3)]">
                <ShieldAlert className="w-4 h-4 text-[#8E3E23]" />
                Synthetic Impersonation Detected
              </div>
            )}
            {candidate.status === 'under_review' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-[rgba(45,33,30,0.06)] text-[#2D211E] border border-[#E5E0D8]">
                <Clock className="w-4 h-4 text-[#2D211E]" />
                Tier-2 Forensic Panel In Progress
              </div>
            )}

            <div className="text-left md:text-right">
              <span className="text-[11px] font-sans text-[#71615D] uppercase tracking-wider block">
                Forensic Authenticity Index
              </span>
              <span className={`font-mono text-2xl font-semibold tabular-nums ${
                candidate.overallAuthenticityScore > 80
                  ? 'text-[#3D593D]'
                  : candidate.overallAuthenticityScore > 50
                  ? 'text-[#2D211E]'
                  : 'text-[#8E3E23]'
              }`}>
                {candidate.overallAuthenticityScore.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inspection Suite */}
      <div className="p-6 space-y-6">
        {/* Video Canvas & Multi-Angle Inspector */}
        <div className="border border-[#E5E0D8] rounded-lg overflow-hidden bg-[#FAF8F5]">
          {/* Stream Toolbar */}
          <div className="p-3 bg-[#FFFFFF] border-b border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-semibold text-[#1C1C18]">
                Stream Audit Channel
              </span>
              <span className="text-[11px] font-mono text-[#71615D] bg-[#F6F3ED] px-2 py-0.5 rounded border border-[#E5E0D8]">
                1080p @ 24fps · H.264
              </span>
            </div>

            {/* Forensic Overlay Selector */}
            <div className="flex items-center gap-1 p-0.5 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8]">
              <button
                onClick={() => setActiveOverlay('none')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeOverlay === 'none'
                    ? 'bg-[#FFFFFF] text-[#1C1C18] font-semibold shadow-xs'
                    : 'text-[#524440] hover:text-[#1C1C18]'
                }`}
              >
                Raw Frame
              </button>
              <button
                onClick={() => setActiveOverlay('mesh')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'mesh'
                    ? 'bg-[#FFFFFF] text-[#1C1C18] font-semibold shadow-xs'
                    : 'text-[#524440] hover:text-[#1C1C18]'
                }`}
              >
                <Layers className="w-3 h-3" />
                Facial Mesh
              </button>
              <button
                onClick={() => setActiveOverlay('rppg')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'rppg'
                    ? 'bg-[#FFFFFF] text-[#1C1C18] font-semibold shadow-xs'
                    : 'text-[#524440] hover:text-[#1C1C18]'
                }`}
              >
                <Activity className="w-3 h-3" />
                rPPG Pulse
              </button>
              <button
                onClick={() => setActiveOverlay('audio_sync')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeOverlay === 'audio_sync'
                    ? 'bg-[#FFFFFF] text-[#1C1C18] font-semibold shadow-xs'
                    : 'text-[#524440] hover:text-[#1C1C18]'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                Phonation Sync
              </button>
              <button
                onClick={() => setActiveOverlay('residual')}
                className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeOverlay === 'residual'
                    ? 'bg-[#FFFFFF] text-[#1C1C18] font-semibold shadow-xs'
                    : 'text-[#524440] hover:text-[#1C1C18]'
                }`}
              >
                Fourier Residual
              </button>
            </div>
          </div>

          {/* Interactive Inspection Frame Viewport */}
          <div className="relative bg-[#1C1C18] aspect-16/10 flex items-center justify-center overflow-hidden">
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=2A3A2C&color=FFFFFF&size=512&font-size=0.33`;
              }}
              className={`w-full h-full object-cover select-none transition-filter duration-300 ${
                activeOverlay === 'residual' ? 'contrast-175 grayscale brightness-90' : ''
              }`}
            />

            {/* Overlay Layer 1: Facial Mesh & Boundary Edge */}
            {activeOverlay === 'mesh' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {/* Facial contour lines */}
                <path
                  d="M 32,45 C 32,65 38,80 50,84 C 62,80 68,65 68,45 C 68,30 62,20 50,18 C 38,20 32,30 32,45 Z"
                  fill="none"
                  stroke={currentFrame.isFlagged ? '#B46244' : '#6B8E6B'}
                  strokeWidth="0.5"
                  strokeDasharray={currentFrame.isFlagged ? '1 1' : 'none'}
                  opacity="0.8"
                />
                {/* Left Eye & Right Eye landmarks */}
                <polygon points="38,42 42,40 46,42 42,44" fill="none" stroke="#6B8E6B" strokeWidth="0.4" opacity="0.9" />
                <polygon points="54,42 58,40 62,42 58,44" fill="none" stroke="#6B8E6B" strokeWidth="0.4" opacity="0.9" />
                {/* Nose bridge & base */}
                <line x1="50" y1="42" x2="50" y2="54" stroke="#6B8E6B" strokeWidth="0.4" opacity="0.7" />
                <polyline points="46,55 50,56 54,55" fill="none" stroke="#6B8E6B" strokeWidth="0.4" opacity="0.7" />
                {/* Lip perimeter */}
                <path
                  d="M 44,66 Q 50,64 56,66 Q 50,70 44,66 Z"
                  fill="none"
                  stroke={currentFrame.isFlagged && currentFrame.artifactType === 'phonation_jitter' ? '#B46244' : '#6B8E6B'}
                  strokeWidth="0.6"
                  opacity="0.9"
                />

                {/* If current frame has a specific anomaly box */}
                {currentFrame.isFlagged && currentFrame.anomalyCoordinates && (
                  <g>
                    <rect
                      x={currentFrame.anomalyCoordinates.x}
                      y={currentFrame.anomalyCoordinates.y}
                      width={currentFrame.anomalyCoordinates.width}
                      height={currentFrame.anomalyCoordinates.height}
                      fill="rgba(180,98,68,0.18)"
                      stroke="#B46244"
                      strokeWidth="0.8"
                    />
                    <text
                      x={currentFrame.anomalyCoordinates.x}
                      y={currentFrame.anomalyCoordinates.y - 1.5}
                      fill="#B46244"
                      fontSize="2.4"
                      fontWeight="600"
                      fontFamily="JetBrains Mono"
                    >
                      ARTIFACT: {currentFrame.anomalyScore}%
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* Overlay Layer 2: rPPG Photoplethysmography Wave */}
            {activeOverlay === 'rppg' && (
              <div className="absolute inset-0 bg-[#1C1C18]/40 backdrop-blur-[1px] p-5 flex flex-col justify-between pointer-events-none">
                <div className="bg-[#FFFFFF]/95 border border-[#E5E0D8] p-3 rounded-lg max-w-xs shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono uppercase text-[#71615D]">
                      Capillary Perfusion Rate
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#1C1C18] tabular-nums">
                      {candidate.rppgPulseBpm > 0 ? `${candidate.rppgPulseBpm} BPM` : 'NULL (0 BPM)'}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[#524440]">
                    {candidate.rppgPulseBpm > 0
                      ? 'Sinusoidal pulsatile blood volume detected in forehead dermis.'
                      : 'WARNING: Flatline vascular absorption. Synthetic skin shader identified.'}
                  </p>
                </div>

                {/* Live ECG / rPPG waveform graph */}
                <div className="w-full bg-[#FFFFFF]/90 border border-[#E5E0D8] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[#71615D]">
                    <span>HEMOGLOBIN ABSORPTION (520nm / 660nm)</span>
                    <span>HRV: {candidate.rppgPulseBpm > 0 ? '48ms (Normal)' : '0ms (Artificial)'}</span>
                  </div>
                  <svg className="w-full h-12" viewBox="0 0 400 50">
                    <path
                      d={
                        candidate.rppgPulseBpm > 0
                          ? 'M 0,25 Q 20,25 35,25 L 45,5 L 55,45 L 65,20 L 75,25 Q 90,25 110,25 Q 130,25 145,25 L 155,5 L 165,45 L 175,20 L 185,25 Q 200,25 220,25 Q 240,25 255,25 L 265,5 L 275,45 L 285,20 L 295,25 Q 310,25 330,25 Q 350,25 365,25 L 375,5 L 385,45 L 395,20 L 400,25'
                          : 'M 0,25 L 400,25'
                      }
                      fill="none"
                      stroke={candidate.rppgPulseBpm > 0 ? '#3D593D' : '#8E3E23'}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Overlay Layer 3: Audio Phonation Sync */}
            {activeOverlay === 'audio_sync' && (
              <div className="absolute inset-0 bg-[#1C1C18]/40 backdrop-blur-[1px] p-5 flex flex-col justify-end pointer-events-none">
                <div className="bg-[#FFFFFF]/95 border border-[#E5E0D8] rounded-lg p-3 w-full">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
                    <span className="text-[#1C1C18] font-semibold">
                      ACOUSTIC-VISUAL PHONATION PHASING
                    </span>
                    <span className={candidate.audioVisualSyncScore > 70 ? 'text-[#3D593D]' : 'text-[#8E3E23]'}>
                      Phase Latency: {candidate.audioVisualSyncScore > 70 ? '12ms (In Sync)' : '148ms Desynchronized'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-sans">
                    <div className="p-2 bg-[#F6F3ED] rounded border border-[#E5E0D8]">
                      <span className="text-[#71615D] text-[10px] uppercase font-mono block">Lip Aperture Velocity</span>
                      <span className="font-mono text-xs font-semibold text-[#1C1C18]">4.2 cm/sec</span>
                    </div>
                    <div className="p-2 bg-[#F6F3ED] rounded border border-[#E5E0D8]">
                      <span className="text-[#71615D] text-[10px] uppercase font-mono block">Vocal Harmonic Spectrum</span>
                      <span className={`font-mono text-xs font-semibold ${isFlaggedCandidate ? 'text-[#8E3E23]' : 'text-[#3D593D]'}`}>
                        {isFlaggedCandidate ? 'Cutoff at 8.2 kHz (ElevenLabs Clone)' : 'Continuous 22.0 kHz Natural Voice'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overlay Layer 4: Fourier Residual Map */}
            {activeOverlay === 'residual' && (
              <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 border border-[#E5E0D8] p-3 rounded-lg max-w-xs pointer-events-none shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71615D] block">
                  High-Frequency Residual Spectrum
                </span>
                <p className="text-xs font-sans text-[#1C1C18] mt-1">
                  {isFlaggedCandidate
                    ? 'Checkerboard periodic artifacts isolated around jawline grid. Characteristic of up-sampling neural layers.'
                    : 'Gaussian natural sensor noise distribution. Zero periodic grid interference.'}
                </p>
              </div>
            )}

            {/* Timecode & Frame Indicator Pill (Video HUD) */}
            <div className="absolute bottom-3 left-3 bg-[#1C1C18]/85 text-white font-mono text-xs px-2.5 py-1 rounded border border-white/20 tabular-nums">
              {currentFrame.timecode} · Frame #{currentFrame.frameNumber} of 576
            </div>

            {currentFrame.isFlagged && (
              <div className="absolute top-3 right-3 bg-[#B46244] text-white text-xs font-sans font-semibold px-3 py-1 rounded shadow-md flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Flagged Artifact Frame ({currentFrame.anomalyScore}%)
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[#E5E0D8] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevFrame}
                disabled={currentFrameIndex === 0}
                className="w-8 h-8 rounded border border-[#E5E0D8] flex items-center justify-center text-[#1C1C18] hover:bg-[#F6F3ED] disabled:opacity-40 cursor-pointer"
                title="Previous Keyframe"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 px-3 rounded bg-[#2A3A2C] text-white flex items-center gap-1.5 text-xs font-sans font-medium hover:bg-[#1E2B20] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Sequence'}</span>
              </button>
              <button
                onClick={handleNextFrame}
                disabled={currentFrameIndex === frames.length - 1}
                className="w-8 h-8 rounded border border-[#E5E0D8] flex items-center justify-center text-[#1C1C18] hover:bg-[#F6F3ED] disabled:opacity-40 cursor-pointer"
                title="Next Keyframe"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-mono text-[#71615D] tabular-nums">
              Keyframe {currentFrameIndex + 1} of {frames.length}
            </div>
          </div>
        </div>

        {/* Forensic Evidence Timeline (Domain-Specific Specification) */}
        <div className="border border-[#E5E0D8] rounded-lg p-5 bg-[#FFFFFF] shadow-xs">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#1C1C18]">
                Forensic Evidence Timeline
              </h3>
              <p className="text-xs font-sans text-[#71615D]">
                Temporal frame scrubber: terracotta pins mark detected synthesis anomalies, sage indicates authentic baselines
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-[#71615D] tabular-nums">
              {candidate.flaggedFrameCount} Flagged Anomalies
            </span>
          </div>

          {/* Frame scrubber bar set against #F9F6F0 track with a 1px solid #E5E0D8 border */}
          <div className="relative mt-4 mb-2 bg-[#F9F6F0] h-10 rounded border border-[#E5E0D8] flex items-center px-3">
            {/* Authentic sequence base underline indicator in #6B8E6B */}
            <div className="absolute bottom-1 left-3 right-3 h-1 bg-[#6B8E6B]/30 rounded-full" />

            {/* Timeline markers */}
            {frames.map((frame, idx) => {
              const positionPercent = (frame.timestampSec / candidate.videoDurationSec) * 100;
              const isSelected = idx === currentFrameIndex;

              return (
                <button
                  key={frame.frameNumber}
                  onClick={() => {
                    setCurrentFrameIndex(idx);
                    setIsPlaying(false);
                  }}
                  style={{ left: `calc(${positionPercent}% - 8px)` }}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-7 rounded-sm flex flex-col items-center justify-center transition-transform cursor-pointer group ${
                    isSelected ? 'scale-125 z-20' : 'z-10 hover:scale-110'
                  }`}
                  title={`${frame.timecode} - ${frame.description}`}
                >
                  {/* Pin Flag */}
                  <span
                    className={`w-2.5 h-5 rounded-xs transition-colors ${
                      frame.isFlagged
                        ? 'bg-[#B46244] shadow-xs ring-2 ring-[#B46244]/20'
                        : 'bg-[#6B8E6B] opacity-80'
                    } ${isSelected ? 'ring-2 ring-[#1C1C18]' : ''}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Frame Finding Card */}
          <div className={`mt-3 p-3.5 rounded-lg border text-xs font-sans transition-colors ${
            currentFrame.isFlagged
              ? 'bg-[#B46244]/8 border-[#B46244]/30 text-[#8E3E23]'
              : 'bg-[#6B8E6B]/8 border-[#6B8E6B]/30 text-[#3D593D]'
          }`}>
            <div className="flex items-center justify-between font-mono font-semibold mb-1">
              <span>
                Frame #{currentFrame.frameNumber} ({currentFrame.timecode})
              </span>
              <span>
                {currentFrame.isFlagged
                  ? `Artifact Confidence: ${currentFrame.anomalyScore}%`
                  : 'Temporal Integrity: Verified'}
              </span>
            </div>
            <p className="text-[#2D211E] text-xs">
              {currentFrame.description}
            </p>
          </div>
        </div>

        {/* Biometric & Credential Integrity Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Metric 1 */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71615D] block mb-1">
              Facial Boundary Coherence
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-semibold text-[#1C1C18] tabular-nums">
                {candidate.facialMeshCoherence.toFixed(1)}%
              </span>
              <span className={`text-xs font-sans font-semibold ${
                candidate.facialMeshCoherence > 80 ? 'text-[#3D593D]' : 'text-[#8E3E23]'
              }`}>
                {candidate.facialMeshCoherence > 80 ? 'Stable' : 'Boundary Jitter'}
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#71615D] mt-2">
              Mandibular seam and hairline edge residual analysis
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71615D] block mb-1">
              rPPG Vitality Pulse
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-semibold text-[#1C1C18] tabular-nums">
                {candidate.rppgPulseBpm > 0 ? `${candidate.rppgPulseBpm} BPM` : '0 BPM'}
              </span>
              <span className={`text-xs font-sans font-semibold ${
                candidate.rppgPulseBpm > 0 ? 'text-[#3D593D]' : 'text-[#8E3E23]'
              }`}>
                {candidate.rppgPulseBpm > 0 ? 'Biological' : 'Synthetic Flatline'}
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#71615D] mt-2">
              Dermal capillary hemoperfusion reflectance
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71615D] block mb-1">
              Audio-Visual Phonation Sync
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-semibold text-[#1C1C18] tabular-nums">
                {candidate.audioVisualSyncScore.toFixed(1)}%
              </span>
              <span className={`text-xs font-sans font-semibold ${
                candidate.audioVisualSyncScore > 80 ? 'text-[#3D593D]' : 'text-[#8E3E23]'
              }`}>
                {candidate.audioVisualSyncScore > 80 ? 'Aligned' : 'Phase Offset'}
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#71615D] mt-2">
              Oral aperture opening velocity vs speech acoustic formants
            </p>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71615D] block mb-1">
              Aadhaar & DigiLocker Vault
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm font-semibold text-[#1C1C18] truncate">
                {candidate.aadhaarVaultStatus === 'verified' ? 'Verified Pass' : 'Revoked'}
              </span>
              <span className={`text-xs font-sans font-semibold ${
                candidate.aadhaarVaultStatus === 'verified' ? 'text-[#3D593D]' : 'text-[#8E3E23]'
              }`}>
                {candidate.aadhaarVaultStatus === 'verified' ? 'Encrypted Chain' : 'Signature Breach'}
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#71615D] mt-2 truncate">
              Ref: {candidate.digiLockerReference}
            </p>
          </div>
        </div>

        {/* Auditor Findings & Notarization Dossier Section */}
        <div className="border border-[#E5E0D8] rounded-lg p-5 bg-[#FFFFFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2A3A2C]" />
              <h3 className="font-serif text-base font-semibold text-[#1C1C18]">
                Forensic Examination Findings & Notarization
              </h3>
            </div>
            <span className="text-xs font-mono text-[#71615D]">
              ISO / IEC 30107-3 Biometric Presentation Attack Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="text-[#71615D] font-semibold uppercase text-[10px] block mb-1">
                Executive Auditor Verdict
              </span>
              <p className="text-[#2D211E] leading-relaxed bg-[#F6F3ED] p-3 rounded-lg border border-[#E5E0D8]">
                {candidate.summaryNotes}
              </p>
            </div>
            <div>
              <span className="text-[#71615D] font-semibold uppercase text-[10px] block mb-1">
                Deepfake Signal Decomposition
              </span>
              <p className="text-[#2D211E] leading-relaxed bg-[#F6F3ED] p-3 rounded-lg border border-[#E5E0D8]">
                {candidate.technicalFinding}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E0D8]/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-[#71615D]">
            <div>
              <span>Senior Certifying Examiner: </span>
              <strong className="text-[#1C1C18]">{candidate.certifyingOfficial}</strong>
            </div>
            <div>
              <span>Cryptographic Proof: </span>
              <code className="font-mono text-[#2A3A2C]">{candidate.cryptographicHash.slice(0, 32)}...</code>
            </div>
            <div>
              <span>Notarized At: </span>
              <span className="font-mono">{candidate.notarizedAt}</span>
            </div>
          </div>
        </div>

        {/* Action & Decision Bar */}
        <div className="border border-[#E5E0D8] rounded-lg p-4 bg-[#F6F3ED] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateCandidateStatus(candidate.id, 'authentic')}
              className="h-10 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-medium rounded-lg hover:bg-[#1E2B20] active:bg-[#151F16] border border-[#2A3A2C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Certify Authentic & Issue Seal
            </button>

            <button
              onClick={() => onUpdateCandidateStatus(candidate.id, 'synthetic_detected')}
              className="h-10 px-4 bg-[#B46244] text-white text-xs font-sans font-medium rounded-lg hover:bg-[#9C5237] active:bg-[#8E3E23] border border-[#B46244] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldAlert className="w-4 h-4" />
              Flag Synthetic Impersonation
            </button>

            <button
              onClick={() => onUpdateCandidateStatus(candidate.id, 'under_review')}
              className="h-10 px-3.5 bg-white text-[#2D211E] text-xs font-sans font-medium rounded-lg hover:bg-[#FAF8F5] border border-[#E5E0D8] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#71615D]" />
              Escalate to Tier-3 Board
            </button>
          </div>

          <button
            onClick={onOpenCertificateModal}
            className="h-10 px-4 bg-white text-[#2D211E] text-xs font-sans font-semibold rounded-lg hover:bg-[#FAF8F5] border border-[#2A3A2C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Award className="w-4 h-4 text-[#2A3A2C]" />
            Export Broad-Sheet Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
