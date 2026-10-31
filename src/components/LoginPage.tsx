import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export interface AuthUser {
  name: string;
  role: string;
  auditorId: string;
  hub: string;
  clearanceLevel: string;
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

// Single Authorized Bureau Examiner Credentials
const AUTHORIZED_CREDENTIALS = {
  auditorId: 'AUD-2026-IND-082',
  passphrase: 'Sovereign@2026',
  name: 'Dr. Devika Sen',
  role: 'Senior Forensic Examiner',
  hub: 'Bengaluru Corridor',
  clearanceLevel: 'Tier-1 Executive Forensic Board',
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [auditorId, setAuditorId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const enteredId = auditorId.trim();
    const enteredPass = passphrase.trim();

    // Strict validation: Only the single authorized examiner is allowed
    setTimeout(() => {
      if (
        enteredId === AUTHORIZED_CREDENTIALS.auditorId &&
        enteredPass === AUTHORIZED_CREDENTIALS.passphrase
      ) {
        onLogin({
          name: AUTHORIZED_CREDENTIALS.name,
          role: AUTHORIZED_CREDENTIALS.role,
          auditorId: AUTHORIZED_CREDENTIALS.auditorId,
          hub: AUTHORIZED_CREDENTIALS.hub,
          clearanceLevel: AUTHORIZED_CREDENTIALS.clearanceLevel,
        });
      } else {
        setErrorMessage('Invalid Auditor ID or Passphrase. Access Denied.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleFillAuthorized = () => {
    setAuditorId(AUTHORIZED_CREDENTIALS.auditorId);
    setPassphrase(AUTHORIZED_CREDENTIALS.passphrase);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F3] text-[#2D211E] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#2A3A2C] flex items-center justify-center text-white font-serif font-bold text-sm">
            S
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#1C1C18]">
            Editorial Sovereign
          </span>
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71615D] hidden sm:inline-block pl-2 border-l border-[#E5E0D8]">
            Restricted Bureau Gateway
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#71615D]">
          <Lock className="w-3.5 h-3.5 text-[#2A3A2C]" />
          <span>FIPS 140-3 Hardware Enforced</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg p-8 sm:p-9 shadow-xs relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#71615D] block mb-1.5">
              Authorized Personnel Only
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1C18] tracking-tight">
              Institutional Gate
            </h1>
            <p className="text-xs font-sans text-[#524440] mt-1.5">
              Enter official credentials to access the Forensic Presentation Attack Inspection Suite
            </p>
          </div>

          {/* Invalid ID or Password Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#B46244]/10 border border-[#B46244]/35 text-[#8E3E23] text-xs font-sans flex items-center gap-2.5 animate-shake">
              <ShieldAlert className="w-5 h-5 shrink-0 text-[#B46244]" />
              <div>
                <strong className="font-semibold block">{errorMessage}</strong>
                <span className="text-[11px] text-[#524440]">
                  Only authorized personnel are permitted to sign in.
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                Auditor Reference ID
              </label>
              <input
                type="text"
                value={auditorId}
                onChange={(e) => {
                  setAuditorId(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter Auditor ID"
                className={`w-full h-11 px-3.5 bg-[#FFFFFF] border rounded-lg text-xs font-mono text-[#1C1C18] focus:outline-none transition-colors ${
                  errorMessage ? 'border-[#B46244]' : 'border-[#E5E0D8] focus:border-[#2A3A2C]'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                Security Passphrase
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter Security Passphrase"
                className={`w-full h-11 px-3.5 bg-[#FFFFFF] border rounded-lg text-xs font-mono text-[#1C1C18] focus:outline-none transition-colors ${
                  errorMessage ? 'border-[#B46244]' : 'border-[#E5E0D8] focus:border-[#2A3A2C]'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full h-11 bg-[#2A3A2C] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[#1E2B20] active:bg-[#151F16] border border-[#2A3A2C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Authorized Credentials Reference Note */}
          <div className="mt-6 pt-5 border-t border-[#E5E0D8]">
            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8] text-xs font-sans">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-[#71615D] flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#2A3A2C]" />
                  Authorized Auditor Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillAuthorized}
                  className="text-[11px] text-[#2A3A2C] font-semibold underline underline-offset-2 hover:text-[#1E2B20] cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>

              <div className="font-mono text-[11px] text-[#2D211E] space-y-0.5">
                <div>ID: <strong className="text-[#1C1C18]">AUD-2026-IND-082</strong></div>
                <div>Passphrase: <strong className="text-[#1C1C18]">Sovereign@2026</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 p-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-center text-xs font-sans text-[#71615D] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3D593D]" />
          <span>Strict Access Control · 1 Authorized Examiner Allowed</span>
        </div>
      </div>

      <footer className="text-center text-xs font-sans text-[#71615D] py-4 border-t border-[#E5E0D8]">
        Editorial Sovereign © 2026 · Bureau of Synthetic Identity & Deepfake Forensic Auditing
      </footer>
    </div>
  );
};
