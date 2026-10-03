import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Edit3, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Clock, 
  Search,
  Code
} from 'lucide-react';
import { MOCK_AI_TRIAGE } from '../../mocks';
import type { AiSuggestionTriage } from '../../types';

export const AiTriageView: React.FC = () => {
  const [triageItems, setTriageItems] = useState<AiSuggestionTriage[]>(MOCK_AI_TRIAGE);
  const [selectedItemId, setSelectedItemId] = useState<string>(triageItems[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedText, setModifiedText] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const selectedItem = triageItems.find(item => item.id === selectedItemId) || triageItems[0];

  const filteredItems = triageItems.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.targetArtifact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDecision === 'ALL' || item.decision === filterDecision;
    return matchesSearch && matchesFilter;
  });

  const handleDecision = (id: string, decision: 'ACCEPTED' | 'REJECTED') => {
    setTriageItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          decision,
          syncStatus: 'RECONCILED_SYNC',
          rejectionReason: decision === 'REJECTED' ? 'Rejected by peer review oversight.' : undefined
        };
      }
      return item;
    }));

    setActionSuccessToast(`Suggestion ${decision.toLowerCase()} and logged to COPE 2023 Ledger!`);
    setTimeout(() => setActionSuccessToast(null), 2500);
  };

  const handleOpenModify = () => {
    if (selectedItem) {
      setModifiedText(selectedItem.suggestedContent);
      setIsModifying(true);
    }
  };

  const handleSaveModified = () => {
    if (!selectedItem) return;
    setTriageItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          decision: 'MODIFIED',
          modifiedContent: modifiedText,
          syncStatus: 'RECONCILED_SYNC'
        };
      }
      return item;
    }));
    setIsModifying(false);
    setActionSuccessToast('Modified content accepted and updated in manuscript!');
    setTimeout(() => setActionSuccessToast(null), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden select-text text-slate-900">
      {/* Top Banner Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>AI Suggestion Triage & Sync Status</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                  UI-04
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review generative AI code refactors, enforce human-in-the-loop audit (Accept / Modify / Reject), and monitor offline sync.
              </p>
            </div>
          </div>

          {/* Sync Status Badge & Toast */}
          <div className="flex items-center space-x-3">
            {actionSuccessToast && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded flex items-center animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {actionSuccessToast}
              </span>
            )}

            {/* Offline Buffering / Reconciled Sync badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-mono">
              {triageItems.some(i => i.syncStatus === 'OFFLINE_BUFFERED') ? (
                <span className="flex items-center text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                  <WifiOff className="w-3 h-3 mr-1 text-amber-600" />
                  OFFLINE BUFFERING (1 PENDING)
                </span>
              ) : (
                <span className="flex items-center text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  <Wifi className="w-3 h-3 mr-1 text-emerald-600" />
                  RECONCILED SYNC (ALL COPE AUDITED)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left List Column (32%) */}
        <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search prompts or artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs border border-slate-300 rounded bg-white"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Filter:</span>
              <div className="flex space-x-1">
                {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map(dec => (
                  <button
                    key={dec}
                    onClick={() => setFilterDecision(dec)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      filterDecision === dec
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredItems.map(item => {
              const isSelected = item.id === selectedItemId;
              return (
                <div
                  key={item.id}
                  onClick={() => { setSelectedItemId(item.id); setIsModifying(false); }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500">{item.model}</span>
                    {item.decision === 'ACCEPTED' && (
                      <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACCEPTED
                      </span>
                    )}
                    {item.decision === 'MODIFIED' && (
                      <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                        MODIFIED
                      </span>
                    )}
                    {item.decision === 'REJECTED' && (
                      <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        REJECTED
                      </span>
                    )}
                    {item.decision === 'PENDING' && (
                      <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        PENDING TRIAGE
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-800 line-clamp-2 text-xs">
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{item.targetArtifact}</span>
                    <span>{item.timestamp.slice(0, 10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Detail & Triage Inspector (68%) */}
        {selectedItem ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            {/* Header info */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 text-xs mb-1">
                  <span className="font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    {selectedItem.model}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-mono">Temp: {selectedItem.temperature}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-mono">Artifact: {selectedItem.targetArtifact}</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1 font-sans">
                  Prompt: "{selectedItem.prompt}"
                </h2>
              </div>

              {/* 3 Interactive Triage Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleDecision(selectedItem.id, 'ACCEPTED')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors shadow-2xs"
                  title="Accept AI suggestion and record into COPE Ledger"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>

                <button
                  onClick={handleOpenModify}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-indigo-50 border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-100 transition-colors shadow-2xs"
                  title="Edit suggestion before accepting"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify</span>
                </button>

                <button
                  onClick={() => handleDecision(selectedItem.id, 'REJECTED')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-rose-50 border border-rose-300 text-rose-700 rounded hover:bg-rose-100 transition-colors shadow-2xs"
                  title="Reject AI suggestion"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* Diff Summary Strip */}
            <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Audited Change: {selectedItem.diffSummary}</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Sync: {selectedItem.syncStatus}
              </span>
            </div>

            {/* Visual Code Diff Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Original Content */}
              <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Current Baseline (Human Written)</span>
                  <Code className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <pre className="p-3 bg-slate-50 font-mono text-[11px] text-slate-800 overflow-x-auto flex-1 leading-relaxed">
                  {selectedItem.originalContent}
                </pre>
              </div>

              {/* AI Suggested Content */}
              <div className="border border-purple-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-purple-50 px-3 py-2 border-b border-purple-200 text-xs font-semibold text-purple-900 flex items-center justify-between">
                  <span>AI Generated Recommendation ({selectedItem.model})</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
                {isModifying ? (
                  <div className="p-3 space-y-2 flex-1 flex flex-col">
                    <textarea
                      rows={6}
                      value={modifiedText}
                      onChange={(e) => setModifiedText(e.target.value)}
                      className="w-full flex-1 p-2 font-mono text-[11px] border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsModifying(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveModified}
                        className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Accept Modified Version
                      </button>
                    </div>
                  </div>
                ) : (
                  <pre className="p-3 bg-purple-50/30 font-mono text-[11px] text-slate-900 overflow-x-auto flex-1 leading-relaxed">
                    {selectedItem.modifiedContent || selectedItem.suggestedContent}
                  </pre>
                )}
              </div>
            </div>

            {/* Rejection / Decision Log Note */}
            {selectedItem.rejectionReason && (
              <div className="p-3 bg-rose-50 rounded border border-rose-200 text-xs text-rose-800">
                <span className="font-bold">Rejection Audit Log: </span>
                {selectedItem.rejectionReason}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
            No suggestion selected.
          </div>
        )}
      </div>
    </div>
  );
};
