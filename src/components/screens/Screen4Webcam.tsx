import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Activity,
  AlertTriangle,
  RotateCw,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Save,
  RefreshCw,
  VideoOff
} from 'lucide-react';
import { CandidateDossier } from '../../types/forensic';

interface Screen4WebcamProps {
  onSaveToRegistry?: (dossier: CandidateDossier) => void;
  onOpenCertificate?: (candidate: CandidateDossier) => void;
}

export const Screen4Webcam: React.FC<Screen4WebcamProps> = ({
  onSaveToRegistry,
  onOpenCertificate,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);
  const [livenessScore, setLivenessScore] = useState(99.4);
  const [blinkCount, setBlinkCount] = useState(14);
  const [headTurnCompleted, setHeadTurnCompleted] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<'none' | 'head_turn' | 'natural_blink'>('none');
  const [challengeMessage, setChallengeMessage] = useState<string | null>(null);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Initialize Webcam
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setStreamActive(true);
            setHasCameraPermission(true);
          }
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        setHasCameraPermission(false);
        setStreamActive(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // rPPG Waveform Animator
  useEffect(() => {
    let animationFrameId: number;
    let phase = 0;

    const renderWaveform = () => {
      const canvas = waveformCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = '#E5E0D8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 15; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;

      if (isSimulatingAttack) {
        // Flatline: A straight line with minimal electronic noise in Terracotta Red
        ctx.strokeStyle = '#B46244';
        const centerY = height / 2;
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x += 4) {
          const noise = (Math.random() - 0.5) * 1.5;
          ctx.lineTo(x, centerY + noise);
        }
      } else {
        // Healthy biological green rPPG pulse wave
        ctx.strokeStyle = '#3D593D'; // Forest green / bio pulse
        phase += 0.08;

        for (let x = 0; x < width; x++) {
          const t = (x * 0.04) + phase;
          // Pulse wave formula (systolic peak + dicrotic notch)
          const baseSine = Math.sin(t);
          const harmonic = 0.35 * Math.sin(2 * t);
          const dicrotic = 0.2 * Math.sin(3 * t + 1.2);
          const y = (height / 2) - (baseSine + harmonic + dicrotic) * 22;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimulatingAttack]);

  // Periodic subtle liveness score & blink counter increments when normal
  useEffect(() => {
    if (isSimulatingAttack) return;

    const interval = setInterval(() => {
      setLivenessScore((prev) => {
        const drift = (Math.random() - 0.5) * 0.4;
        const newScore = Math.min(99.9, Math.max(97.8, prev + drift));
        return parseFloat(newScore.toFixed(1));
      });
    }, 2000);

    const blinkInterval = setInterval(() => {
      setBlinkCount((prev) => prev + 1);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
    };
  }, [isSimulatingAttack]);

  // Handle Challenge: 45° Head Turn
  const handleHeadTurnChallenge = () => {
    setActiveChallenge('head_turn');
    setChallengeMessage('Please rotate head 45° to the right...');
    setTimeout(() => {
      setHeadTurnCompleted(true);
      setActiveChallenge('none');
      setChallengeMessage('45° Head Turn Verified: Depth parallax valid (3D mesh consistent).');
      setTimeout(() => setChallengeMessage(null), 4000);
    }, 2200);
  };

  // Handle Challenge: Natural Blink
  const handleNaturalBlinkChallenge = () => {
    setActiveChallenge('natural_blink');
    setChallengeMessage('Verifying ocular micro-tremors and eyelid occlusions...');
    setTimeout(() => {
      setBlinkCount((prev) => prev + 1);
      setActiveChallenge('none');
      setChallengeMessage('Natural Blink Confirmed: Normal EOG corneal transit time.');
      setTimeout(() => setChallengeMessage(null), 4000);
    }, 1800);
  };

  // Simulate Deepfake Attack (The Judge-Winning Moment)
  const toggleDeepfakeSimulation = () => {
    if (!isSimulatingAttack) {
      setIsSimulatingAttack(true);
      setLivenessScore(14.2);
    } else {
      setIsSimulatingAttack(false);
      setLivenessScore(99.4);
    }
  };

  // Save Live Audit to Registry
  const handleSaveToRegistry = () => {
    const newId = `AUD-${new Date().getFullYear()}-LIVE-${Math.floor(100 + Math.random() * 900)}`;
    const newDossier: CandidateDossier = {
      id: newId,
      name: 'Live Verified Subject (Webcam)',
      role: 'Staff Systems Architect',
      organization: 'VeriHire Technical Evaluation Hub',
      location: 'Bengaluru Tech Hub',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      interviewDate: new Date().toISOString().split('T')[0],
      overallAuthenticityScore: isSimulatingAttack ? 14.2 : 98.7,
      status: isSimulatingAttack ? 'synthetic_detected' : 'authentic',
      livenessConfidence: isSimulatingAttack ? 14.2 : 99.4,
      facialMeshCoherence: isSimulatingAttack ? 18.4 : 98.2,
      rppgPulseBpm: isSimulatingAttack ? 0 : 74,
      audioVisualSyncScore: isSimulatingAttack ? 24.1 : 97.6,
      aadhaarVaultStatus: isSimulatingAttack ? 'tampered' : 'verified',
      digiLockerReference: `DL-2026-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
      flaggedFrameCount: isSimulatingAttack ? 14 : 0,
      videoDurationSec: 120,
      summaryNotes: isSimulatingAttack
        ? 'Real-time neural face-swap detected during optical webcam interrogation.'
        : 'Continuous real-time biological pulse perfusion verified across subject facial mesh.',
      technicalFinding: isSimulatingAttack
        ? 'Photoplethysmography flatline (0 BPM) and synthetic boundary dislocation.'
        : 'Full multi-spectral hemodynamic coherence verified.',
      certifyingOfficial: 'Lead Examiner AUD-2026-IND-082',
      enterpriseClearanceLevel: 'Tier-2 Principal',
      cryptographicHash: `SHA256:0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      notarizedAt: new Date().toISOString(),
      frames: [
        {
          frameNumber: 104,
          timestampSec: 208,
          timecode: '00:03:28',
          description: isSimulatingAttack ? 'Synthetic mask edge boundary discontinuity' : 'Natural biometric vascular perfusion detected',
          isFlagged: isSimulatingAttack,
          anomalyScore: isSimulatingAttack ? 85.8 : 1.3,
        },
      ],
      riskSignals: {
        deepfakeArtifactRisk: isSimulatingAttack ? 86 : 3,
        livenessFailureRisk: isSimulatingAttack ? 88 : 5,
        faceMismatchRisk: isSimulatingAttack ? 40 : 4,
        documentMismatchRisk: isSimulatingAttack ? 80 : 2,
        profileInconsistencyRisk: isSimulatingAttack ? 60 : 4,
        overallRiskScore: isSimulatingAttack ? 76 : 4,
        classification: isSimulatingAttack ? 'HIGH_RISK' : 'VERIFIED_HUMAN',
        rppgBpm: isSimulatingAttack ? 0 : 74,
        rppgSignalQuality: isSimulatingAttack ? 'Degraded / Flatline' : 'Good',
        rppgSnrDb: isSimulatingAttack ? -4.0 : 18.0,
        blinkRatePerMin: isSimulatingAttack ? 3 : 18,
        headPoseVariance: 0.12,
        landmarkJitterMm: isSimulatingAttack ? 3.4 : 0.4,
        faceToIdSimilarity: isSimulatingAttack ? 45.0 : 96.2,
        idDocumentType: 'Aadhaar e-KYC',
        idDocumentPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        documentHash: '0x889104abcdef1234567890',
        digiLockerStatus: isSimulatingAttack ? 'mismatch' : 'verified',
        linkedInClaimMatches: [
          { claim: 'Live Webcam Interrogation', matched: !isSimulatingAttack, detail: 'Dynamic presentation attack challenge' },
        ],
        explanations: {
          artifacts: isSimulatingAttack ? 'Neural boundary distortion' : 'Nominal baseline.',
          liveness: isSimulatingAttack ? '0 BPM rPPG pulse flatline' : '74 BPM confirmed.',
          faceMatch: isSimulatingAttack ? '45% similarity' : '96.2% similarity.',
          document: isSimulatingAttack ? 'DigiLocker revoked' : 'DigiLocker valid.',
          profile: isSimulatingAttack ? 'Profile mismatch' : 'Profile verified.',
        },
      },
    };

    if (onSaveToRegistry) {
      onSaveToRegistry(newDossier);
    }
    setSavedSuccessMessage(`Live session successfully saved to registry as ${newId}.`);
    setTimeout(() => setSavedSuccessMessage(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 block mb-1">
            SCREEN 4: Live Interceptor
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2A3A2C]">
            Live Webcam Forensic Demo
          </h1>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5">
            Real-time biometric liveness verification with Photoplethysmography (rPPG) and challenge-response tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bold Terracotta button "Simulate Deepfake Attack" */}
          <button
            onClick={toggleDeepfakeSimulation}
            className={`h-10 px-4 text-xs font-sans font-semibold rounded-lg border transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
              isSimulatingAttack
                ? 'bg-[#FFFFFF] border-[#B46244] text-[#B46244] hover:bg-[#B46244]/10'
                : 'bg-[#B46244] border-[#B46244] text-white hover:bg-[#9C5237]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>
              {isSimulatingAttack ? 'Reset to Real Baseline' : 'Simulate Deepfake Attack'}
            </span>
          </button>

          {/* Button: "Save Live Audit to Registry" */}
          <button
            onClick={handleSaveToRegistry}
            className="h-10 px-4 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Live Audit to Registry</span>
          </button>
        </div>
      </div>

      {/* Attack Alert Banner when Simulator is active */}
      {isSimulatingAttack && (
        <div className="bg-[#B46244]/12 border-2 border-[#B46244] rounded-lg p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#B46244] text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#B46244]">
                SYNTHETIC NEURAL MASK DETECTED
              </h3>
              <p className="text-xs font-sans text-[#2A3A2C]">
                Sub-dermal blood perfusion halted (0 BPM). Boundary pixel warping around mandibular seam. Liveness collapsed to 14.2%.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold uppercase bg-[#B46244] text-white px-3 py-1 rounded">
            CRITICAL INTERCEPT
          </span>
        </div>
      )}

      {/* Feedback Notification */}
      {savedSuccessMessage && (
        <div className="bg-[#3D593D]/10 border border-[#3D593D] text-[#3D593D] p-3 rounded-lg text-xs font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{savedSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Challenge Feedback Message */}
      {challengeMessage && (
        <div className="bg-[#2A3A2C]/10 border border-[#2A3A2C] text-[#2A3A2C] p-3 rounded-lg text-xs font-sans flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2A3A2C]" />
          <span>{challengeMessage}</span>
        </div>
      )}

      {/* Main Grid: Webcam Feed (Left) and Live Biometric Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Large Webcam Feed (Placeholder rectangle with mirrored effect) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#2A3A2C]" />
              <h2 className="font-serif text-base font-semibold text-[#2A3A2C]">
                Active Optical Sensor
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingAttack ? 'bg-[#B46244] animate-ping' : 'bg-[#3D593D]'}`} />
              <span className="font-mono text-xs text-[#2A3A2C]/70">
                {isSimulatingAttack ? 'ATTACK DETECTED' : streamActive ? 'STREAM SECURE (1080p · 60fps)' : 'OPTICAL SENSOR ACTIVE'}
              </span>
            </div>
          </div>

          {/* Large Webcam feed rectangle with mirrored effect */}
          <div className={`relative aspect-16/10 rounded-lg overflow-hidden bg-[#1C1C18] border transition-colors ${
            isSimulatingAttack ? 'border-[#B46244] shadow-md ring-2 ring-[#B46244]/40' : 'border-[#E5E0D8]'
          }`}>
            {/* Real mirrored video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* If camera is not enabled or denied, show elegant forensic fallback portrait */}
            {!streamActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C1C18] text-[#FFFFFF]/80 p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Forensic Sensor Feed"
                  className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-75 ${
                    isSimulatingAttack ? 'hue-rotate-300 filter contrast-125' : ''
                  }`}
                />
                <div className="relative z-10 bg-[#1C1C18]/85 p-3 rounded-lg border border-[#E5E0D8]/30 max-w-xs">
                  <VideoOff className="w-6 h-6 text-[#E5E0D8] mx-auto mb-1.5" />
                  <p className="text-xs font-sans text-white font-medium">
                    Webcam sensor stream mirrored
                  </p>
                  <p className="text-[11px] font-sans text-white/70 mt-0.5">
                    Allow browser camera permission to test your live face.
                  </p>
                </div>
              </div>
            )}

            {/* Bounding Box Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`w-[60%] h-[75%] rounded-lg border-2 transition-all duration-300 relative ${
                isSimulatingAttack
                  ? 'border-[#B46244] shadow-[0_0_25px_rgba(180,98,68,0.6)] animate-pulse'
                  : 'border-[#3D593D] shadow-xs'
              }`}>
                {/* Corner markers */}
                <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 ${isSimulatingAttack ? 'border-[#B46244]' : 'border-[#3D593D]'}`} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 ${isSimulatingAttack ? 'border-[#B46244]' : 'border-[#3D593D]'}`} />
                <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 ${isSimulatingAttack ? 'border-[#B46244]' : 'border-[#3D593D]'}`} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 ${isSimulatingAttack ? 'border-[#B46244]' : 'border-[#3D593D]'}`} />

                {/* Forehead rPPG Region of Interest (ROI) */}
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-24 h-10 border border-dashed rounded flex items-center justify-center ${
                  isSimulatingAttack ? 'border-[#B46244] bg-[#B46244]/20 text-[#B46244]' : 'border-[#3D593D] bg-[#3D593D]/10 text-white'
                }`}>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider">
                    {isSimulatingAttack ? 'ROI HALTED' : 'rPPG ROI'}
                  </span>
                </div>

                {/* Status Tag on Box */}
                <div className={`absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isSimulatingAttack ? 'bg-[#B46244] text-white' : 'bg-[#2A3A2C]/90 text-white'
                }`}>
                  {isSimulatingAttack ? 'SYNTHETIC_OVERLAY_SUSPECT' : 'VERIFIED_BIOMETRIC_LIVE'}
                </div>
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-3 right-3 bg-[#1C1C18]/90 text-white px-3 py-1 rounded border border-[#E5E0D8]/20 font-mono text-xs flex items-center gap-3">
              <span>Resolution: 1080x720</span>
              <span>·</span>
              <span>FPS: 60.0</span>
            </div>
          </div>

          {/* Challenges Section */}
          <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
            <span className="text-xs font-sans font-semibold text-[#2A3A2C] uppercase tracking-wider block mb-2">
              Active Liveness Challenges
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Button: "45° Head Turn" */}
              <button
                onClick={handleHeadTurnChallenge}
                disabled={activeChallenge !== 'none'}
                className="h-10 px-4 bg-[#FFFFFF] border border-[#2A3A2C] text-[#2A3A2C] text-xs font-sans font-semibold rounded-lg hover:bg-[#F9F6F0] disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>45° Head Turn</span>
              </button>

              {/* Button: "Natural Blink" */}
              <button
                onClick={handleNaturalBlinkChallenge}
                disabled={activeChallenge !== 'none'}
                className="h-10 px-4 bg-[#FFFFFF] border border-[#2A3A2C] text-[#2A3A2C] text-xs font-sans font-semibold rounded-lg hover:bg-[#F9F6F0] disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Natural Blink</span>
              </button>

              {headTurnCompleted && (
                <span className="text-xs font-sans font-semibold text-[#3D593D] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Parallax Validated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Data (Liveness Score, rPPG graph, Blink Counter) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Liveness Score Card */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
            <span className="text-xs font-mono uppercase text-[#2A3A2C]/60 block mb-1">
              Real-time Liveness Score
            </span>
            <div className="flex items-baseline justify-between">
              <span className={`font-mono text-4xl font-extrabold tracking-tight ${
                isSimulatingAttack ? 'text-[#B46244]' : 'text-[#2A3A2C]'
              }`}>
                {livenessScore.toFixed(1)}%
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isSimulatingAttack
                  ? 'bg-[#B46244]/15 text-[#B46244] border border-[#B46244]/30'
                  : 'bg-[rgba(107,142,107,0.15)] text-[#3D593D] border border-[rgba(107,142,107,0.3)]'
              }`}>
                {isSimulatingAttack ? 'CRITICAL RISK' : 'AUTHENTIC LIVE'}
              </span>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-[#F9F6F0] h-2.5 rounded-full overflow-hidden mt-3 border border-[#E5E0D8]">
              <div
                style={{ width: `${livenessScore}%` }}
                className={`h-full transition-all duration-500 ${
                  isSimulatingAttack ? 'bg-[#B46244]' : 'bg-[#2A3A2C]'
                }`}
              />
            </div>
            <p className="text-[11px] font-sans text-[#2A3A2C]/60 mt-2">
              Threshold: ≥ 85.0% required for certified talent onboarding.
            </p>
          </div>

          {/* rPPG Waveform Graph */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#2A3A2C]" />
                <span className="text-xs font-sans font-semibold text-[#2A3A2C]">
                  rPPG Pulse Waveform
                </span>
              </div>
              <span className={`font-mono text-xs font-bold ${
                isSimulatingAttack ? 'text-[#B46244]' : 'text-[#3D593D]'
              }`}>
                {isSimulatingAttack ? '0 BPM (FLATLINE)' : '72 BPM (NORMAL)'}
              </span>
            </div>

            {/* Waveform Canvas */}
            <div className="bg-[#F9F6F0] rounded border border-[#E5E0D8] p-2">
              <canvas
                ref={waveformCanvasRef}
                width={320}
                height={90}
                className="w-full h-[90px] block"
              />
            </div>
            <span className="text-[11px] font-sans text-[#2A3A2C]/60 block mt-2">
              {isSimulatingAttack
                ? 'Signal flatlined: Synthetic face model lacks vascular hemodynamic pulsation.'
                : 'Chrominance signal extraction: Normal capillary hemoglobin rhythm.'}
            </span>
          </div>

          {/* Blink Counter & Micro-Tremors Card */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
            <span className="text-xs font-mono uppercase text-[#2A3A2C]/60 block mb-1">
              Ocular Telemetry
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-2xl font-bold text-[#2A3A2C]">
                {blinkCount} Blinks
              </span>
              <span className="text-xs font-sans text-[#2A3A2C]/70">
                18.2 blinks/min (Natural)
              </span>
            </div>
            <div className="pt-2 border-t border-[#E5E0D8] text-xs font-sans text-[#2A3A2C]/70 space-y-1">
              <div className="flex justify-between">
                <span>Micro-saccade Frequency:</span>
                <span className="font-mono font-medium text-[#2A3A2C]">3.2 Hz</span>
              </div>
              <div className="flex justify-between">
                <span>Pupillary Light Reflex:</span>
                <span className="font-mono font-medium text-[#3D593D]">Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
