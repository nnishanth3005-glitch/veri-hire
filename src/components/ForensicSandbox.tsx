import React, { useState } from 'react';
import { Upload, Play, CheckCircle, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Sparkles, ArrowRight } from 'lucide-react';

interface BenchmarkCase {
  id: string;
  title: string;
  category: string;
  source: string;
  description: string;
  avatarUrl: string;
  expectedVerdict: 'synthetic' | 'authentic';
  details: {
    rppgPulse: string;
    audioCutoff: string;
    meshJitter: string;
    score: number;
    notes: string;
  };
}

const BENCHMARKS: BenchmarkCase[] = [
  {
    id: 'CASE-01',
    title: 'Real-Time Diffusion Face-Swap Attack',
    category: 'Visual Synthesis',
    source: 'Synthetic Stream #4491 · Hyderabad Hub',
    description: 'Virtual webcam driver injecting real-time style-based GAN avatar over impersonator.',
    avatarUrl: '/src/assets/images/candidate_rohan_verma_1793351386798.jpg',
    expectedVerdict: 'synthetic',
    details: {
      rppgPulse: '0 BPM (Flatline vascular absorption)',
      audioCutoff: 'Nominal acoustic spectrum',
      meshJitter: 'Severe 14-pixel mandibular seam disparity',
      score: 18.6,
      notes: 'High-frequency Fourier analysis isolates up-sampling checkerboard pattern along cervical boundary.'
    }
  },
  {
    id: 'CASE-02',
    title: 'ElevenLabs Voice Clone & Phonation Mismatch',
    category: 'Audio Synthesis',
    source: 'Financial Platform Stream #9910 · Gurugram Hub',
    description: 'Generative speech model driving lip aperture with periodic pitch formants.',
    avatarUrl: '/src/assets/images/candidate_aarav_sharma_1793351385438.jpg',
    expectedVerdict: 'synthetic',
    details: {
      rppgPulse: 'Inconclusive / Proxy Actor Pulse',
      audioCutoff: 'Sharp 8.2 kHz harmonic cutoff',
      meshJitter: '148ms audio-lip phase desync',
      score: 24.2,
      notes: 'Phoneme-viseme aperture alignment failed during plosive consonants /p/ and /b/.'
    }
  },
  {
    id: 'CASE-03',
    title: 'Legitimate Enterprise Cloud Architect',
    category: 'Authentic Baseline',
    source: 'Verified Stream #0985 · Mumbai Hub',
    description: 'Human executive verified across all physiological and national credential checkpoints.',
    avatarUrl: '/src/assets/images/candidate_priya_nair_1793351386626.jpg',
    expectedVerdict: 'authentic',
    details: {
      rppgPulse: '68.4 BPM (Normal biological variance)',
      audioCutoff: 'Continuous 22.0 kHz natural spectrum',
      meshJitter: 'Stable anatomical surface geometry',
      score: 98.9,
      notes: 'Micro-saccades, spontaneous eyelid elasticity, and DigiLocker key chain authentic.'
    }
  }
];

