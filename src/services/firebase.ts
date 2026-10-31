import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CandidateDossier, AuditStatus } from '../types/forensic';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Required error handling interface per system skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL CONSTRAINT: Test connection to Firestore on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: client is offline.');
      return false;
    }
    // Document might not exist in /test/connection, which still validates connection reachability
    return true;
  }
}

// Authentication Actions
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncExaminerProfile(result.user);
    return result.user;
  } catch (err) {
    console.error('Google Sign-in failed:', err);
    throw err;
  }
}

// Demo/Authorized Examiner Passkey Login (authenticates session via Firebase)
export async function loginWithAuthorizedExaminerPasskey(examinerBadge: string = 'AUD-2026-IND-082'): Promise<User> {
  try {
    const cred = await signInAnonymously(auth);
    await syncExaminerProfile(cred.user, examinerBadge, `${examinerBadge}@bureau.verihire.in`);
    return cred.user;
  } catch (err) {
    console.error('Passkey examiner login failed:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Sync Examiner user profile to Firestore
export async function syncExaminerProfile(user: User, fallbackBadge?: string, fallbackEmail?: string) {
  const examinerRef = doc(db, 'examiners', user.uid);
  const data = {
    uid: user.uid,
    email: user.email || fallbackEmail || 'lead.auditor@verihire.in',
    displayName: user.displayName || fallbackBadge || 'Lead Forensic Auditor',
    badgeNumber: fallbackBadge || 'AUD-2026-IND-082',
    role: 'Lead Forensic Examiner (SEBI/UIDAI Accredited)',
    photoURL: user.photoURL || '',
    lastActive: new Date().toISOString(),
  };

  try {
    await setDoc(examinerRef, data, { merge: true });
  } catch (err) {
    // Non-fatal if restricted by initial rules
    console.warn('Could not write examiner profile:', err);
  }
}

// Candidate Operations & Real-Time Sync
export function subscribeToCandidates(
  onData: (candidates: CandidateDossier[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const colRef = collection(db, 'candidates');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const dossiers: CandidateDossier[] = [];
      snapshot.forEach((d) => {
        dossiers.push(d.data() as CandidateDossier);
      });
      onData(dossiers);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'candidates');
      if (onError) onError(error);
    }
  );
}

// Automatic database seeding for first boot
export async function seedInitialCandidatesIfEmpty(initialList: CandidateDossier[]): Promise<boolean> {
  const colRef = collection(db, 'candidates');
  try {
    const existing = await getDocs(colRef);
    if (existing.empty) {
      console.log('Seeding initial candidate dossiers to Firestore...');
      for (const candidate of initialList) {
        const candidateRef = doc(db, 'candidates', candidate.id);
        await setDoc(candidateRef, {
          ...candidate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid || 'system_seed',
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Initial seeding query check:', error);
    return false;
  }
}

export async function saveCandidateToDb(candidate: CandidateDossier): Promise<void> {
  const path = `candidates/${candidate.id}`;
  try {
    const candidateRef = doc(db, 'candidates', candidate.id);
    await setDoc(
      candidateRef,
      {
        ...candidate,
        createdBy: auth.currentUser?.uid || 'AUD-2026-IND-082',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Record immutable audit entry
    await recordAuditLog({
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: 'DOSSIER_REGISTERED',
      details: `New biometric dossier ${candidate.id} (${candidate.role} at ${candidate.organization}) registered into forensic ledger.`,
      newStatus: candidate.status,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateCandidateStatusInDb(
  candidateId: string,
  candidateName: string,
  previousStatus: AuditStatus,
  newStatus: AuditStatus,
  newScore: number,
  examinerId: string = 'AUD-2026-IND-082'
): Promise<void> {
  const path = `candidates/${candidateId}`;
  try {
    const candidateRef = doc(db, 'candidates', candidateId);
    const notarizedAt = new Date().toISOString();

    await updateDoc(candidateRef, {
      status: newStatus,
      overallAuthenticityScore: newScore,
      notarizedAt: notarizedAt,
      certifyingOfficial: examinerId,
      updatedAt: serverTimestamp(),
    });

    const actionTitle =
      newStatus === 'authentic'
        ? 'CERTIFIED_AUTHENTIC'
        : newStatus === 'synthetic_detected'
        ? 'FLAGGED_SYNTHETIC'
        : 'ESCALATED_REVIEW';

    const actionDescription =
      newStatus === 'authentic'
        ? `Officially signed and certified authentic by Lead Examiner ${examinerId}. Tamper-evident certificate notarized.`
        : newStatus === 'synthetic_detected'
        ? `Synthetic deepfake impersonation confirmed by Lead Examiner ${examinerId}. Enterprise hiring workflow frozen.`
        : `Dossier escalated to Tier-3 Forensic Panel by Examiner ${examinerId}.`;

    await recordAuditLog({
      candidateId,
      candidateName,
      action: actionTitle,
      details: actionDescription,
      previousStatus,
      newStatus,
      examinerId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Immutable Audit Log Ledger
export interface AuditLogEntry {
  id?: string;
  candidateId?: string;
  candidateName?: string;
  action: string;
  details: string;
  examinerId: string;
  examinerEmail?: string;
  previousStatus?: string;
  newStatus?: string;
  timestamp?: string;
}

export async function recordAuditLog(log: {
  candidateId?: string;
  candidateName?: string;
  action: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
  examinerId?: string;
}): Promise<void> {
  const logId = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const path = `audit_logs/${logId}`;
  try {
    const logRef = doc(db, 'audit_logs', logId);
    const entry = {
      id: logId,
      candidateId: log.candidateId || 'SYSTEM',
      candidateName: log.candidateName || 'N/A',
      action: log.action,
      details: log.details,
      examinerId: log.examinerId || auth.currentUser?.displayName || 'AUD-2026-IND-082',
      examinerEmail: auth.currentUser?.email || 'lead.auditor@verihire.in',
      previousStatus: log.previousStatus || 'N/A',
      newStatus: log.newStatus || 'N/A',
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };
    await setDoc(logRef, entry);
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
}

export function subscribeToAuditLogs(
  onData: (logs: AuditLogEntry[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const colRef = collection(db, 'audit_logs');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AuditLogEntry[] = [];
      snapshot.forEach((d) => {
        logs.push({ id: d.id, ...d.data() } as AuditLogEntry);
      });
      onData(logs);
    },
    (error) => {
      // Fallback query without orderBy in case index is pending
      const fallbackUnsub = onSnapshot(
        colRef,
        (fallbackSnap) => {
          const logs: AuditLogEntry[] = [];
          fallbackSnap.forEach((d) => {
            logs.push({ id: d.id, ...d.data() } as AuditLogEntry);
          });
          onData(logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')));
        },
        (fbErr) => {
          handleFirestoreError(fbErr, OperationType.GET, 'audit_logs');
          if (onError) onError(fbErr);
        }
      );
      return fallbackUnsub;
    }
  );
}
