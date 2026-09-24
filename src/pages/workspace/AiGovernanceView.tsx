import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { 
  ShieldCheck, 
  FileCode2, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  UserCheck, 
  Plus,
  Cpu,
  Layers
} from 'lucide-react';

import type { AiInteractionRecord } from '../../types';

export const AiGovernanceView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { aiRecords, setSimulateAiModalOpen } = useProvenanceStore();
  const [selectedRecordId, setSelectedRecordId] = useState<string>(aiRecords[0]?.id || 'ai-rec-001');
  const [copiedPromptHash, setCopiedPromptHash] = useState(false);

  const activeRecord: AiInteractionRecord = 
    aiRecords.find((r) => r.id === selectedRecordId) || aiRecords[0];

  const handleCopyPromptHash = () => {
    navigator.clipboard.writeText(activeRecord.promptHash);
    setCopiedPromptHash(true);
    setTimeout(() => setCopiedPromptHash(false), 1800);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#F8F9FA] overflow-hidden select-text">
      {/* Left List of AI Co-Authorship Audits (32% on desktop) */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              COPE Audit Ledger
            </h2>
            <p className="text-[11px] text-slate-500">
              Human-in-the-loop oversight logs
            </p>
          </div>
          <button
            onClick={() => setSimulateAiModalOpen(true)}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Entry</span>
          </button>
        </div>

        {/* Ledger Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {aiRecords.map((rec) => {
            const isSelected = rec.id === selectedRecordId;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-slate-800 bg-slate-50/80 ring-1 ring-slate-800 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-slate-900 flex items-center">
                    <FileCode2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {rec.targetArtifact || 'Script'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase">
                    {rec.decision}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-1 mb-1 font-mono">
                  {rec.model}
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-2 italic font-sans mb-2">
                  &ldquo;{rec.rationale}&rdquo;
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-100">
                  <span>{rec.auditorName.split(' ')[1] || 'Auditor'}</span>
                  <span>{rec.timestamp.slice(0, 10)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-emerald-50/50 border-t border-slate-200 text-[11px] text-emerald-950">
          <div className="font-semibold flex items-center mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mr-1" />
            COPE AI Authorship Policy
          </div>
          <span className="text-emerald-800/90 text-[10px]">
            AI tools cannot be listed as authors. Full transparency requires prompt logs and explicit human approval records.
          </span>
        </div>
      </aside>

      {/* Right Detail Inspector (68% on desktop) */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
        {/* Main Inspection Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <div className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                COPE Standard Compliance Verified
              </div>
              <h1 className="text-base font-bold text-slate-900">
                Recorded AI Interaction & Human Accountability Ledger
              </h1>
              <p className="text-xs text-slate-500">
                Target Artifact: <code className="font-mono text-slate-800 font-bold">{activeRecord.targetArtifact || 'preprocess.py'}</code>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 transition-colors shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bind to Claim in Studio</span>
              </Link>
              <span className="text-[11px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
                Audit ID: {activeRecord.id}
              </span>
            </div>
          </div>

          {/* Model & Hyperparameter Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-slate-500" />
              Model Configuration & Prompt Digest
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Inference Engine:</span>
                <span className="text-slate-900 font-medium">{activeRecord.model}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Prompt Fingerprint:</span>
                  <span className="text-slate-900 truncate block text-[11px]">
                    {activeRecord.promptHash.slice(0, 24)}...
                  </span>
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={handleCopyPromptHash}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-sans font-medium inline-flex items-center"
                  >
                    {copiedPromptHash ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        <span>Copied Hash</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        <span>Copy Full Hash</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Monospace Code Diff Inspector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <FileCode2 className="w-4 h-4 mr-1.5 text-slate-500" />
                Monospace Code Diff Viewer (LLM Suggestion vs. Human Commited)
              </label>
              <span className="text-[10px] font-mono text-slate-400">git diff --unified=1</span>
            </div>

            <div className="rounded-lg border border-slate-300 bg-white overflow-hidden shadow-2xs font-mono-code text-xs">
              <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>@@ -14,2 +14,2 @@ {activeRecord.targetArtifact || 'preprocess.py'}</span>
                <span className="text-slate-400 text-[10px]">Python 3.11</span>
              </div>

              {/* Red Line: Suggested scaling */}
              <div className="px-3 py-2 bg-[#FEF2F2] border-b border-[#FECACA] text-[#991B1B] flex items-start space-x-2.5">
                <span className="text-slate-400 select-none text-[11px] w-6 text-right">14</span>
                <span className="font-bold select-none">-</span>
                <span className="font-medium whitespace-pre-wrap flex-1">
                  {activeRecord.originalSuggestion}
                </span>
                <span className="text-[10px] text-red-700/80 font-sans select-none bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
                  AI Suggestion (Flawed)
                </span>
              </div>

              {/* Green Line: Adopted code */}
              <div className="px-3 py-2 bg-[#ECFDF5] text-[#065F46] flex items-start space-x-2.5">
                <span className="text-slate-400 select-none text-[11px] w-6 text-right">14</span>
                <span className="font-bold select-none">+</span>
                <span className="font-medium whitespace-pre-wrap flex-1">
                  {activeRecord.adoptedCode}
                </span>
                <span className="text-[10px] text-emerald-700/80 font-sans select-none bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  Adopted (Verified)
                </span>
              </div>
            </div>
          </div>

          {/* Human Judgment Record */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Human Editorial Judgment Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className={`p-2.5 rounded border text-center font-medium ${
                  activeRecord.decision === 'ACCEPTED'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}>
                  [ ] ACCEPTED AS IS
                </div>

                <div className={`p-2.5 rounded border text-center font-medium ${
                  activeRecord.decision === 'MODIFIED'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}>
                  ✓ [x] MODIFIED & APPROVED
                </div>

                <div className={`p-2.5 rounded border text-center font-medium ${
                  activeRecord.decision === 'REJECTED'
                    ? 'bg-red-50 text-red-900 border-red-300 font-bold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}>
                  [ ] REJECTED / DISCARDED
                </div>
              </div>
            </div>

            {/* Rationale */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Auditor Rationale & Methodological Defense
              </label>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                &ldquo;{activeRecord.rationale}&rdquo;
              </div>
            </div>

            {/* Investigator Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Responsible Investigator
                </label>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 flex items-center justify-between">
                  <span className="font-semibold">{activeRecord.auditorName}</span>
                  <a
                    href={`https://orcid.org/${activeRecord.orcid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[11px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
                  >
                    ORCID: {activeRecord.orcid}
                    <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Attestation Timestamp
                </label>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-700">
                  {activeRecord.timestamp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
