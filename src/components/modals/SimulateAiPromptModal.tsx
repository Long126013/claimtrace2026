import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { X, Sparkles, Check } from 'lucide-react';
import type { AiInteractionRecord } from '../../types';

export const SimulateAiPromptModal: React.FC = () => {
  const { isSimulateAiModalOpen, setSimulateAiModalOpen, addAiRecord } = useProvenanceStore();

  const [model, setModel] = useState('Claude 3.5 Sonnet (Temp: 0.1, Seed: 101)');
  const [temperature, setTemperature] = useState<number>(0.1);
  const [targetArtifact, setTargetArtifact] = useState('evaluate.py');
  const [originalSuggestion, setOriginalSuggestion] = useState(
    'def calc_auc(y_true, y_pred):\n    from sklearn.metrics import roc_auc_score\n    return roc_auc_score(y_true, y_pred)'
  );
  const [adoptedCode, setAdoptedCode] = useState(
    'def calc_auc(y_true, y_pred, n_bootstraps=1000):\n    # Audited: Added 95% bootstrap confidence intervals for paper reporting\n    from sklearn.metrics import roc_auc_score\n    import numpy as np\n    # ... deterministic bootstrap sampling ...'
  );
  const [decision, setDecision] = useState<AiInteractionRecord['decision']>('MODIFIED');
  const [rationale, setRationale] = useState(
    'Augmented raw AI function with non-parametric bootstrap resampling (1000 iterations) to satisfy Nature Cancer peer-review criteria.'
  );
  const [auditorName, setAuditorName] = useState('Dr. Alice Vance');
  const [orcid, setOrcid] = useState('0000-0002-1825-0097');

  if (!isSimulateAiModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promptHash = `sha256_prompt_${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    addAiRecord({
      model,
      temperature,
      targetArtifact,
      promptHash,
      originalSuggestion,
      adoptedCode,
      decision,
      rationale,
      auditorName,
      orcid
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-100 text-purple-800 rounded">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Log AI Co-Authorship & Human Decision
              </h3>
              <p className="text-[11px] text-slate-500">
                Committee on Publication Ethics (COPE) Authorship Attribution Ledger
              </p>
            </div>
          </div>
          <button
            onClick={() => setSimulateAiModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Model & Version
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. GPT-4o (Seed: 42)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Temperature ({temperature})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Script / Pipeline Artifact
              </label>
              <input
                type="text"
                required
                value={targetArtifact}
                onChange={(e) => setTargetArtifact(e.target.value)}
                placeholder="e.g. evaluate.py"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
              />
            </div>

            {/* Original LLM Code */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                LLM Raw Code Suggestion (Before human review)
              </label>
              <textarea
                rows={3}
                required
                value={originalSuggestion}
                onChange={(e) => setOriginalSuggestion(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-red-50/50 border border-red-200 rounded text-red-950 focus:outline-hidden focus:ring-1 focus:ring-red-400"
              />
            </div>

            {/* Adopted / Modified Code */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Adopted / Commited Code (After expert inspection)
              </label>
              <textarea
                rows={3}
                required
                value={adoptedCode}
                onChange={(e) => setAdoptedCode(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-emerald-50/50 border border-emerald-200 rounded text-emerald-950 focus:outline-hidden focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            {/* Decision Radio Group */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Human Editorial Classification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ACCEPTED', 'MODIFIED', 'REJECTED'] as const).map((dec) => (
                  <button
                    key={dec}
                    type="button"
                    onClick={() => setDecision(dec)}
                    className={`py-1.5 px-2 rounded border text-xs font-medium transition-colors text-center ${
                      decision === dec
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {dec === 'MODIFIED' ? 'MODIFIED & APPROVED' : dec}
                  </button>
                ))}
              </div>
            </div>

            {/* Rationale */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Auditor Rationale & Scientific Defense
              </label>
              <textarea
                rows={2}
                required
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Responsible Investigator (Reviewer)
                </label>
                <input
                  type="text"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ORCID iD
                </label>
                <input
                  type="text"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSimulateAiModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Commit AI Governance Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
