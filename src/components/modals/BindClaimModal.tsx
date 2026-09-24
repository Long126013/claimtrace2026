import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { X, BookmarkPlus, Hash, FileCode, Check } from 'lucide-react';

export const BindClaimModal: React.FC = () => {
  const { 
    isBindClaimModalOpen, 
    setBindClaimModalOpen, 
    pendingBinding, 
    bindNewClaim, 
    artifacts 
  } = useProvenanceStore();

  const [claimTitle, setClaimTitle] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('art-cohort-clean');

  if (!isBindClaimModalOpen || !pendingBinding) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = claimTitle.trim() || `Claim: "${pendingBinding.exactQuote.slice(0, 35)}..."`;
    bindNewClaim(pendingBinding, finalTitle, selectedNodeId);
    setClaimTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-emerald-100 text-emerald-800 rounded">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Assert Selection as Claim
              </h3>
              <p className="text-[11px] text-slate-500">
                W3C Open Annotation TextQuoteSelector Specification
              </p>
            </div>
          </div>
          <button
            onClick={() => setBindClaimModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleConfirm}>
          <div className="p-5 space-y-4 text-xs">
            {/* Claim Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Claim Identifier / Label
              </label>
              <input
                type="text"
                value={claimTitle}
                onChange={(e) => setClaimTitle(e.target.value)}
                placeholder={`e.g. Model Robustness Benchmark (${pendingBinding.exactQuote.slice(0, 24)}...)`}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-sans"
              />
            </div>

            {/* W3C Selector breakdown */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                  <Hash className="w-3 h-3 mr-1 text-slate-400" />
                  W3C TextQuoteSelector Coordinates
                </span>
                <span className="text-[10px] font-mono text-slate-400">RFC 7089 Target</span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 block mb-0.5">prefix (Context before):</span>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono-code text-[11px] text-slate-600 break-words">
                  &ldquo;{pendingBinding.prefix || '(start of block)'}&rdquo;
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-emerald-700 font-medium block mb-0.5">exact (Target anchor):</span>
                <div className="p-2 bg-emerald-50/70 border border-emerald-300 rounded font-mono-code text-[11px] text-emerald-900 font-medium break-words">
                  &ldquo;{pendingBinding.exactQuote}&rdquo;
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 block mb-0.5">suffix (Context after):</span>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono-code text-[11px] text-slate-600 break-words">
                  &ldquo;{pendingBinding.suffix || '(end of block)'}&rdquo;
                </div>
              </div>
            </div>

            {/* Target Evidence Node Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <FileCode className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Target Evidence Node (PROV-O Dependency)
              </label>
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 bg-white"
              >
                {artifacts.map((art) => (
                  <option key={art.id} value={art.id}>
                    [{art.type}] {art.name} ({art.version})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Binds the backward provenance edge <code>prov:wasDerivedFrom</code> to this registered entity.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={() => setBindClaimModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-emerald-700 text-white rounded hover:bg-emerald-800 active:bg-emerald-900 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Confirm Claim Binding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