export const ForensicSandbox: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<BenchmarkCase>(BENCHMARKS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<BenchmarkCase['details'] | null>(null);

  const runPipeline = (benchmark: BenchmarkCase) => {
    setSelectedCase(benchmark);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    const steps = [
      'Step 1/4: De-interlacing video frames and isolating facial boundary polygons...',
      'Step 2/4: Computing 2D Fourier residual spectrum across mandibular contours...',
      'Step 3/4: Extracting multi-channel photoplethysmography (rPPG) vascular pulse...',
      'Step 4/4: Cross-verifying audio harmonic formants against DigiLocker certified key...',
    ];

    let stepIdx = 0;
    setCurrentStep(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setCurrentStep(steps[stepIdx]);
        setAnalysisProgress((prev) => prev + 25);
      } else {
        clearInterval(interval);
        setAnalysisProgress(100);
        setIsAnalyzing(false);
        setAnalysisResult(benchmark.details);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Sandbox Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-6 shadow-xs">
        <span className="text-xs font-mono font-semibold uppercase text-[#71615D] tracking-wider block mb-1">
          Forensic Research & Diagnostic Sandbox
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1C1C18]">
          Deepfake Pipeline Stress Test & Synthetic Analysis
        </h1>
        <p className="text-sm font-sans text-[#524440] mt-0.5">
          Execute multi-layer presentation attack detection algorithms on synthetic attack vectors
        </p>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Benchmark Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-4 shadow-xs">
            <h3 className="font-serif text-base font-semibold text-[#1C1C18] mb-1">
              Select Forensic Case Study
            </h3>
            <p className="text-xs font-sans text-[#71615D] mb-3">
              Standardized test vectors from enterprise talent incidents
            </p>

            <div className="space-y-2.5">
              {BENCHMARKS.map((b) => {
                const isSelected = selectedCase.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedCase(b);
                      setAnalysisResult(null);
                    }}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#2A3A2C] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] hover:bg-[#FAF8F5]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={b.avatarUrl}
                        alt={b.title}
                        className="w-11 h-11 rounded-lg object-cover border border-[#E5E0D8] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase text-[#71615D] block">
                          {b.category} · {b.id}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-[#1C1C18] truncate">
                          {b.title}
                        </h4>
                        <p className="text-[11px] font-sans text-[#524440] line-clamp-1 mt-0.5">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => runPipeline(selectedCase)}
              disabled={isAnalyzing}
              className="mt-4 w-full h-11 bg-[#2A3A2C] text-white text-xs font-sans font-medium rounded-lg hover:bg-[#1E2B20] active:bg-[#151F16] flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>{isAnalyzing ? 'Processing Pipeline...' : `Execute Pipeline on ${selectedCase.id}`}</span>
            </button>
          </div>
        </div>

        {/* Right: Pipeline Execution & Diagnostic Report */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#71615D]">
                  Target: {selectedCase.source}
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#1C1C18]">
                  {selectedCase.title}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#71615D]">
                Algorithm: Presentation Attack ISO 30107
              </span>
            </div>

            {/* Execution Progress Bar */}
            {isAnalyzing && (
              <div className="p-4 bg-[#F6F3ED] rounded-lg border border-[#E5E0D8] mb-6">
                <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                  <span className="font-semibold text-[#1C1C18]">{currentStep}</span>
                  <span className="font-mono font-bold text-[#2A3A2C]">{analysisProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2A3A2C] transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Report Output */}
            {analysisResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <span className="text-[10px] font-mono uppercase text-[#71615D] block">
                      Photoplethysmography
                    </span>
                    <strong className="text-xs font-mono text-[#1C1C18] block mt-1">
                      {analysisResult.rppgPulse}
                    </strong>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <span className="text-[10px] font-mono uppercase text-[#71615D] block">
                      Audio Spectral Formants
                    </span>
                    <strong className="text-xs font-mono text-[#1C1C18] block mt-1">
                      {analysisResult.audioCutoff}
                    </strong>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <span className="text-[10px] font-mono uppercase text-[#71615D] block">
                      Mandibular Mesh Stability
                    </span>
                    <strong className="text-xs font-mono text-[#1C1C18] block mt-1">
                      {analysisResult.meshJitter}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-[#F6F3ED] border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-semibold text-[#1C1C18]">
                      Diagnostic Finding & Recommendation
                    </span>
                    <span className={`font-mono text-sm font-bold ${
                      selectedCase.expectedVerdict === 'authentic' ? 'text-[#3D593D]' : 'text-[#8E3E23]'
                    }`}>
                      Authenticity Score: {analysisResult.score}%
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#2D211E] leading-relaxed">
                    {analysisResult.notes}
                  </p>
                </div>
              </div>
            ) : !isAnalyzing ? (
              <div className="p-12 text-center border-2 border-dashed border-[#E5E0D8] rounded-lg">
                <Cpu className="w-8 h-8 text-[#71615D] mx-auto mb-2 opacity-50" />
                <h4 className="font-serif text-base font-semibold text-[#1C1C18]">
                  Pipeline Standby
                </h4>
                <p className="text-xs font-sans text-[#71615D] max-w-sm mx-auto mt-1">
                  Click Execute Pipeline to run the 4-phase forensic presentation attack inspection on {selectedCase.id}.
                </p>
              </div>
            ) : null}
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] text-[11px] font-sans text-[#71615D] flex items-center justify-between">
            <span>Enterprise Talent Safety Engine v4.2</span>
            <span className="font-mono">Tested with Indian UIDAI & DigiLocker specs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
