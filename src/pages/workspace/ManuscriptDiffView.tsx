import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  RotateCw, 
  Database, 
  FileCode, 
  Terminal, 
  Image as ImageIcon, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { MOCK_MANUSCRIPT_DIFF } from '../../mocks';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import type { UnmatchedAnchor } from '../../types';

export const ManuscriptDiffView: React.FC = () => {
  const { artifacts } = useProvenanceStore();
  const [diffData, setDiffData] = useState(MOCK_MANUSCRIPT_DIFF);
  const [realignSuccess, setRealignSuccess] = useState<string | null>(null);

  const handleRealignAnchor = (anchor: UnmatchedAnchor) => {
    setDiffData(prev => ({
      ...prev,
      unmatchedAnchors: prev.unmatchedAnchors.map(a => 
        a.claimId === anchor.claimId 
          ? { ...a, status: 'REALIGNED', oldOffset: a.suggestedNewOffset } 
          : a
      )
    }));

    setRealignSuccess(`Claim ${anchor.claimCode} anchor re-aligned to offset ${anchor.suggestedNewOffset}!`);
    setTimeout(() => setRealignSuccess(null), 2500);
  };

  const handleRealignAll = () => {
    setDiffData(prev => ({
      ...prev,
      unmatchedAnchors: prev.unmatchedAnchors.map(a => ({
        ...a,
        status: 'REALIGNED',
        oldOffset: a.suggestedNewOffset
      }))
    }));

    setRealignSuccess('All unmatched manuscript anchors successfully re-aligned!');
    setTimeout(() => setRealignSuccess(null), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden select-text text-slate-900">
      {/* Top Banner Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
              <GitCompare className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Manuscript Version Diff & Evidence Subgraph</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                  UI-06
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side manuscript revision comparison, automated anchor realignment, and supporting evidence subgraph inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {realignSuccess && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded flex items-center animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {realignSuccess}
              </span>
            )}

            <button
              onClick={handleRealignAll}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Auto-Re-align All Anchors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Split Diff Comparison (65%) */}
        <div className="flex-1 lg:w-[65%] overflow-y-auto p-4 md:p-6 space-y-4 border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-300">
                Base: {diffData.baseVersion}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-800 border border-blue-200 font-bold">
                Target: {diffData.targetVersion}
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="text-emerald-700 font-bold">+{diffData.additionsCount} additions</span>
              <span className="text-rose-700 font-bold">-{diffData.deletionsCount} deletions</span>
            </div>
          </div>

          {/* Unified Monospace Diff Viewer */}
          <div className="border border-slate-200 rounded-lg overflow-hidden font-mono text-[11px] bg-slate-900 text-slate-200">
            <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Section 3: Experimental Validation & Results</span>
              <span>Diff Engine: Unified LCS</span>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {diffData.diffContent.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+');
                const isDel = line.startsWith('-');
                const isHunk = line.startsWith('@@');

                let lineClass = 'text-slate-300';
                if (isAdd) lineClass = 'text-emerald-400 bg-emerald-950/40 px-1 -mx-1 rounded';
                if (isDel) lineClass = 'text-rose-400 bg-rose-950/40 px-1 -mx-1 rounded';
                if (isHunk) lineClass = 'text-indigo-400 font-bold py-1 block';

                return (
                  <div key={idx} className={lineClass}>
                    {line}
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Unmatched Anchors Warning Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Unmatched Manuscript Anchors ({diffData.unmatchedAnchors.length})</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              When wording changes between versions, W3C exact quotes may become detached. Use auto-realign to recalibrate text span offsets.
            </p>

            <div className="space-y-2">
              {diffData.unmatchedAnchors.map(anchor => {
                const isRealigned = anchor.status === 'REALIGNED';
                return (
                  <div
                    key={anchor.claimId}
                    className={`p-3 rounded-lg border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isRealigned
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[11px] text-slate-800">
                          {anchor.claimCode}
                        </span>
                        <span className="text-[10px] text-slate-500">• {anchor.section}</span>
                        {isRealigned ? (
                          <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300 font-bold">
                            REALIGNED (Offset {anchor.oldOffset})
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300 font-bold">
                            OFFSET SHIFT DETECTED ({anchor.oldOffset} → {anchor.suggestedNewOffset})
                          </span>
                        )}
                      </div>
                      <p className="font-serif italic text-slate-800 text-[11px]">
                        "{anchor.exactQuote}"
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isRealigned ? (
                        <span className="text-emerald-700 font-semibold text-[11px] flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Anchor Synced
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRealignAnchor(anchor)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors shadow-2xs"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Re-align ({Math.round(anchor.confidence * 100)}% match)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Evidence Subgraph Panel (35%) */}
        <aside className="flex-1 lg:w-[35%] overflow-y-auto p-4 md:p-6 bg-[#F8F9FA] space-y-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Supporting Evidence Subgraph
            </h2>
            <p className="text-[11px] text-slate-500">
              Active entities bound to this manuscript revision.
            </p>
          </div>

          <div className="space-y-2">
            {artifacts.map(art => (
              <div
                key={art.id}
                className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                    {art.type === 'DATASET' && <Database className="w-3.5 h-3.5 text-blue-600" />}
                    {art.type === 'CODE' && <FileCode className="w-3.5 h-3.5 text-emerald-600" />}
                    {art.type === 'EXECUTION_RUN' && <Terminal className="w-3.5 h-3.5 text-indigo-600" />}
                    {art.type === 'FIGURE' && <ImageIcon className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{art.name}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {art.version}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  SHA-256: {art.hash}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{art.relationship || 'used'}</span>
                  <span className="text-emerald-700 font-semibold">{art.status}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
