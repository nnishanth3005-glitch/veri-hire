import React, { useState } from 'react';
import {
  LayoutDashboard,
  Video,
  FileCheck,
  Database,
  FlaskConical,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  X,
  Server,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserRole } from '../types/forensic';
import firebaseConfig from '../../firebase-applet-config.json';

export type ScreenId =
  | 'screen1_login'
  | 'screen2_dashboard'
  | 'screen3_report'
  | 'screen4_webcam'
  | 'screen5_certificate'
  | 'screen6_audit'
  | 'screen7_sandbox'
  | 'candidate_portal'
  | 'recruiter_console';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigateScreen: (screen: ScreenId) => void;
  onSignOut: () => void;
  examinerId?: string;
  examinerEmail?: string;
  examinerName?: string;
  userPhoto?: string;
  userRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateScreen,
  onSignOut,
  examinerId = 'AUD-2026-IND-082',
  examinerEmail,
  examinerName,
  userPhoto,
  userRole = 'auditor',
  onSwitchRole,
}) => {
  const [showDbModal, setShowDbModal] = useState(false);

  const consoleUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`;

  return (
    <>
      <header className="bg-[#FFFFFF] border-b border-[#E5E0D8] sticky top-0 z-30 shadow-xs print:hidden w-full overflow-x-hidden">
        {/* Top Main Navigation Bar */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Left: Logo & Role ID Badge */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                if (userRole === 'candidate') onNavigateScreen('candidate_portal');
                else if (userRole === 'recruiter') onNavigateScreen('recruiter_console');
                else onNavigateScreen('screen2_dashboard');
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2A3A2C] text-white font-serif font-bold text-sm flex items-center justify-center group-hover:bg-[#1E2B20] transition-colors">
                V
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#2A3A2C] block leading-none">
                  VeriHire
                </span>
                <span className="font-sans text-[10px] text-[#2A3A2C]/60 block mt-0.5">
                  {userRole === 'candidate'
                    ? 'Candidate Portal'
                    : userRole === 'recruiter'
                    ? 'Employer Console'
                    : 'Forensic Audit Suite'}
                </span>
              </div>
            </button>

            {/* Examiner ID Badge with Interactive Firestore Sync Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F9F6F0] border border-[#E5E0D8] rounded-lg">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Examiner"
                  className="w-5 h-5 rounded-full object-cover border border-[#E5E0D8]"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#3D593D] animate-pulse" />
              )}
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-semibold text-[#2A3A2C] leading-tight">
                  {examinerId}
                </span>
                {examinerEmail && (
                  <span className="font-sans text-[10px] text-[#2A3A2C]/60 truncate max-w-[140px] leading-tight">
                    {examinerEmail}
                  </span>
                )}
              </div>

              {/* Clickable LIVE DB badge to open database details */}
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                title="View Cloud Firestore Database Configuration & Collections"
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#3D593D]/10 hover:bg-[#3D593D]/20 text-[#3D593D] font-bold border border-[#3D593D]/30 ml-1 cursor-pointer transition-colors flex items-center gap-1"
              >
                <Database className="w-2.5 h-2.5" />
                <span>LIVE DB</span>
              </button>
            </div>
          </div>

          {/* Center: Persistent Role-Aware Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F9F6F0] p-1 rounded-lg border border-[#E5E0D8]">
            {userRole === 'candidate' ? (
              /* Candidate View: Insulated navigation */
              <button
                onClick={() => onNavigateScreen('candidate_portal')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentScreen === 'candidate_portal'
                    ? 'bg-[#3D593D] text-white font-bold shadow-xs'
                    : 'text-[#3D593D] hover:bg-[#3D593D]/10 font-semibold'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Candidate Verification Portal</span>
              </button>
            ) : userRole === 'recruiter' ? (
              /* Recruiter View: Pipeline, Request Dispatch & Certificates */
              <>
                <button
                  onClick={() => onNavigateScreen('recruiter_console')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'recruiter_console'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Hiring Pipeline</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('screen5_certificate')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen5_certificate'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Certificates</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('candidate_portal')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'candidate_portal'
                      ? 'bg-[#3D593D] text-white font-bold shadow-xs'
                      : 'text-[#3D593D] hover:bg-[#3D593D]/10 font-semibold'
                  }`}
                  title="Preview Candidate Consent & 25s Webcam Experience"
                >
                  <span>Candidate Portal (Preview)</span>
                </button>
              </>
            ) : (
              /* Lead Forensic Auditor View: Complete Forensic Suite */
              <>
                <button
                  onClick={() => onNavigateScreen('screen2_dashboard')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen2_dashboard' || currentScreen === 'screen3_report'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Auditor Queue</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('recruiter_console')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'recruiter_console'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Recruiter Pipeline</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('screen4_webcam')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen4_webcam'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Webcam</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('screen6_audit')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen6_audit'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Audit Trail</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('screen7_sandbox')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen7_sandbox'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Sandbox</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('screen5_certificate')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'screen5_certificate'
                      ? 'bg-[#FFFFFF] text-[#2A3A2C] font-bold shadow-xs'
                      : 'text-[#2A3A2C]/70 hover:text-[#2A3A2C]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </button>
                <button
                  onClick={() => onNavigateScreen('candidate_portal')}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentScreen === 'candidate_portal'
                      ? 'bg-[#3D593D] text-white font-bold shadow-xs'
                      : 'text-[#3D593D] hover:bg-[#3D593D]/10 font-semibold'
                  }`}
                  title="Experience Candidate Portal"
                >
                  <span>Candidate Portal</span>
                </button>
              </>
            )}
          </nav>

          {/* Right: Role Switcher for Hackathon Judges + Screen Selector + Sign Out */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Role Switcher Pill for judges */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-[#F9F6F0] border border-[#E5E0D8] rounded-lg shrink-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#2A3A2C]/60 font-semibold">
                Role:
              </span>
              <select
                value={userRole}
                onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  if (onSwitchRole) onSwitchRole(newRole);
                  if (newRole === 'candidate') onNavigateScreen('candidate_portal');
                  else if (newRole === 'recruiter') onNavigateScreen('recruiter_console');
                  else onNavigateScreen('screen2_dashboard');
                }}
                className="text-xs font-semibold font-sans bg-transparent text-[#2A3A2C] cursor-pointer focus:outline-none"
                title="Switch active user role perspective"
              >
                <option value="auditor">Auditor / Examiner</option>
                <option value="recruiter">Recruiter / Employer</option>
                <option value="candidate">Candidate Portal</option>
              </select>
            </div>

            {/* Quick Screen Picker */}
            <div className="relative inline-block shrink-0">
              <select
                value={currentScreen}
                onChange={(e) => onNavigateScreen(e.target.value as ScreenId)}
                className="h-9 px-2.5 pr-8 bg-[#F9F6F0] border border-[#E5E0D8] rounded-lg text-xs font-sans font-semibold text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C] cursor-pointer appearance-none"
                title="Direct screen access"
              >
                <option value="screen1_login">Gateway: Role Login</option>
                <option value="candidate_portal">Candidate Portal (Consent & 25s Recording)</option>
                <option value="recruiter_console">Recruiter Console (Pipeline & Requests)</option>
                <option value="screen2_dashboard">Auditor: Dashboard (Queue)</option>
                <option value="screen3_report">Auditor: Forensic Suite (5-Signal Engine)</option>
                <option value="screen4_webcam">Auditor: Live Webcam Demo</option>
                <option value="screen5_certificate">Audit Certificate (Signed Broadsheet)</option>
                <option value="screen6_audit">Auditor: Immutable Audit Trail</option>
                <option value="screen7_sandbox">Auditor: Forensic Sandbox</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2A3A2C]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sign Out Button - Always Visible Without Scrolling */}
            <button
              onClick={onSignOut}
              title="Sign Out to Login Screen"
              className="shrink-0 h-9 px-3 rounded-lg border border-[#B46244]/40 bg-[#B46244]/10 text-[#B46244] hover:bg-[#B46244] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors text-xs font-sans font-bold shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Tabs */}
        <div className="md:hidden border-t border-[#E5E0D8] px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto bg-[#FFFFFF]">
          <button
            onClick={() => onNavigateScreen('screen2_dashboard')}
            className={`px-2.5 py-1 text-xs font-sans rounded whitespace-nowrap ${
              currentScreen === 'screen2_dashboard' || currentScreen === 'screen3_report'
                ? 'bg-[#2A3A2C] text-white font-semibold'
                : 'text-[#2A3A2C]/70'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigateScreen('screen4_webcam')}
            className={`px-2.5 py-1 text-xs font-sans rounded whitespace-nowrap ${
              currentScreen === 'screen4_webcam'
                ? 'bg-[#2A3A2C] text-white font-semibold'
                : 'text-[#2A3A2C]/70'
            }`}
          >
            Live Webcam
          </button>
          <button
            onClick={() => onNavigateScreen('screen6_audit')}
            className={`px-2.5 py-1 text-xs font-sans rounded whitespace-nowrap ${
              currentScreen === 'screen6_audit'
                ? 'bg-[#2A3A2C] text-white font-semibold'
                : 'text-[#2A3A2C]/70'
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => onNavigateScreen('screen7_sandbox')}
            className={`px-2.5 py-1 text-xs font-sans rounded whitespace-nowrap ${
              currentScreen === 'screen7_sandbox'
                ? 'bg-[#2A3A2C] text-white font-semibold'
                : 'text-[#2A3A2C]/70'
            }`}
          >
            Sandbox
          </button>
          <button
            onClick={() => onNavigateScreen('screen5_certificate')}
            className={`px-2.5 py-1 text-xs font-sans rounded whitespace-nowrap ${
              currentScreen === 'screen5_certificate'
                ? 'bg-[#2A3A2C] text-white font-semibold'
                : 'text-[#2A3A2C]/70'
            }`}
          >
            Certificate
          </button>
        </div>
      </header>

      {/* Database Details Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 bg-[#2A3A2C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl max-w-xl w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3D593D]/10 border border-[#3D593D]/20 flex items-center justify-center text-[#3D593D]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A3A2C]">
                    Cloud Firestore Database Details
                  </h3>
                  <p className="text-xs font-sans text-[#2A3A2C]/60">
                    Live enterprise database provisioned with Zero-Trust ABAC rules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F9F6F0] flex items-center justify-center text-[#2A3A2C]/60 hover:text-[#2A3A2C] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="py-4 space-y-4 text-xs font-sans">
              {/* Project & Database ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8]">
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
                    GCP / Firebase Project ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[#2A3A2C] select-all break-all">
                    {firebaseConfig.projectId}
                  </span>
                </div>

                <div className="p-3 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8]">
                  <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
                    Firestore Database ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[#2A3A2C] select-all break-all">
                    {firebaseConfig.firestoreDatabaseId}
                  </span>
                </div>
              </div>

              {/* Collections In Use */}
              <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#E5E0D8] space-y-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A3A2C]/60 font-semibold block">
                  Active Firestore Collections
                </span>

                <div className="space-y-2">
                  <div className="flex items-start justify-between text-xs pb-2 border-b border-[#E5E0D8]/60">
                    <div>
                      <span className="font-mono font-bold text-[#2A3A2C] block">/candidates</span>
                      <span className="text-[#2A3A2C]/70 text-[11px]">
                        Full forensic candidate dossiers, scores, frames, and biometric telemetry.
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3D593D]/10 text-[#3D593D] font-semibold shrink-0">
                      Real-time Synced
                    </span>
                  </div>

                  <div className="flex items-start justify-between text-xs pb-2 border-b border-[#E5E0D8]/60">
                    <div>
                      <span className="font-mono font-bold text-[#2A3A2C] block">/audit_logs</span>
                      <span className="text-[#2A3A2C]/70 text-[11px]">
                        Immutable cryptographic verification ledger records and certifications.
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3D593D]/10 text-[#3D593D] font-semibold shrink-0">
                      Append Only
                    </span>
                  </div>

                  <div className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#2A3A2C] block">/examiners</span>
                      <span className="text-[#2A3A2C]/70 text-[11px]">
                        Accredited auditor profiles, authentication records, and clearance levels.
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2A3A2C]/10 text-[#2A3A2C] font-semibold shrink-0">
                      RBAC Protected
                    </span>
                  </div>
                </div>
              </div>

              {/* Codebase reference files */}
              <div className="p-3 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block mb-1">
                  Local Configuration & Rule Files
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#2A3A2C]">
                  <div className="p-1.5 bg-[#FFFFFF] rounded border border-[#E5E0D8]">
                    📄 firebase-blueprint.json
                  </div>
                  <div className="p-1.5 bg-[#FFFFFF] rounded border border-[#E5E0D8]">
                    🛡️ firestore.rules
                  </div>
                  <div className="p-1.5 bg-[#FFFFFF] rounded border border-[#E5E0D8]">
                    ⚙️ firebase-applet-config.json
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Direct Console Link */}
            <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#3D593D] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Connected & Healthy · Rules Deployed</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-9 px-4 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Open Firebase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
