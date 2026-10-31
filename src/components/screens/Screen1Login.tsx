import React, { useState } from 'react';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck2,
  Database,
  Fingerprint,
  Briefcase
} from 'lucide-react';
import { UserRole } from '../../types/forensic';
import { loginWithGoogle, loginWithAuthorizedExaminerPasskey } from '../../services/firebase';

interface Screen1LoginProps {
  onSuccessLogin: (role: UserRole, identityDetails?: { name: string; email?: string; id?: string }) => void;
  isDbConnected?: boolean;
}

export const Screen1Login: React.FC<Screen1LoginProps> = ({ onSuccessLogin, isDbConnected = true }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('auditor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Candidate Form State
  const [candidateId, setCandidateId] = useState('VH-CAND-1024');
  const [candidateOtp, setCandidateOtp] = useState('482910');

  // 2. Recruiter Form State
  const [recruiterEmail, setRecruiterEmail] = useState('recruiter@verihire.demo');
  const [recruiterPassword, setRecruiterPassword] = useState('recruiter123');

  // 3. Auditor Form State
  const [auditorId, setAuditorId] = useState('AUD-2026-IND-082');
  const [auditorPassword, setAuditorPassword] = useState('Sovereign@2026');
  const [auditorMfa, setAuditorMfa] = useState('882104');

  // Candidate Login Handler
  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithAuthorizedExaminerPasskey(candidateId);
      onSuccessLogin('candidate', {
        name: 'Aarav Sharma (Candidate)',
        id: candidateId,
        email: 'candidate@verihire.demo',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate Candidate link.');
    } finally {
      setIsLoading(false);
    }
  };

  // Recruiter Login Handler
  const handleRecruiterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithAuthorizedExaminerPasskey('REC-2026-IND-012');
      onSuccessLogin('recruiter', {
        name: 'Enterprise Talent Recruiter',
        email: recruiterEmail,
        id: 'REC-2026-IND-012',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Recruiter authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auditor Login Handler
  const handleAuditorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithAuthorizedExaminerPasskey(auditorId);
      onSuccessLogin('auditor', {
        name: 'Lead Forensic Examiner',
        email: 'auditor@verihire.demo',
        id: auditorId,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Auditor authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth for Candidate, Recruiter, or Auditor
  const handleGoogleOAuth = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithGoogle();
      onSuccessLogin(role, {
        name: user.displayName || (role === 'candidate' ? 'Candidate Applicant' : 'Authorized User'),
        email: user.email || undefined,
        id: role === 'candidate' ? `VH-CAND-${Math.floor(Math.random() * 8999 + 1000)}` : role === 'auditor' ? 'AUD-2026-LEAD' : 'REC-2026-LEAD',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google OAuth failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A2C] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#E5E0D8]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2A3A2C] text-white font-serif font-bold text-base flex items-center justify-center">
            V
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-[#2A3A2C] block leading-none">
              VeriHire
            </span>
            <span className="font-sans text-[10px] text-[#2A3A2C]/60 block mt-0.5">
              Enterprise Forensic Trust Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#2A3A2C]/70">
          <span className="w-2 h-2 rounded-full bg-[#3D593D] animate-pulse" />
          <span>Firestore Enterprise & Auth Ready</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Title & Tagline */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2A3A2C]/60 block">
            Role-Based Enterprise Authentication Gateway
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A3A2C] tracking-tight">
            Select Your Bureau Portal
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#2A3A2C]/70 leading-relaxed">
            VeriHire partitions access into three strictly governed workspaces: candidate verification sessions, recruiter pipeline tracking, and forensic auditor telemetry.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-md mx-auto p-3 rounded-lg bg-[#B46244]/10 border border-[#B46244] text-[#B46244] text-xs font-sans flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* The 3 Large Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ROLE CARD 1: CANDIDATE */}
          <div
            className={`bg-[#FFFFFF] border-2 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
              activeTab === 'candidate'
                ? 'border-[#2A3A2C] ring-2 ring-[#2A3A2C]/10'
                : 'border-[#E5E0D8] hover:border-[#2A3A2C]/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] mb-4">
                <Fingerprint className="w-6 h-6 text-[#3D593D]" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#3D593D] tracking-wider block mb-1">
                Role 1: Job Applicant
              </span>
              <h2 className="font-serif text-xl font-bold text-[#2A3A2C]">
                Candidate Portal
              </h2>
              <p className="text-xs text-[#2A3A2C]/70 mt-1.5 leading-relaxed">
                Access your secure verification link or enter your one-time candidate passcode to complete biometric liveness & DigiLocker e-KYC.
              </p>

              {/* Scope Checklist */}
              <ul className="my-4 pt-3 border-t border-[#E5E0D8] space-y-1.5 text-[11px] font-sans text-[#2A3A2C]/70">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Biometric Consent Notice (DPDP Act)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>DigiLocker Sandbox Document Match</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>25s Guided Webcam Interview</span>
                </li>
              </ul>
            </div>

            {/* Candidate Login Action */}
            <form onSubmit={handleCandidateLogin} className="space-y-3 pt-3 border-t border-[#E5E0D8]">
              <div>
                <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                  Candidate Case ID
                </label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  placeholder="VH-CAND-1024"
                  className="w-full h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                  Verification OTP Code
                </label>
                <input
                  type="text"
                  value={candidateOtp}
                  onChange={(e) => setCandidateOtp(e.target.value)}
                  placeholder="482910"
                  className="w-full h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Enter Candidate Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCandidateId('VH-CAND-1024');
                  setCandidateOtp('482910');
                  setActiveTab('candidate');
                }}
                className="w-full text-center text-[10px] font-mono text-[#2A3A2C]/60 hover:text-[#2A3A2C] underline underline-offset-2 cursor-pointer"
              >
                Autofill Candidate Demo
              </button>

              {/* Google OAuth for Candidate */}
              <div className="relative my-2.5 text-center">
                <span className="bg-[#FFFFFF] px-2 text-[10px] font-mono text-[#2A3A2C]/60 uppercase">
                  or Candidate Google SSO
                </span>
                <div className="absolute inset-0 flex items-center -z-10">
                  <div className="w-full border-t border-[#E5E0D8]" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleGoogleOAuth('candidate')}
                disabled={isLoading}
                className="w-full h-10 border border-[#E5E0D8] bg-[#FFFFFF] hover:bg-[#F9F6F0] text-[#2A3A2C] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google as Candidate</span>
              </button>
            </form>
          </div>

          {/* ROLE CARD 2: RECRUITER / EMPLOYER */}
          <div
            className={`bg-[#FFFFFF] border-2 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
              activeTab === 'recruiter'
                ? 'border-[#2A3A2C] ring-2 ring-[#2A3A2C]/10'
                : 'border-[#E5E0D8] hover:border-[#2A3A2C]/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] mb-4">
                <Briefcase className="w-6 h-6 text-[#2A3A2C]" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#2A3A2C]/80 tracking-wider block mb-1">
                Role 2: Talent Acquisition
              </span>
              <h2 className="font-serif text-xl font-bold text-[#2A3A2C]">
                Recruiter Console
              </h2>
              <p className="text-xs text-[#2A3A2C]/70 mt-1.5 leading-relaxed">
                Dispatch verification requests to prospective hires, monitor applicant status, and retrieve notarized broadsheet certificates.
              </p>

              {/* Scope Checklist */}
              <ul className="my-4 pt-3 border-t border-[#E5E0D8] space-y-1.5 text-[11px] font-sans text-[#2A3A2C]/70">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Create Pre-Offer Requests</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Pipeline Candidate Status Tracker</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Download Signed Certificates</span>
                </li>
              </ul>
            </div>

            {/* Recruiter Login Action */}
            <form onSubmit={handleRecruiterLogin} className="space-y-3 pt-3 border-t border-[#E5E0D8]">
              <div>
                <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                  Enterprise Work Email
                </label>
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="recruiter@verihire.demo"
                  className="w-full h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={recruiterPassword}
                  onChange={(e) => setRecruiterPassword(e.target.value)}
                  placeholder="recruiter123"
                  className="w-full h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building className="w-3.5 h-3.5" />}
                <span>Access Hiring Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecruiterEmail('recruiter@verihire.demo');
                  setRecruiterPassword('recruiter123');
                  setActiveTab('recruiter');
                }}
                className="w-full text-center text-[10px] font-mono text-[#2A3A2C]/60 hover:text-[#2A3A2C] underline underline-offset-2 cursor-pointer"
              >
                Autofill Recruiter Demo
              </button>
            </form>
          </div>

          {/* ROLE CARD 3: AUDITOR / EXAMINER */}
          <div
            className={`bg-[#FFFFFF] border-2 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
              activeTab === 'auditor'
                ? 'border-[#2A3A2C] ring-2 ring-[#2A3A2C]/10'
                : 'border-[#E5E0D8] hover:border-[#2A3A2C]/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] border border-[#E5E0D8] flex items-center justify-center text-[#2A3A2C] mb-4">
                <ShieldCheck className="w-6 h-6 text-[#2A3A2C]" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#B46244] tracking-wider block mb-1">
                Role 3: Lead Examiner (Restricted)
              </span>
              <h2 className="font-serif text-xl font-bold text-[#2A3A2C]">
                Forensic Auditor
              </h2>
              <p className="text-xs text-[#2A3A2C]/70 mt-1.5 leading-relaxed">
                Full-stack deepfake inspection suite: rPPG green-channel FFT, 468-point facial mesh, FaceNet distance, and manual override authority.
              </p>

              {/* Scope Checklist */}
              <ul className="my-4 pt-3 border-t border-[#E5E0D8] space-y-1.5 text-[11px] font-sans text-[#2A3A2C]/70">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>5-Pillar Explainable Risk Engine</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Manual Override with Written Justification</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D593D]" />
                  <span>Immutable Blockchain-Style Audit Ledger</span>
                </li>
              </ul>
            </div>

            {/* Auditor Login Action */}
            <form onSubmit={handleAuditorLogin} className="space-y-3 pt-3 border-t border-[#E5E0D8]">
              <div>
                <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                  Examiner ID / Badge
                </label>
                <input
                  type="text"
                  value={auditorId}
                  onChange={(e) => setAuditorId(e.target.value)}
                  placeholder="AUD-2026-IND-082"
                  className="w-full h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                    Passkey
                  </label>
                  <input
                    type="password"
                    value={auditorPassword}
                    onChange={(e) => setAuditorPassword(e.target.value)}
                    placeholder="Sovereign@2026"
                    className="w-full h-9 px-2 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase font-semibold text-[#2A3A2C]/70 mb-1">
                    MFA Code
                  </label>
                  <input
                    type="text"
                    value={auditorMfa}
                    onChange={(e) => setAuditorMfa(e.target.value)}
                    placeholder="882104"
                    className="w-full h-9 px-2 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-mono text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Access Forensic Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuditorId('AUD-2026-IND-082');
                  setAuditorPassword('Sovereign@2026');
                  setAuditorMfa('882104');
                  setActiveTab('auditor');
                }}
                className="w-full text-center text-[10px] font-mono text-[#2A3A2C]/60 hover:text-[#2A3A2C] underline underline-offset-2 cursor-pointer"
              >
                Autofill Auditor Demo
              </button>
            </form>
          </div>
        </div>

        {/* Google OAuth Alternative Section */}
        <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#2A3A2C]" />
            <span className="text-xs font-sans text-[#2A3A2C]/80">
              Federated Enterprise Single Sign-On (SSO):
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGoogleOAuth('recruiter')}
              className="h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#2A3A2C] rounded-lg text-xs font-medium text-[#2A3A2C] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Recruiter SSO</span>
            </button>

            <button
              onClick={() => handleGoogleOAuth('auditor')}
              className="h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#2A3A2C] rounded-lg text-xs font-medium text-[#2A3A2C] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Auditor SSO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs font-sans text-[#2A3A2C]/60 max-w-xl mx-auto pt-4">
        <span>
          VeriHire Sovereign Talent Defense · Indian IT Act 2000 & DPDP Act 2023 Biometric Specification
        </span>
      </footer>
    </div>
  );
};
