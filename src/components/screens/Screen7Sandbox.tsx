import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Clock
} from 'lucide-react';

type TestMode = 'none' | 'diffusion_swap' | 'voice_clone' | 'real_baseline';
type PhaseStatus = 'idle' | 'running' | 'completed' | 'flagged';

interface PhaseInfo {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetry: {
    diffusion: { result: string; status: 'flagged'; metric: string };
    voice: { result: string; status: 'completed' | 'flagged'; metric: string };
    baseline: { result: string; status: 'completed'; metric: string };
  };
}

export const Screen7Sandbox: React.FC = () => {
  const [activeTest, setActiveTest] = useState<TestMode>('none');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(-1);
  const [phaseStatuses, setPhaseStatuses] = useState<PhaseStatus[]>(['idle', 'idle', 'idle', 'idle']);
  const [isProcessing, setIsProcessing] = useState(false);

  const phases: PhaseInfo[] = [
    {
      id: 1,
      name: 'De-interlacing & Frame Reconstruction',
      code: 'PHASE 01 // DE-INTERLACING',
      description: 'Temporal field blending correction, motion vector alignment, and micro-jitter isolation.',
      icon: Layers,
      telemetry: {
        diffusion: { result: 'Frame fields rebuilt; spatial temporal anomalies isolated in 60fps feed.', status: 'flagged', metric: '60fps Validated' },
        voice: { result: 'Frame sync standard. Optical motion vectors uniform.', status: 'completed', metric: '60fps Validated' },
        baseline: { result: 'Camera optical sensor motion vectors valid without synthetic warping.', status: 'completed', metric: '60fps Validated' },
      },
    },
    {
      id: 2,
      name: '2D Fourier Transform & Spectral Grid',
      code: 'PHASE 02 // FOURIER SPECTRAL',
      description: 'Frequency domain analysis to reveal checkerboard upsampling artifacts and GAN lattice fingerprints.',
      icon: Cpu,
      telemetry: {
        diffusion: { result: 'High-frequency periodic disparity found. Residual upsampling lattice detected at 4.2 kHz.', status: 'flagged', metric: 'Disparity: 88.4%' },
        voice: { result: 'Visual frequency spectrum Gaussian; no GAN pixel interpolation markers.', status: 'completed', metric: 'Gaussian: 98.7%' },
        baseline: { result: 'Clean analog lens noise floor. Natural light scattering confirmed.', status: 'completed', metric: 'Gaussian: 99.4%' },
      },
    },
    {
      id: 3,
      name: 'rPPG Vascular Pulse Extraction',
      code: 'PHASE 03 // rPPG PULSE HEMODYNAMICS',
      description: 'Sub-surface blood perfusion tracking through forehead chrominance shifts (Remote Photoplethysmography).',
      icon: Activity,
      telemetry: {
        diffusion: { result: 'Blood volume pulse FLATLINE (0 BPM). Subject face does not undergo cardiac pulsation.', status: 'flagged', metric: '0 BPM (FLATLINE)' },
        voice: { result: 'Natural hemodynamic pulse present (72 BPM) across biological facial tissue.', status: 'completed', metric: '72 BPM (Bio-pulse)' },
        baseline: { result: 'Normal cardiac rhythm (74 BPM). Dicrotic notch and systolic peak validated.', status: 'completed', metric: '74 BPM (Bio-pulse)' },
      },
    },
    {
      id: 4,
      name: 'DigiLocker Cryptographic Vault Match',
      code: 'PHASE 04 // DIGILOCKER VAULT',
      description: 'UIDAI biometric hash verification against notarized Aadhaar and passport cryptographic anchors.',
      icon: ShieldCheck,
      telemetry: {
        diffusion: { result: 'Biometric face hash divergence: Hash mismatch with government credential chain.', status: 'flagged', metric: 'Hash Divergence' },
        voice: { result: 'Facial hash valid; acoustic spectrogram signature flagged with synthetic vocoder.', status: 'flagged', metric: 'Vocal Model Alert' },
        baseline: { result: 'Official DigiLocker verification certificate matching biometric ledger (100% hash consensus).', status: 'completed', metric: 'Consensus 100%' },
      },
    },
  ];

  const runTest = (mode: TestMode) => {
    setActiveTest(mode);
    setIsProcessing(true);
    setPhaseStatuses(['idle', 'idle', 'idle', 'idle']);
    setActivePhaseIndex(0);

    // Sequentially step through the 4 phases
    let step = 0;
    const interval = setInterval(() => {
      if (step < 4) {
        setActivePhaseIndex(step);
        setPhaseStatuses((prev) => {
          const next = [...prev];
          next[step] = 'running';
          return next;
        });

        const currentStep = step;
        setTimeout(() => {
          setPhaseStatuses((prev) => {
            const next = [...prev];
            if (mode === 'diffusion_swap') {
              next[currentStep] = currentStep === 0 ? 'completed' : 'flagged';
            } else if (mode === 'voice_clone') {
              next[currentStep] = currentStep === 3 ? 'flagged' : 'completed';
            } else {
              next[currentStep] = 'completed';
            }
            return next;
          });
        }, 600);

        step++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 900);
  };

  const getOverallProgressPercentage = () => {
    if (activeTest === 'none') return 0;
    const completedCount = phaseStatuses.filter((s) => s === 'completed' || s === 'flagged').length;
    return (completedCount / 4) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2A3A2C]/60 block mb-1">
            SCREEN 7: Simulation Environment
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2A3A2C]">
            Forensic Sandbox
          </h1>
          <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5">
            Test multi-stage forensic pipelines against simulated synthetic deepfakes and authentic human baselines.
          </p>
        </div>

        {/* Test Buttons: "Test Diffusion Swap", "Test Voice Clone", "Test Real Baseline" */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button: "Test Diffusion Swap" (Terracotta) */}
          <button
            onClick={() => runTest('diffusion_swap')}
            disabled={isProcessing}
            className={`h-10 px-4 text-xs font-sans font-semibold rounded-lg border transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
              activeTest === 'diffusion_swap'
                ? 'bg-[#B46244] border-[#B46244] text-white'
                : 'bg-[#FFFFFF] border-[#B46244] text-[#B46244] hover:bg-[#B46244]/10'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Test Diffusion Swap</span>
          </button>

          {/* Button: "Test Voice Clone" */}
          <button
            onClick={() => runTest('voice_clone')}
            disabled={isProcessing}
            className={`h-10 px-4 text-xs font-sans font-semibold rounded-lg border transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
              activeTest === 'voice_clone'
                ? 'bg-[#2A3A2C] border-[#2A3A2C] text-white'
                : 'bg-[#FFFFFF] border-[#2A3A2C] text-[#2A3A2C] hover:bg-[#F9F6F0]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Test Voice Clone</span>
          </button>

          {/* Button: "Test Real Baseline" */}
          <button
            onClick={() => runTest('real_baseline')}
            disabled={isProcessing}
            className={`h-10 px-4 text-xs font-sans font-semibold rounded-lg border transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
              activeTest === 'real_baseline'
                ? 'bg-[#2A3A2C] border-[#2A3A2C] text-white'
                : 'bg-[#FFFFFF] border-[#2A3A2C] text-[#2A3A2C] hover:bg-[#F9F6F0]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Real Baseline</span>
          </button>
        </div>
      </div>

      {/* Visual: Progress Bar for the phases */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-[#2A3A2C]">
              Forensic Pipeline Progress
            </span>
            {activeTest !== 'none' && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F9F6F0] border border-[#E5E0D8] text-[#2A3A2C]">
                Active Test: {activeTest.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-mono text-xs font-bold text-[#2A3A2C]">
            {getOverallProgressPercentage().toFixed(0)}% Complete
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-[#F9F6F0] h-3 rounded-full overflow-hidden border border-[#E5E0D8]">
          <div
            style={{ width: `${getOverallProgressPercentage()}%` }}
            className={`h-full transition-all duration-300 ${
              activeTest === 'diffusion_swap'
                ? 'bg-[#B46244]'
                : activeTest === 'voice_clone'
                ? 'bg-[#B46244]'
                : 'bg-[#2A3A2C]'
            }`}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 text-center">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="text-left">
              <span className="font-mono text-[10px] text-[#2A3A2C]/60 block">
                0{phase.id}
              </span>
              <span className={`text-[11px] font-sans font-medium truncate block ${
                phaseStatuses[idx] === 'completed'
                  ? 'text-[#3D593D] font-bold'
                  : phaseStatuses[idx] === 'flagged'
                  ? 'text-[#B46244] font-bold'
                  : phaseStatuses[idx] === 'running'
                  ? 'text-[#2A3A2C] font-semibold'
                  : 'text-[#2A3A2C]/50'
              }`}>
                {phase.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Layout: A vertical list of 4 phases (De-interlacing, Fourier, rPPG, DigiLocker) */}
      <div className="space-y-3.5">
        {phases.map((phase, idx) => {
          const status = phaseStatuses[idx];
          const Icon = phase.icon;

          let telemetryInfo = null;
          if (activeTest === 'diffusion_swap') {
            telemetryInfo = phase.telemetry.diffusion;
          } else if (activeTest === 'voice_clone') {
            telemetryInfo = phase.telemetry.voice;
          } else if (activeTest === 'real_baseline') {
            telemetryInfo = phase.telemetry.baseline;
          }

          return (
            <div
              key={phase.id}
              className={`bg-[#FFFFFF] border rounded-lg p-5 shadow-xs transition-all ${
                status === 'flagged'
                  ? 'border-[#B46244] bg-[#B46244]/4'
                  : status === 'completed'
                  ? 'border-[#E5E0D8]'
                  : status === 'running'
                  ? 'border-[#2A3A2C] ring-1 ring-[#2A3A2C]'
                  : 'border-[#E5E0D8] opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    status === 'flagged'
                      ? 'bg-[#B46244] text-white'
                      : status === 'completed'
                      ? 'bg-[rgba(107,142,107,0.15)] text-[#3D593D]'
                      : status === 'running'
                      ? 'bg-[#2A3A2C] text-white animate-spin'
                      : 'bg-[#F9F6F0] text-[#2A3A2C]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#2A3A2C]/60 tracking-wider">
                        {phase.code}
                      </span>
                      {status === 'flagged' && (
                        <span className="font-mono text-[10px] font-bold bg-[#B46244] text-white px-2 py-0.2 rounded uppercase">
                          Tamper Detected
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className="font-mono text-[10px] font-bold bg-[rgba(107,142,107,0.15)] text-[#3D593D] px-2 py-0.2 rounded uppercase">
                          Passed
                        </span>
                      )}
                      {status === 'running' && (
                        <span className="font-mono text-[10px] font-bold bg-[#2A3A2C]/10 text-[#2A3A2C] px-2 py-0.2 rounded uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 animate-spin" /> Analyzing...
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#2A3A2C]">
                      {phase.name}
                    </h3>
                    <p className="text-xs font-sans text-[#2A3A2C]/70 mt-0.5 max-w-2xl">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Metric pill */}
                <div className="sm:text-right shrink-0">
                  {telemetryInfo ? (
                    <div>
                      <span className="font-mono text-xs font-bold text-[#2A3A2C] block">
                        {telemetryInfo.metric}
                      </span>
                      <span className={`text-[10px] font-sans font-semibold uppercase ${
                        status === 'flagged' ? 'text-[#B46244]' : 'text-[#3D593D]'
                      }`}>
                        {status === 'flagged' ? 'Defect Confirmed' : 'Within Bounds'}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-[#2A3A2C]/40">
                      Standby
                    </span>
                  )}
                </div>
              </div>

              {/* Forensic Findings Box when active */}
              {telemetryInfo && (status === 'completed' || status === 'flagged') && (
                <div className={`mt-3.5 pt-3 border-t text-xs font-sans flex items-start gap-2 ${
                  status === 'flagged'
                    ? 'border-[#B46244]/30 text-[#B46244] bg-[#B46244]/5 p-2.5 rounded'
                    : 'border-[#E5E0D8] text-[#2A3A2C]/80 bg-[#F9F6F0] p-2.5 rounded'
                }`}>
                  {status === 'flagged' ? (
                    <ShieldAlert className="w-4 h-4 shrink-0 text-[#B46244] mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#3D593D] mt-0.5" />
                  )}
                  <div>
                    <strong className="font-medium">Phase Finding: </strong>
                    <span>{telemetryInfo.result}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
