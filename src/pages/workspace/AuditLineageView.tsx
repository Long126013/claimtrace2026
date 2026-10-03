import React, { useState } from 'react';
import { 
  EyeOff, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Send
} from 'lucide-react';
import { MOCK_AUDIT_OBSERVATIONS } from '../../mocks';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import type { AuditObservation } from '../../types';

export const AuditLineageView: React.FC = () => {
  const { claims, aiRecords } = useProvenanceStore();
  const [isRedacted, setIsRedacted] = useState(true);
  const [observations, setObservations] = useState<AuditObservation[]>(MOCK_AUDIT_OBSERVATIONS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || 'claim-1');
  
  // New observation state
  const [auditorName, setAuditorName] = useState('Dr. Sarah Jenkins');
  const [severity, setSeverity] = useState<AuditObservation['severity']>('COMPLIANT');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedClaim = claims.find(c => c.id === selectedClaimId) || claims[0];
  const claimObservations = observations.filter(o => o.claimId === selectedClaimId);

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes) return;

    const newObs: AuditObservation = {
      id: `obs-${Date.now().toString().slice(-4)}`,
      claimId: selectedClaimId,
      auditorName,
      orcid: '0000-0003-4412-8819',
      timestamp: new Date().toISOString(),
      severity,
      notes
    };

    setObservations([newObs, ...observations]);
    setNotes('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getSeverityBadge = (sev: AuditObservation['severity']) => {
    switch (sev) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            COMPLIANT
          </span>
        );
      case 'MINOR_CONCERN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            MINOR CONCERN
          </span>
        );
      case 'MAJOR_DISCREPANCY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            MAJOR DISCREPANCY
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden select-text text-slate-900">
      {/* Top Banner Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Redacted Peer-Review Audit Lineage View</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  UI-09
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Auditor-isolated workspace with automated sensitive prompt redaction and formal peer-review observation logging.
              </p>
            </div>
          </div>

          {/* Sensitive Redaction Toggle Switch */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-300 text-xs">
              <span className="text-slate-600 font-semibold text-[11px]">
                Sensitive Redaction Filter:
              </span>
              <button
                onClick={() => setIsRedacted(!isRedacted)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  isRedacted ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isRedacted ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="font-mono font-bold text-[10px]">
                {isRedacted ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    REDACTED
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    RAW REVEALED
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Lineage Nodes with Redaction (65%) */}
        <div className="flex-1 lg:w-[65%] overflow-y-auto p-4 md:p-6 space-y-5 border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Audited Claim Lineage Nodes
              </h2>
              <p className="text-[11px] text-slate-500">
                Cryptographic metadata and provenance edges remain intact while proprietary text is shielded.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Select Claim:</span>
              <select
                aria-label="Select Claim"
                value={selectedClaimId}
                onChange={(e) => setSelectedClaimId(e.target.value)}
                className="p-1 border border-slate-300 rounded font-semibold text-xs"
              >
                {claims.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.claimCode || c.id.toUpperCase()}: {(c.selector?.exactQuote || c.title || '').slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Root Claim Card */}
          <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-emerald-400 font-bold uppercase">Target Manuscript Claim</span>
              <span className="text-slate-400">{selectedClaim.section || 'Section 3.1'}</span>
            </div>
            <p className="font-serif italic text-sm text-slate-100">
              "{selectedClaim.selector?.exactQuote || selectedClaim.title}"
            </p>
            <div className="font-mono text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
              <span>Metric: {selectedClaim.metric || 'Reported Finding'}</span>
              <span>Status: {selectedClaim.status}</span>
            </div>
          </div>

          {/* AI Ledger Audit Trace with Redaction Demo */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Underlying AI Co-Authorship Audit Logs
            </h3>

            {aiRecords.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-[11px]">
                    {rec.model}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Audit ID: {rec.id}
                  </span>
                </div>

                {/* Prompt display with Redaction */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Submitted Prompt:
                  </span>
                  {isRedacted ? (
                    <div className="p-2.5 bg-slate-900 text-slate-500 font-mono text-[11px] rounded border border-slate-800 select-none">
                      ████████████████████████████████████████████████████████████ [CONFIDENTIAL PROPRIETARY PROMPT REDACTED FOR BLINDED REVIEW]
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white text-slate-800 font-mono text-[11px] rounded border border-slate-300">
                      "{rec.originalSuggestion}"
                    </div>
                  )}
                </div>

                {/* SHA-256 Provenance Fingerprint is ALWAYS preserved */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  <span className="text-emerald-700 font-semibold">
                    SHA-256 Digest: {rec.promptHash.slice(0, 24)}... (Verified Cryptographically)
                  </span>
                  <span>Reviewer: {rec.auditorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Auditor Observations Drawer (35%) */}
        <aside className="flex-1 lg:w-[35%] overflow-y-auto p-4 md:p-6 bg-[#F8F9FA] space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-700" />
                <span>Auditor Observations</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Peer-review audit notes attached to {selectedClaim.claimCode || 'Claim'}.
              </p>
            </div>
          </div>

          {/* Form to log new observation */}
          <form onSubmit={handleAddObservation} className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-semibold text-slate-900 text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Formal Observation</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Auditor Name & ID:
              </label>
              <input
                type="text"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Compliance Classification:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AuditObservation['severity'])}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="COMPLIANT">Compliant (Reproducible & Valid)</option>
                <option value="MINOR_CONCERN">Minor Concern (Documentation Gap)</option>
                <option value="MAJOR_DISCREPANCY">Major Discrepancy (Severed Lineage)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Audit Notes & Recommendations:
              </label>
              <textarea
                rows={3}
                required
                placeholder="State your findings regarding provenance integrity, pipeline seed, or sample exclusion..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {saveSuccess && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Recorded!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <Send className="w-3 h-3" />
                <span>Submit Observation</span>
              </button>
            </div>
          </form>

          {/* List of existing observations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Logged Audit Trail ({claimObservations.length})
            </h3>

            {claimObservations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No peer-review observations logged for this claim yet.
              </p>
            ) : (
              claimObservations.map(obs => (
                <div
                  key={obs.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{obs.auditorName}</span>
                    {getSeverityBadge(obs.severity)}
                  </div>
                  <p className="text-slate-700 font-sans text-xs leading-relaxed">
                    {obs.notes}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                    <span>ORCID: {obs.orcid}</span>
                    <span>{obs.timestamp.slice(0, 10)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
