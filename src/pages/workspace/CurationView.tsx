import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { buildTreeFromAssembly } from '../../services/mockData';
import { 
  GitFork, 
  Database, 
  FileCode, 
  Terminal, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Layers, 
  Check, 
  Copy, 
  Sparkles,
  Info,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import type { ClaimEvidenceAssembly, LineageBranchNode, Claim } from '../../types';

const DEFAULT_ASSEMBLY: ClaimEvidenceAssembly = {
  claimId: 'claim-1',
  figureArtifactId: 'art-fig2',
  executionRunId: 'art-eval-run',
  codeScriptId: 'art-script-preprocess',
  aiPromptRecordId: 'ai-rec-001',
  datasetArtifactIds: ['art-cohort-clean', 'art-dataset-raw'],
  notes: 'Standard evidence assembly.',
  updatedAt: '2025-05-18T16:25:00Z'
};

interface EditorProps {
  claim: Claim;
  initialAssembly: ClaimEvidenceAssembly;
}

const ClaimEvidenceEditor: React.FC<EditorProps> = ({ claim, initialAssembly }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    artifacts, 
    aiRecords, 
    saveClaimAssembly, 
    setRegisterArtifactModalOpen,
    setSimulateAiModalOpen,
    isUpstreamChanged
  } = useProvenanceStore();

  // Local draft state for this claim's curation form
  const [selectedFigureId, setSelectedFigureId] = useState<string>(initialAssembly.figureArtifactId || 'art-fig2');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>(initialAssembly.executionRunId || 'art-eval-run');
  const [selectedScriptId, setSelectedScriptId] = useState<string>(initialAssembly.codeScriptId || 'art-script-preprocess');
  const [selectedAiRecordId, setSelectedAiRecordId] = useState<string>(initialAssembly.aiPromptRecordId || '');
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>(initialAssembly.datasetArtifactIds || []);
  const [curatorNotes, setCuratorNotes] = useState<string>(initialAssembly.notes || '');
  const [customMetric, setCustomMetric] = useState<string>(claim.metric || '');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Artifact categories
  const figureArtifacts = artifacts.filter(a => a.type === 'FIGURE');
  const executionArtifacts = artifacts.filter(a => a.type === 'EXECUTION_RUN');
  const scriptArtifacts = artifacts.filter(a => a.type === 'CODE');
  const datasetArtifacts = artifacts.filter(a => a.type === 'DATASET');

  // Currently selected artifact objects
  const activeFigure = artifacts.find(a => a.id === selectedFigureId);
  const activeExecution = artifacts.find(a => a.id === selectedExecutionId);
  const activeScript = artifacts.find(a => a.id === selectedScriptId);
  const activeAiRecord = aiRecords.find(r => r.id === selectedAiRecordId);

  // Toggle dataset selection
  const handleToggleDataset = (datasetId: string) => {
    setSelectedDatasetIds(prev => {
      if (prev.includes(datasetId)) {
        return prev.filter(id => id !== datasetId);
      } else {
        return [...prev, datasetId];
      }
    });
  };

  // Save current assembly to Zustand store
  const handleSaveAssembly = () => {
    const updatedAssembly: ClaimEvidenceAssembly = {
      claimId: claim.id,
      figureArtifactId: selectedFigureId,
      executionRunId: selectedExecutionId,
      codeScriptId: selectedScriptId,
      aiPromptRecordId: selectedAiRecordId || undefined,
      datasetArtifactIds: selectedDatasetIds,
      notes: curatorNotes,
      updatedAt: new Date().toISOString()
    };

    saveClaimAssembly(updatedAssembly);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Reset form to initial stored assembly
  const handleResetForm = () => {
    setSelectedFigureId(initialAssembly.figureArtifactId || 'art-fig2');
    setSelectedExecutionId(initialAssembly.executionRunId || 'art-eval-run');
    setSelectedScriptId(initialAssembly.codeScriptId || 'art-script-preprocess');
    setSelectedAiRecordId(initialAssembly.aiPromptRecordId || '');
    setSelectedDatasetIds(initialAssembly.datasetArtifactIds || []);
    setCuratorNotes(initialAssembly.notes || '');
    setCustomMetric(claim.metric || '');
    setSavedSuccess(false);
  };

  // Copy hash helper
  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  // Build live preview tree from current form state
  const draftAssembly: ClaimEvidenceAssembly = {
    claimId: claim.id,
    figureArtifactId: selectedFigureId,
    executionRunId: selectedExecutionId,
    codeScriptId: selectedScriptId,
    aiPromptRecordId: selectedAiRecordId || undefined,
    datasetArtifactIds: selectedDatasetIds,
    notes: curatorNotes,
    updatedAt: new Date().toISOString()
  };

  const claimLabel = claim.selector?.exactQuote || claim.title || claim.claimCode;

  const previewTree: LineageBranchNode = buildTreeFromAssembly(
    claim.id,
    customMetric ? `${claimLabel.slice(0, 50)}... [${customMetric}]` : claimLabel,
    draftAssembly,
    isUpstreamChanged,
    artifacts,
    aiRecords
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Evidence Assembly Builder (58%) */}
      <div className="flex-1 lg:w-[58%] overflow-y-auto p-4 md:p-6 space-y-5 border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-700" />
              <span>Evidence Assembly Channels</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Bind artifacts and AI logs to substantiate this claim across the 4 PROV-O channels.
            </p>
          </div>

          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded flex items-center animate-fade-in">
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Lineage stream bound & saved!
            </span>
          )}
        </div>

        {/* CHANNEL 1: Resulting Evidence / Figure */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-300">
                1
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                  <span>Channel 1: Resulting Evidence Figure</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                    prov:wasDerivedFrom
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  The visual evidence, plot, or table artifact that displays this claim's finding in the paper.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Select Figure / Plot Artifact:
              </label>
              <select
                aria-label="Select Figure or Plot Artifact"
                value={selectedFigureId}
                onChange={(e) => setSelectedFigureId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {figureArtifacts.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name} ({art.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Reported Metric / Value in Paper:
              </label>
              <input
                type="text"
                value={customMetric}
                onChange={(e) => setCustomMetric(e.target.value)}
                placeholder="e.g. AUROC 0.92 (95% CI: 0.89-0.95)"
                className="w-full text-xs bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Selected Figure Card Preview */}
          {activeFigure && (
            <div className="p-2.5 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>{activeFigure.name}</span>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {activeFigure.version}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {activeFigure.description}
                </div>
                <div className="font-mono text-[10px] text-slate-600 flex items-center gap-1">
                  <span>SHA-256: {activeFigure.hash.slice(0, 26)}...</span>
                  <button
                    onClick={() => handleCopy(activeFigure.hash)}
                    className="text-slate-400 hover:text-slate-600"
                    title="Copy Hash"
                  >
                    {copiedHash === activeFigure.hash ? (
                      <Check className="w-3 h-3 text-emerald-600 inline" />
                    ) : (
                      <Copy className="w-3 h-3 inline" />
                    )}
                  </button>
                </div>
              </div>

              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold shrink-0">
                {activeFigure.status}
              </span>
            </div>
          )}
        </div>

        {/* CHANNEL 2: Execution Run / Pipeline */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-300">
              2
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-700" />
                <span>Channel 2: Execution Run / Computational Pipeline</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded">
                  prov:wasGeneratedBy
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                The reproducible container run or orchestration job that computed the quantitative outcome.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Select Execution Run Artifact:
            </label>
            <select
              aria-label="Select Execution Run Artifact"
              value={selectedExecutionId}
              onChange={(e) => setSelectedExecutionId(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {executionArtifacts.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.name} ({art.version})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Execution Run Details */}
          {activeExecution && (
            <div className="p-2.5 bg-white rounded border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{activeExecution.name}</span>
                <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {activeExecution.sizeOrDetail || 'Containerized Run'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200">
                {activeExecution.version}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Registered: {activeExecution.registeredDate}</span>
                <span className="font-mono text-slate-600">
                  Hash: {activeExecution.hash.slice(0, 20)}...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CHANNEL 3: Code Script & AI Prompt Governance */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300">
              3
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-700" />
                <span>Channel 3: Code Script & AI Prompt Record</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  prov:used • prov:wasInformedBy
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                The deterministic script used by the execution run, and the AI prompt ledger record documenting any synthetic assistance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Script selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Primary Code Script:
              </label>
              <select
                aria-label="Primary Code Script"
                value={selectedScriptId}
                onChange={(e) => setSelectedScriptId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {scriptArtifacts.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name} ({art.version})
                  </option>
                ))}
              </select>
              {activeScript && (
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {activeScript.description}
                </p>
              )}
            </div>

            {/* AI Prompt Record selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI Prompt Record (COPE):</span>
                </label>
                <button
                  onClick={() => setSimulateAiModalOpen(true)}
                  className="text-[10px] font-medium text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Log New</span>
                </button>
              </div>
              <select
                aria-label="AI Prompt Record (COPE)"
                value={selectedAiRecordId}
                onChange={(e) => setSelectedAiRecordId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- No AI Assistance (100% Manual Code) --</option>
                {aiRecords.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.id.toUpperCase()}: {rec.model} - {rec.rationale}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Record Details Card */}
          {activeAiRecord && (
            <div className="p-3 bg-purple-50/60 rounded border border-purple-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>{activeAiRecord.rationale}</span>
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  COPE-2023 COMPLIANT
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-purple-200 italic line-clamp-2">
                "{activeAiRecord.originalSuggestion}"
              </div>
              <div className="flex items-center justify-between text-[10px] text-purple-800 pt-0.5 font-mono">
                <span>Model: {activeAiRecord.model}</span>
                <span>Reviewer: {activeAiRecord.auditorName}</span>
                <span>Prompt Hash: {activeAiRecord.promptHash.slice(0, 16)}...</span>
              </div>
            </div>
          )}
        </div>

        {/* CHANNEL 4: Input Datasets */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-300">
                4
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-700" />
                  <span>Channel 4: Upstream Input Datasets</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                    prov:used
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select all raw, processed, or reference data sources consumed in the execution run.
                </p>
              </div>
            </div>

            <button
              onClick={() => setRegisterArtifactModalOpen(true)}
              className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3 h-3 text-slate-500" />
              <span>+ Register Dataset</span>
            </button>
          </div>

          {/* Dataset Checkbox Cards */}
          <div className="space-y-2">
            {datasetArtifacts.map((ds) => {
              const isSelected = selectedDatasetIds.includes(ds.id);
              return (
                <div
                  key={ds.id}
                  onClick={() => handleToggleDataset(ds.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span>{ds.name}</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {ds.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {ds.description || ds.sizeOrDetail}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="font-mono text-[10px] text-slate-500 block">
                      {ds.sizeOrDetail}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {ds.hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rationale & Methodological Notes */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Curator Rationale & Methodological Documentation</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Provide context for peer reviewers on why these specific artifacts substantiate the claim and verify scientific reproducibility.
          </p>
          <textarea
            rows={3}
            value={curatorNotes}
            onChange={(e) => setCuratorNotes(e.target.value)}
            placeholder="e.g. Evaluated on 1,000 bootstrap resamplings with fixed seed 42. Verified calibration curve concordant with secondary institutional cohort..."
            className="w-full text-xs bg-white border border-slate-300 rounded p-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-sans"
          />
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={handleResetForm}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Saved</span>
          </button>

          <button
            onClick={handleSaveAssembly}
            className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save & Bind Lineage to Claim</span>
          </button>
        </div>
      </div>

      {/* Right Column: Live Provenance Tree Preview (42%) */}
      <div className="flex-1 lg:w-[42%] overflow-y-auto p-4 md:p-6 bg-[#F8F9FA] flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-slate-700" />
              <span>Live Provenance Graph Preview</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Dynamic visual representation of the assembled PROV-O hierarchy.
            </p>
          </div>

          <Link
            to={`/workspace/${projectId || 'proj-oncogen-01'}/lineage-trees`}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <span>Full Graph</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Real-time Verification Status Card */}
        <div className="p-3 bg-white rounded border border-slate-200 space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cryptographic Integrity Audit
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">SHA-256 Hashes: Valid</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">W3C PROV-O: Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {selectedAiRecordId ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="text-slate-700 font-medium">
                {selectedAiRecordId ? 'COPE AI Audit: Linked' : 'AI Disclosure: Pure Code'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">
                Datasets: {selectedDatasetIds.length} Linked
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Hierarchy Branch Preview Card */}
        <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 overflow-y-auto space-y-3 font-sans">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Assembled Lineage Stream:
          </span>

          {/* Tree Node Renderer */}
          <div className="space-y-2">
            {/* Root Claim Node */}
            <div className="p-3 bg-slate-900 text-white rounded border border-slate-900 text-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                  PROV:CLAIM (TARGET)
                </span>
                <span className="font-mono text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded border border-slate-700">
                  {previewTree.status}
                </span>
              </div>
              <div className="font-serif font-bold text-xs">
                {claimLabel}
              </div>
              {customMetric && (
                <div className="mt-1 font-mono text-[11px] text-amber-300">
                  Outcome Metric: {customMetric}
                </div>
              )}
            </div>

            {/* Connecting line */}
            <div className="pl-6 border-l-2 border-slate-200 ml-4 space-y-2 pt-1 pb-1">
              {/* Figure Node */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-amber-800 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-amber-700" />
                    <span>wasDerivedFrom • Figure</span>
                  </span>
                  <span className="font-mono text-[10px] text-amber-900">
                    {activeFigure?.version}
                  </span>
                </div>
                <div className="font-semibold text-slate-800">
                  {activeFigure?.name || 'No figure selected'}
                </div>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                  {activeFigure?.hash.slice(0, 24)}...
                </div>
              </div>

              {/* Connecting line to Execution Run */}
              <div className="pl-6 border-l-2 border-slate-200 ml-4 space-y-2 pt-1 pb-1">
                {/* Execution Node */}
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-800 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-indigo-700" />
                      <span>wasGeneratedBy • Activity</span>
                    </span>
                    <span className="font-mono text-[10px] text-indigo-900">
                      {activeExecution?.version.slice(0, 24)}...
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    {activeExecution?.name || 'No execution run selected'}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {activeExecution?.sizeOrDetail}
                  </div>
                </div>

                {/* Branches from Execution Run: Code + Datasets */}
                <div className="pl-6 border-l-2 border-slate-200 ml-4 space-y-2 pt-1 pb-1">
                  {/* Script & AI sub-branch */}
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <FileCode className="w-3 h-3 text-emerald-700" />
                        <span>used • Pipeline Script</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-900">
                        {activeScript?.version}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {activeScript?.name || 'No script selected'}
                    </div>

                    {/* AI Sub-Node */}
                    {activeAiRecord && (
                      <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="flex items-center justify-between text-[10px] font-bold text-purple-800 font-mono mb-0.5">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                            <span>wasInformedBy (AI Prompt)</span>
                          </span>
                          <span className="text-emerald-700">COPE VERIFIED</span>
                        </div>
                        <div className="text-[11px] text-purple-900 font-medium">
                          {activeAiRecord.model} — {activeAiRecord.rationale}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dataset Leaves */}
                  {selectedDatasetIds.map((dsId, idx) => {
                    const ds = artifacts.find(a => a.id === dsId);
                    if (!ds) return null;
                    return (
                      <div
                        key={dsId}
                        className="p-2 bg-blue-50/70 border border-blue-200 rounded text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-blue-800 mb-0.5">
                          <span className="font-bold flex items-center gap-1">
                            <Database className="w-2.5 h-2.5 text-blue-700" />
                            <span>used • Dataset [{idx + 1}]</span>
                          </span>
                          <span>{ds.version}</span>
                        </div>
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {ds.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {ds.sizeOrDetail || ds.hash.slice(0, 18)}
                        </div>
                      </div>
                    );
                  })}

                  {selectedDatasetIds.length === 0 && (
                    <div className="p-2 bg-slate-50 border border-dashed border-slate-300 rounded text-xs text-slate-400 italic">
                      No input datasets selected yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CurationView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    claims, 
    claimAssemblies, 
    activeClaimId, 
    setActiveClaimId,
    setBindClaimModalOpen
  } = useProvenanceStore();

  const currentClaim = claims.find(c => c.id === activeClaimId) || claims[0];
  const activeAssembly = (currentClaim && claimAssemblies[currentClaim.id]) || {
    ...DEFAULT_ASSEMBLY,
    claimId: currentClaim?.id || 'claim-1'
  };

  const currentClaimLabel = currentClaim?.selector?.exactQuote || currentClaim?.title || currentClaim?.claimCode || 'Claim';

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden select-text text-slate-900">
      {/* Top Banner Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Claim Evidence Studio & Provenance Builder</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    W3C PROV-O AUTHORING
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curate, attach, and cryptographically bind multi-channel evidence, computational pipelines, and AI prompt logs into manuscript claims.
                </p>
              </div>
            </div>
          </div>

          {/* Claim Selector & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs">
              <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wide">
                Target Claim:
              </span>
              <select
                aria-label="Select Target Claim"
                value={currentClaim?.id}
                onChange={(e) => setActiveClaimId(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.claimCode || c.id.toUpperCase()}: {(c.selector?.exactQuote || c.title || c.id).slice(0, 48)}... ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setBindClaimModalOpen(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>New Claim</span>
            </button>

            <Link
              to={`/workspace/${projectId || 'proj-oncogen-01'}/lineage-trees`}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 rounded hover:bg-slate-200 transition-colors shadow-2xs"
            >
              <GitFork className="w-3.5 h-3.5 text-slate-600" />
              <span>View in Lineage Tree</span>
              <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Active Claim Manuscript Context Strip */}
        <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-1">
              <span className="font-mono font-bold text-slate-700">
                {currentClaim?.claimCode || currentClaim?.id.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-slate-600">
                Section: {currentClaim?.section || 'Section 3.1'} (W3C TextQuoteSelector Anchor)
              </span>
              <span>•</span>
              {currentClaim?.status === 'STALE' ? (
                <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300 flex items-center">
                  <AlertTriangle className="w-2.5 h-2.5 mr-0.5 inline" />
                  STALE
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline text-emerald-700" />
                  HEALTHY
                </span>
              )}
            </div>
            <p className="font-serif italic text-slate-800 line-clamp-2 text-xs">
              "{currentClaimLabel}"
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0 font-mono text-[11px] text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Target Metric</span>
              <span className="font-bold text-slate-800">{currentClaim?.metric || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Confidence</span>
              <span className="text-slate-700">
                {currentClaim?.confidenceScore ? `${Math.round(currentClaim.confidenceScore * 100)}%` : '95%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Keyed Claim Evidence Editor */}
      {currentClaim && (
        <ClaimEvidenceEditor
          key={currentClaim.id}
          claim={currentClaim}
          initialAssembly={activeAssembly}
        />
      )}
    </div>
  );
};
