import React, { useState } from 'react';
import { X, Send, Link, Check, Upload, UserPlus, Shield, FileText } from 'lucide-react';
import { VerificationRequestDraft } from '../types/forensic';

interface CreateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRequest: (draft: VerificationRequestDraft) => void;
  onLaunchCandidatePortal: (draft: VerificationRequestDraft) => void;
}

export const CreateVerificationModal: React.FC<CreateVerificationModalProps> = ({
  isOpen,
  onClose,
  onCreateRequest,
  onLaunchCandidatePortal,
}) => {
  const [name, setName] = useState('Devendra Patel');
  const [email, setEmail] = useState('devendra.patel@example.com');
  const [role, setRole] = useState('Senior Staff AI Systems Engineer');
  const [organization, setOrganization] = useState('Tata Consultancy Enterprise Cloud');
  const [idType, setIdType] = useState<'Aadhaar e-KYC' | 'PAN Card' | 'Passport'>('Aadhaar e-KYC');
  const [clearance, setClearance] = useState<'Tier-1 Executive' | 'Tier-2 Principal' | 'Tier-3 Engineering'>('Tier-2 Principal');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentDraft: VerificationRequestDraft = {
    candidateName: name,
    candidateEmail: email,
    role,
    organization,
    idDocumentType: idType,
    clearanceLevel: clearance,
    referencePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/#candidate-portal?req=REQ-2026-IND-${Math.floor(Math.random() * 9000 + 1000)}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest(currentDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2A3A2C]/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2A3A2C] text-white flex items-center justify-center font-serif font-bold text-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A3A2C]/60 block">
                STEP 1: RECRUITER DISPATCH
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2A3A2C]">
                Create Verification Request
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F9F6F0] flex items-center justify-center text-[#2A3A2C]/60 hover:text-[#2A3A2C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Candidate Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Target Organization
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Required ID Verification
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              >
                <option value="Aadhaar e-KYC">DigiLocker Aadhaar e-KYC</option>
                <option value="PAN Card">DigiLocker PAN Card</option>
                <option value="Passport">ICAO Biometric Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#2A3A2C] uppercase tracking-wider mb-1">
                Clearance Tier
              </label>
              <select
                value={clearance}
                onChange={(e) => setClearance(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-lg text-xs font-sans text-[#2A3A2C] focus:outline-none focus:border-[#2A3A2C]"
              >
                <option value="Tier-1 Executive">Tier-1 Executive (Board / VP)</option>
                <option value="Tier-2 Principal">Tier-2 Principal (Staff / Lead)</option>
                <option value="Tier-3 Engineering">Tier-3 Engineering (Core)</option>
              </select>
            </div>
          </div>

          {/* Secure Link Preview Box */}
          <div className="p-3 bg-[#F9F6F0] rounded-lg border border-[#E5E0D8] space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#2A3A2C]/60 block font-semibold">
              Candidate Secure Invitation Link
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/#candidate-portal?token=SEC-2026-TATA-PATEL`}
                className="flex-1 h-9 px-2.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded text-[11px] font-mono text-[#2A3A2C]/70 truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-9 px-3 bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#2A3A2C] rounded text-xs font-semibold text-[#2A3A2C] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#3D593D]" /> : <Link className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#2A3A2C]/60">
              The candidate will complete identity consent, DigiLocker sandbox check, and record a 20-sec webcam interview.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => {
                onLaunchCandidatePortal(currentDraft);
                onClose();
              }}
              className="w-full sm:w-auto h-10 px-4 bg-[#3D593D] hover:bg-[#2F472F] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>Simulate Candidate Experience</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto h-10 px-4 bg-[#2A3A2C] hover:bg-[#1E2B20] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>Add to Verification Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
