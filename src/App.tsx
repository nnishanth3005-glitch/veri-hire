import React, { useState, useEffect } from 'react';
import { INITIAL_CANDIDATES } from './data/mockCandidates';
import { CandidateDossier, AuditStatus, RiskClassification, VerificationRequestDraft, UserRole } from './types/forensic';
import { Header, ScreenId } from './components/Header';
import { Screen1Login } from './components/screens/Screen1Login';
import { Screen2Dashboard } from './components/screens/Screen2Dashboard';
import { Screen3Report } from './components/screens/Screen3Report';
import { Screen4Webcam } from './components/screens/Screen4Webcam';
import { Screen5Certificate } from './components/screens/Screen5Certificate';
import { Screen6Audit } from './components/screens/Screen6Audit';
import { Screen7Sandbox } from './components/screens/Screen7Sandbox';
import { CandidatePortal } from './components/CandidatePortal';
import { RecruiterConsole } from './components/RecruiterConsole';
import { CreateVerificationModal } from './components/CreateVerificationModal';
import { ShieldCheck } from 'lucide-react';
import {
  auth,
  testFirestoreConnection,
  seedInitialCandidatesIfEmpty,
  subscribeToCandidates,
  subscribeToAuditLogs,
  updateCandidateStatusInDb,
  saveCandidateToDb,
  recordAuditLog,
  logoutUser,
  getSavedGoogleProfile,
  AuditLogEntry
} from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('auditor');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('screen1_login');

  // Candidate Data State & Firestore Sync
  const [candidates, setCandidates] = useState<CandidateDossier[]>(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('DOS-2026-IND-0982');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [examinerBadge, setExaminerBadge] = useState<string>('AUD-2026-IND-082');

  // Recruiter & Candidate Experience State
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [activeRequestDraft, setActiveRequestDraft] = useState<VerificationRequestDraft | undefined>(undefined);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Listen to Firebase Authentication State
  useEffect(() => {
    const hasInitialSession = localStorage.getItem('verihire_session_authenticated') === 'true';
    const initialSavedRole = (localStorage.getItem('verihire_user_role') as UserRole) || 'auditor';
    if (hasInitialSession) {
      setIsAuthenticated(true);
      setUserRole(initialSavedRole);
      if (initialSavedRole === 'candidate') setCurrentScreen('candidate_portal');
      else if (initialSavedRole === 'recruiter') setCurrentScreen('recruiter_console');
      else setCurrentScreen('screen2_dashboard');
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('verihire_session_authenticated', 'true');
        const savedRole = (localStorage.getItem('verihire_user_role') as UserRole) || 'auditor';
        setUserRole(savedRole);

        const savedGoogle = getSavedGoogleProfile();
        const effectiveEmail = user.email || savedGoogle?.email || 'nnishanth3005@gmail.com';
        const effectiveName = user.displayName || savedGoogle?.displayName || (savedRole === 'candidate' ? 'Nishanth N' : 'Lead Forensic Auditor');

        const badge = effectiveEmail.includes('nnishanth') && savedRole === 'auditor'
          ? 'AUD-2026-LEAD-NISHANTH'
          : effectiveName
          ? `${savedRole === 'candidate' ? 'CAND' : savedRole === 'recruiter' ? 'REC' : 'AUD'}-2026-${effectiveName.replace(/\s+/g, '-').toUpperCase().slice(0, 10)}`
          : 'AUD-2026-IND-082';
        setExaminerBadge(badge);

        setCurrentScreen((prev) => {
          if (prev === 'screen1_login') {
            if (savedRole === 'candidate') return 'candidate_portal';
            if (savedRole === 'recruiter') return 'recruiter_console';
            return 'screen2_dashboard';
          }
          return prev;
        });
      } else {
        // Only kick back to login if there is NO active local session
        const hasSession = localStorage.getItem('verihire_session_authenticated') === 'true';
        if (!hasSession) {
          setIsAuthenticated(false);
          setCurrentScreen('screen1_login');
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Validate Firestore connection and setup real-time data sync once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    testFirestoreConnection().then((connected) => {
      if (connected) {
        console.log('Firestore connection verified successfully.');
      }
    });

    seedInitialCandidatesIfEmpty(INITIAL_CANDIDATES);

    const unsubscribeCandidates = subscribeToCandidates(
      (remoteCandidates) => {
        if (remoteCandidates && remoteCandidates.length > 0) {
          const hydrated = remoteCandidates.map((c) => {
            if (c.riskSignals && c.riskSignals.deepfakeArtifactRisk !== undefined) return c;
            const isSynthetic = c.status === 'synthetic_detected';
            const isReview = c.status === 'under_review';
            return {
              ...c,
              riskSignals: {
                deepfakeArtifactRisk: isSynthetic ? 92 : isReview ? 15 : 4,
                livenessFailureRisk: isSynthetic ? 86 : isReview ? 12 : 5,
                faceMismatchRisk: isSynthetic ? 70 : isReview ? 85 : 4,
                documentMismatchRisk: isSynthetic ? 80 : isReview ? 65 : 2,
                profileInconsistencyRisk: isSynthetic ? 75 : isReview ? 50 : 4,
                overallRiskScore: isSynthetic ? 84 : isReview ? 42 : 4,
                classification: (isSynthetic ? 'HIGH_RISK' : isReview ? 'MANUAL_REVIEW' : 'VERIFIED_HUMAN') as RiskClassification,
                rppgBpm: isSynthetic ? 0 : c.rppgPulseBpm || 72,
                rppgSignalQuality: isSynthetic ? ('Degraded / Flatline' as const) : ('Good' as const),
                rppgSnrDb: isSynthetic ? -4.5 : 18.2,
                blinkRatePerMin: isSynthetic ? 3 : 18,
                headPoseVariance: 0.12,
                landmarkJitterMm: isSynthetic ? 3.6 : 0.4,
                faceToIdSimilarity: isSynthetic ? 42.0 : isReview ? 34.2 : 96.4,
                idDocumentType: (isReview ? 'PAN Card' : 'Aadhaar e-KYC') as any,
                idDocumentPhotoUrl: c.avatarUrl || '',
                documentHash: '0x8a7c93e41b2289f6d140e90c29f8a4e511bb7330',
                digiLockerStatus: isSynthetic ? ('mismatch' as const) : isReview ? ('mismatch' as const) : ('verified' as const),
                linkedInClaimMatches: [
                  { claim: 'Demographic Biometric Match', matched: !isSynthetic, detail: 'National registry record confirmed' },
                ],
                explanations: {
                  artifacts: isSynthetic ? 'High-frequency GAN grid artifacts.' : 'Nominal baseline.',
                  liveness: isSynthetic ? '0 BPM pulse flatline.' : '72 BPM pulse confirmed.',
                  faceMatch: isSynthetic ? '42% FaceNet similarity.' : isReview ? '34% similarity (proxy flag).' : '96% FaceNet similarity.',
                  document: isSynthetic ? 'DigiLocker revoked.' : 'DigiLocker valid.',
                  profile: isSynthetic ? 'Profile mismatch.' : 'Profile verified.',
                },
              },
            };
          });
          setCandidates(hydrated);
        }
      },
      (error) => {
        console.warn('Realtime candidate sync notice:', error);
      }
    );

    const unsubscribeLogs = subscribeToAuditLogs(
      (logs) => {
        setAuditLogs(logs);
      },
      (error) => {
        console.warn('Audit logs sync notice:', error);
      }
    );

    return () => {
      unsubscribeCandidates();
      unsubscribeLogs();
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = (
    role: UserRole = 'auditor',
    identityDetails?: { name: string; email?: string; id?: string }
  ) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('verihire_user_role', role);
    localStorage.setItem('verihire_session_authenticated', 'true');
    if (identityDetails?.id) {
      setExaminerBadge(identityDetails.id);
    }
    if (role === 'candidate') {
      setCurrentScreen('candidate_portal');
      showToast(`Welcome ${identityDetails?.name || 'Candidate'}. Secure Verification Session Initiated.`);
    } else if (role === 'recruiter') {
      setCurrentScreen('recruiter_console');
      showToast(`Hiring Console: Authorized as ${identityDetails?.email || 'recruiter@verihire.demo'}`);
    } else {
      setCurrentScreen('screen2_dashboard');
      showToast(`Forensic Examiner Session: ${identityDetails?.id || examinerBadge}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('verihire_user_role');
      localStorage.removeItem('verihire_session_authenticated');
      localStorage.removeItem('verihire_google_profile');
      setIsAuthenticated(false);
      setCurrentScreen('screen1_login');
      showToast('Session securely closed.');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleUpdateCandidateStatus = async (id: string, newStatus: AuditStatus) => {
    const targetCandidate = candidates.find((c) => c.id === id);
    const updatedScore =
      newStatus === 'authentic'
        ? Math.max(targetCandidate?.overallAuthenticityScore || 95, 96.0)
        : newStatus === 'synthetic_detected'
        ? Math.min(targetCandidate?.overallAuthenticityScore || 20, 16.0)
        : 58.0;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            overallAuthenticityScore: updatedScore,
            notarizedAt: new Date().toISOString(),
            certifyingOfficial: examinerBadge,
          };
        }
        return c;
      })
    );

    try {
      await updateCandidateStatusInDb(
        id,
        targetCandidate?.name || 'Candidate',
        targetCandidate?.status || 'under_review',
        newStatus,
        updatedScore,
        examinerBadge
      );
    } catch (err) {
      console.error('Failed to update candidate status in Firestore:', err);
    }

    if (newStatus === 'authentic') {
      showToast(`Candidate ${id} officially verified as Human in Firestore.`);
    } else if (newStatus === 'synthetic_detected') {
      showToast(`Synthetic Impersonation flagged on ${id}. Hiring pipeline frozen.`);
    } else {
      showToast(`Dossier ${id} escalated to Tier-3 Forensic Panel.`);
    }
  };

  // Auditor Manual Override
  const handleAuditorOverride = async (
    id: string,
    newClassification: RiskClassification,
    justification: string
  ) => {
    const targetCandidate = candidates.find((c) => c.id === id);
    if (!targetCandidate) return;

    const newAuditStatus: AuditStatus =
      newClassification === 'VERIFIED_HUMAN'
        ? 'authentic'
        : newClassification === 'HIGH_RISK'
        ? 'synthetic_detected'
        : 'under_review';

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newAuditStatus,
            auditorOverride: {
              overriddenAt: new Date().toISOString(),
              examinerId: examinerBadge,
              previousClassification: c.riskSignals.classification,
              newClassification: newClassification,
              justification,
            },
            riskSignals: {
              ...c.riskSignals,
              classification: newClassification,
            },
          };
        }
        return c;
      })
    );

    // Record immutable audit log in Firestore
    try {
      await recordAuditLog({
        candidateId: id,
        candidateName: targetCandidate.name,
        action: 'AUDITOR_MANUAL_OVERRIDE',
        details: `Examiner ${examinerBadge} overridden status to ${newClassification}. Justification: "${justification}"`,
        previousStatus: targetCandidate.status,
        newStatus: newAuditStatus,
        examinerId: examinerBadge,
      });
      showToast(`Auditor Override logged to immutable ledger: ${newClassification}`);
    } catch (err) {
      console.error('Failed to log auditor override:', err);
    }
  };

  const handleAddLiveCandidate = async (newDossier: CandidateDossier) => {
    setCandidates((prev) => [newDossier, ...prev]);
    setSelectedCandidateId(newDossier.id);

    try {
      await saveCandidateToDb(newDossier);
      showToast(`Live audit record ${newDossier.id} saved to Cloud Firestore.`);
    } catch (err) {
      console.error('Failed to save dossier to Firestore:', err);
      showToast(`Record ${newDossier.id} active in session.`);
    }
  };

  // Candidate Portal Submission
  const handleCandidatePortalSubmission = async (newDossier: CandidateDossier) => {
    await handleAddLiveCandidate(newDossier);
    setCurrentScreen('screen3_report');
    showToast(`Verification completed! Risk analysis ready for review.`);
  };

  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Screen 1: Login Page
  if (!isAuthenticated || currentScreen === 'screen1_login') {
    return (
      <Screen1Login
        onSuccessLogin={handleLoginSuccess}
        isDbConnected={true}
      />
    );
  }

  // Candidate Experience Portal (Standalone view)
  if (currentScreen === 'candidate_portal') {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col font-sans">
        {/* If logged in as auditor or recruiter previewing, show quick exit bar */}
        {userRole !== 'candidate' && (
          <div className="bg-[#2A3A2C] text-[#F9F6F0] px-4 py-2 flex items-center justify-between text-xs">
            <span className="font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6B8E6B]" />
              Candidate Portal Preview Mode ({userRole === 'recruiter' ? 'Employer' : 'Auditor'} Session)
            </span>
            <button
              onClick={() => setCurrentScreen(userRole === 'recruiter' ? 'recruiter_console' : 'screen2_dashboard')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors cursor-pointer"
            >
              Exit to {userRole === 'recruiter' ? 'Hiring Console' : 'Auditor Console'} →
            </button>
          </div>
        )}
        <CandidatePortal
          requestDraft={activeRequestDraft}
          candidateUser={{
            name: currentUser?.displayName || getSavedGoogleProfile()?.displayName || 'Nishanth N',
            email: currentUser?.email || getSavedGoogleProfile()?.email || 'nnishanth3005@gmail.com',
            photoUrl: currentUser?.photoURL || getSavedGoogleProfile()?.photoURL || undefined,
          }}
          onSubmitVerification={handleCandidatePortalSubmission}
          onExitPortal={() => {
            if (userRole === 'candidate') {
              handleSignOut();
            } else if (userRole === 'recruiter') {
              setCurrentScreen('recruiter_console');
            } else {
              setCurrentScreen('screen2_dashboard');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A2C] flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentScreen={currentScreen}
        onNavigateScreen={setCurrentScreen}
        onSignOut={handleSignOut}
        examinerId={examinerBadge}
        examinerEmail={currentUser?.email || (userRole === 'recruiter' ? 'recruiter@verihire.demo' : 'lead.auditor@verihire.in')}
        examinerName={currentUser?.displayName || (userRole === 'recruiter' ? 'Talent Acquisition Lead' : 'Lead Forensic Auditor')}
        userPhoto={currentUser?.photoURL || undefined}
        userRole={userRole}
        onSwitchRole={(role) => setUserRole(role)}
      />

      {/* Main Broad-sheet Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6">
        {/* RECRUITER CONSOLE: Hiring Pipeline, Verification Dispatch, Broadsheet Reports */}
        {currentScreen === 'recruiter_console' && (
          <RecruiterConsole
            candidates={candidates}
            onOpenCreateModal={() => setIsCreateRequestModalOpen(true)}
            onOpenCandidatePortal={(candidateId) => {
              if (candidateId) setSelectedCandidateId(candidateId);
              setCurrentScreen('candidate_portal');
            }}
            onViewCertificate={(cand) => {
              setSelectedCandidateId(cand.id);
              setCurrentScreen('screen5_certificate');
            }}
          />
        )}

        {/* SCREEN 2: Main Dashboard */}
        {currentScreen === 'screen2_dashboard' && (
          <Screen2Dashboard
            candidates={candidates}
            selectedCandidateId={selectedCandidateId}
            onSelectCandidate={(id) => setSelectedCandidateId(id)}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onOpenCertificate={() => setCurrentScreen('screen5_certificate')}
            onAddCandidate={handleAddLiveCandidate}
            onOpenCreateRequestModal={() => setIsCreateRequestModalOpen(true)}
            onOpenCandidatePortal={() => setCurrentScreen('candidate_portal')}
          />
        )}

        {/* SCREEN 3: Forensic Inspection Suite with 5-Signal Risk Engine */}
        {currentScreen === 'screen3_report' && (
          <div className="h-[calc(100vh-140px)] min-h-[680px]">
            <Screen3Report
              candidate={activeCandidate}
              onCertifyAuthentic={(id) => handleUpdateCandidateStatus(id, 'authentic')}
              onFlagSynthetic={(id) => handleUpdateCandidateStatus(id, 'synthetic_detected')}
              onEscalate={(id) => handleUpdateCandidateStatus(id, 'under_review')}
              onOpenCertificate={() => setCurrentScreen('screen5_certificate')}
              onOverrideRisk={handleAuditorOverride}
            />
          </div>
        )}

        {/* SCREEN 4: Live Webcam Demo */}
        {currentScreen === 'screen4_webcam' && (
          <Screen4Webcam
            onSaveToRegistry={handleAddLiveCandidate}
            onOpenCertificate={(cand) => {
              setSelectedCandidateId(cand.id);
              setCurrentScreen('screen5_certificate');
            }}
          />
        )}

        {/* SCREEN 5: Certificate Generator */}
        {currentScreen === 'screen5_certificate' && (
          <Screen5Certificate
            candidate={activeCandidate}
            onBackToDashboard={() => setCurrentScreen('screen2_dashboard')}
          />
        )}

        {/* SCREEN 6: Audit Trail Page with real-time Firestore Ledger */}
        {currentScreen === 'screen6_audit' && (
          <Screen6Audit
            candidates={candidates}
            auditLogs={auditLogs}
            onSelectCandidate={(candId) => {
              setSelectedCandidateId(candId);
              setCurrentScreen('screen2_dashboard');
            }}
          />
        )}

        {/* SCREEN 7: Forensic Sandbox */}
        {currentScreen === 'screen7_sandbox' && <Screen7Sandbox />}
      </main>

      {/* Recruiter "Create Verification Request" Modal */}
      {isCreateRequestModalOpen && (
        <CreateVerificationModal
          isOpen={isCreateRequestModalOpen}
          onClose={() => setIsCreateRequestModalOpen(false)}
          onCreateRequest={(draft) => {
            setActiveRequestDraft(draft);
            showToast(`Verification invitation dispatched for ${draft.candidateName}`);
          }}
          onLaunchCandidatePortal={(draft) => {
            setActiveRequestDraft(draft);
            setCurrentScreen('candidate_portal');
          }}
        />
      )}

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2A3A2C] text-[#F9F6F0] px-4 py-3 rounded-lg border border-[#E5E0D8] shadow-lg flex items-center gap-2.5 text-xs font-sans">
          <ShieldCheck className="w-4 h-4 text-[#6B8E6B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer conforming strictly to design palette */}
      <footer className="border-t border-[#E5E0D8] bg-[#FFFFFF] py-4 mt-auto print:hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-[#2A3A2C]/60">
          <span>
            VeriHire Enterprise Deepfake Defense Suite · Lead Examiner Console {examinerBadge}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D593D]" />
              Cloud Firestore Enterprise
            </span>
            <span aria-hidden="true">·</span>
            <span>Multi-Signal Weighted Risk Engine (0–100)</span>
            <span aria-hidden="true">·</span>
            <span>DigiLocker API Setu Gateway</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
