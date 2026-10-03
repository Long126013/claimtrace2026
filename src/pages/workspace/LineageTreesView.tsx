import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { getClaimLineageTree } from '../../services/mockData';
import { 
  GitFork, 
  AlertTriangle, 
  FileCode, 
  Database, 
  Terminal, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Unlink, 
  Cpu,
  Settings2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Layers,
  Wrench,
  X,
  Clock,
  Activity,
  Table as TableIcon
} from 'lucide-react';

import type { LineageBranchNode } from '../../types';

export const LineageTreesView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    isUpstreamChanged, 
    reRunExecutionAndReVerify,
    claims, 
    activeClaimId, 
    setActiveClaimId,
    claimAssemblies
  } = useProvenanceStore();

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<LineageBranchNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [isReRunning, setIsReRunning] = useState(false);
  const [timelineMode, setTimelineMode] = useState<'SNAPSHOT' | 'CURRENT'>('CURRENT');
  const [viewMode, setViewMode] = useState<'DAG' | 'HEALTH_TABLE'>('DAG');
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  const showInvalidationToast = isUpstreamChanged && !isToastDismissed;

  const activeClaim = claims.find((c) => c.id === activeClaimId) || claims[0];
  const activeAssembly = claimAssemblies[activeClaim.id];
  const effectiveUpstreamChanged = timelineMode === 'SNAPSHOT' ? false : isUpstreamChanged;
  const treeRoot = getClaimLineageTree(activeClaim.id, effectiveUpstreamChanged, activeAssembly);
  const isClaimStale = activeClaim.status === 'STALE' && timelineMode === 'CURRENT';

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const handleReRun = () => {
    setIsReRunning(true);
    setTimeout(() => {
      reRunExecutionAndReVerify();
      setIsReRunning(false);
    }, 600);
  };

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => setCollapsedNodes({});
  const collapseSubBranches = () => {
    const newCollapsed: Record<string, boolean> = {
      'node-model-weights': true,
      'node-run-preprocess': true
    };
    setCollapsedNodes(newCollapsed);
  };

  // Node Category Icon
  const getNodeIcon = (category: LineageBranchNode['category']) => {
    switch (category) {
      case 'CLAIM':
        return <GitFork className="w-3.5 h-3.5 text-slate-800" />;
      case 'FIGURE':
        return <ImageIcon className="w-3.5 h-3.5 text-amber-700" />;
      case 'EXECUTION':
        return <Terminal className="w-3.5 h-3.5 text-indigo-700" />;
      case 'CODE':
        return <FileCode className="w-3.5 h-3.5 text-emerald-700" />;
      case 'DATASET':
        return <Database className="w-3.5 h-3.5 text-blue-700" />;
      case 'MODEL_WEIGHTS':
        return <Cpu className="w-3.5 h-3.5 text-purple-700" />;
      case 'CONFIG':
        return <Settings2 className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  // Recursive Branching Node Renderer
  const renderBranchNode = (node: LineageBranchNode, depth: number = 0, _isLastChild: boolean = false) => {
    const isCollapsed = !!collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const isBroken = node.isBroken;
    const isMismatch = node.status === 'MISMATCH';

    // State styling
    let cardStyle = 'border-slate-200 bg-white hover:border-slate-300';
    if (isMismatch) {
      cardStyle = 'bg-[#FEF2F2] border-[#FECACA] ring-2 ring-red-400 shadow-xs';
    } else if (isBroken) {
      cardStyle = 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300';
    } else if (isSelected) {
      cardStyle = 'border-slate-900 bg-slate-50/50 ring-1 ring-slate-900 shadow-2xs';
    }

    return (
      <div key={node.id} className="relative pl-6 sm:pl-8 my-3">
        {/* Branch Fork Header Badge (e.g. Branch A / Branch B) */}
        {node.branchLabel && (
          <div className="mb-2 flex items-center space-x-2">
            <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
              <GitBranch className="w-3 h-3 mr-1 text-slate-500" />
              {node.branchLabel}
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
        )}

        {/* Tree Branch Connector Lines */}
        {depth > 0 && (
          <>
            {/* Horizontal line to node */}
            <div 
              className={`absolute left-0 top-5 w-6 sm:w-8 transition-colors ${
                isBroken ? 'border-t-2 border-dashed border-red-500' : 'border-t border-slate-300'
              }`}
            />
            {/* Broken Link Warning Icon if severed */}
            {isBroken && isMismatch && (
              <div 
                className="absolute left-[-6px] top-3.5 bg-red-600 text-white p-0.5 rounded-full z-10 shadow-xs" 
                title="Broken provenance edge due to upstream mutation"
              >
                <Unlink className="w-3 h-3" />
              </div>
            )}
          </>
        )}

        {/* Node Card */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`p-3 rounded-lg border transition-all cursor-pointer shadow-2xs ${cardStyle}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <button
                  onClick={(e) => toggleCollapse(node.id, e)}
                  className="p-0.5 rounded hover:bg-slate-100 text-slate-500"
                  title={isCollapsed ? 'Expand branch' : 'Collapse branch'}
                >
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}

              {node.relationship && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                  node.relationship === 'wasDerivedFrom' 
                    ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                    : node.relationship === 'wasGeneratedBy'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {node.relationship}
                </span>
              )}

              <div className="flex items-center space-x-1.5">
                {getNodeIcon(node.category)}
                <span className={`text-xs font-bold ${isMismatch ? 'text-red-950' : 'text-slate-900'}`}>
                  {node.name}
                </span>
              </div>
            </div>

            {/* Right side status badge */}
            <div className="flex items-center space-x-2">
              {node.version && (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {node.version}
                </span>
              )}

              {isMismatch ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider flex items-center shadow-2xs">
                  <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                  [HASH MISMATCH: v1 -&gt; v2]
                </span>
              ) : isBroken ? (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FEF9C3] text-[#92400E] border border-[#FDE68A] uppercase">
                  STALE DEPENDENCY
                </span>
              ) : (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] uppercase">
                  SYNCHRONIZED
                </span>
              )}
            </div>
          </div>

          {/* Node detail / Hash row */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-2">
            <span className="text-slate-500 font-sans line-clamp-1">
              {node.detail || 'PROV-O verified lineage entity'}
            </span>

            {node.hash && (
              <div className="flex items-center space-x-1.5 font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                <span className="text-slate-400">SHA:</span>
                <span className={`font-semibold ${isMismatch ? 'text-red-700 font-bold' : 'text-slate-700'}`}>
                  {node.hash.slice(0, 16)}...
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyHash(node.hash || '');
                  }}
                  className="text-slate-400 hover:text-slate-800 p-0.5"
                  title="Copy full SHA-256 hash"
                >
                  {copiedHash === node.hash ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Invalidation Alert if mismatch */}
          {node.brokenReason && (
            <div className="mt-2 p-2 bg-red-100/60 border border-red-200 rounded text-[11px] text-red-900 font-sans">
              <strong>Cryptographic Edge Broken:</strong> {node.brokenReason}
            </div>
          )}
        </div>

        {/* Render Children Branches recursively */}
        {hasChildren && !isCollapsed && (
          <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 pl-1">
            {node.children!.map((child, index) => 
              renderBranchNode(child, depth + 1, index === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#F8F9FA] overflow-hidden select-text">
      {/* Left Panel: Claims Directory (30% on desktop) */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <GitFork className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
              Claims Directory
            </h2>
            <p className="text-[11px] text-slate-500">
              Asserted empirical statements ({claims.length})
            </p>
          </div>
          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
            W3C Targets
          </span>
        </div>

        {/* Claims List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {claims.map((claim) => {
            const isSelected = claim.id === activeClaimId;
            const isStale = claim.status === 'STALE';

            return (
              <div
                key={claim.id}
                onClick={() => {
                  setActiveClaimId(claim.id);
                  setSelectedNode(null);
                }}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-slate-700 inline-block mr-1.5" />
                    {claim.claimCode}
                  </span>
                  {isStale ? (
                    <span className="inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FEF9C3] text-[#92400E] border border-[#FDE68A]">
                      <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                      STALE
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                      SUPPORTED
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 line-clamp-1 mb-1 font-sans">
                  {claim.title || claim.claimCode}
                </div>

                <div className="text-[11px] text-slate-600 italic font-serif-prose line-clamp-2 mb-2 leading-relaxed">
                  &ldquo;{claim.selector.exactQuote}&rdquo;
                </div>

                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                  <span>Confidence: {claim.confidenceScore ? `${Math.round(claim.confidenceScore * 100)}%` : '95%'}</span>
                  <span>{claim.section ? claim.section.slice(0, 18) : 'Section 3'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Directory Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700 flex items-center mb-0.5">
            <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Branching DAG Model
          </div>
          Select any claim to render its multi-fork evidence tree with model pipelines and preprocessing streams.
        </div>
      </aside>

      {/* Main Panel: Interactive Derivation Tree (70% on desktop) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Persistent Invalidation Banner when isUpstreamChanged is active */}
        {isUpstreamChanged && (
          <div className="bg-[#FEF2F2] border-b border-[#FECACA] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#991B1B] animate-in slide-in-from-top-1 duration-150 shrink-0">
            <div className="flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold flex items-center">
                  ⚠️ Upstream Invalidation: Raw dataset altered. Claim CLM-001 is now STALE.
                </div>
                <div className="text-[11px] text-[#991B1B]/90 mt-0.5">
                  Content hash mismatch at root entity <code>cohort_clinical_raw.csv</code>. Provenance edge in Data Preprocessing branch is severed.
                </div>
              </div>
            </div>

            <button
              onClick={handleReRun}
              disabled={isReRunning}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-700 text-white rounded text-xs font-semibold hover:bg-red-800 active:bg-red-900 transition-colors shadow-2xs shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReRunning ? 'animate-spin' : ''}`} />
              <span>{isReRunning ? 'Re-executing Pipeline...' : 'Re-run Execution & Re-verify'}</span>
            </button>
          </div>
        )}

        {/* Tree Control Toolbar */}
        <div className="h-10 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider font-mono">
              Branching Lineage Tree
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              {activeClaim.claimCode}
            </span>

            {/* Bitemporal Snapshot Toggle (UI-07) */}
            <div className="inline-flex rounded border border-slate-300 bg-slate-100 p-0.5 text-[11px] font-medium ml-2">
              <button
                type="button"
                onClick={() => setTimelineMode('SNAPSHOT')}
                title="View immutable state as recorded at manuscript submission"
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  timelineMode === 'SNAPSHOT'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manuscript Snapshot (t_sub)
              </button>
              <button
                type="button"
                onClick={() => setTimelineMode('CURRENT')}
                title="View current live state with upstream dataset mutations"
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  timelineMode === 'CURRENT'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Current State (t_now)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Switcher (Tree vs Health Table UI-08) */}
            <div className="inline-flex rounded border border-slate-300 bg-slate-100 p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setViewMode('DAG')}
                className={`px-2.5 py-0.5 rounded flex items-center space-x-1 transition-colors ${
                  viewMode === 'DAG'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitFork className="w-3 h-3 mr-1 text-slate-500" />
                <span>Lineage DAG</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('HEALTH_TABLE')}
                className={`px-2.5 py-0.5 rounded flex items-center space-x-1 transition-colors ${
                  viewMode === 'HEALTH_TABLE'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3 h-3 mr-1 text-slate-500" />
                <span>Claim Health Matrix</span>
              </button>
            </div>

            {viewMode === 'DAG' && (
              <>
                <Link
                  to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 text-[11px] rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  <Wrench className="w-3 h-3 text-indigo-600" />
                  <span>Studio</span>
                </Link>

                <button
                  onClick={expandAll}
                  className="px-2.5 py-1 text-[11px] rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseSubBranches}
                  className="px-2.5 py-1 text-[11px] rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Collapse Sub-Branches
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'HEALTH_TABLE' ? (
            /* UI-08: Claim Health Status Table */
            <div className="space-y-4">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Total Asserted Claims</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">{claims.length}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Anchored via W3C Selectors</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Verified Integrity</span>
                  <span className="text-2xl font-bold text-emerald-700 font-mono">{claims.filter(c => c.status !== 'STALE').length}</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">Full DAG Hash Match</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Stale / Disrupted</span>
                  <span className="text-2xl font-bold text-amber-700 font-mono">{claims.filter(c => c.status === 'STALE').length}</span>
                  <span className="text-[11px] text-amber-600 block mt-0.5">Require Re-computation</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Global Lineage Health</span>
                  <span className={`text-2xl font-bold font-mono ${isUpstreamChanged ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {isUpstreamChanged ? '82%' : '100%'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {isUpstreamChanged ? 'Root Divergence Detected' : 'Cryptographically Sound'}
                  </span>
                </div>
              </div>

              {/* Claims Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Workspace Claims Health Status Table (UI-08)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Real-time status overview of all scientific claims and their upstream dependencies
                    </p>
                  </div>
                  <button
                    onClick={handleReRun}
                    disabled={isReRunning}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReRunning ? 'animate-spin' : ''}`} />
                    <span>{isReRunning ? 'Verifying all...' : 'Verify All Claims'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                        <th className="py-2.5 px-4 font-semibold">Claim ID</th>
                        <th className="py-2.5 px-4 font-semibold">Manuscript Extract / Statement</th>
                        <th className="py-2.5 px-4 font-semibold">Integrity Status</th>
                        <th className="py-2.5 px-4 font-semibold">Upstream Dependencies</th>
                        <th className="py-2.5 px-4 font-semibold">Last Checked</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {claims.map((c) => {
                        const isStale = c.status === 'STALE';
                        return (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {c.claimCode}
                            </td>
                            <td className="py-3 px-4 max-w-md">
                              <div className="font-serif text-slate-800 line-clamp-2">
                                &ldquo;{c.selector.exactQuote}&rdquo;
                              </div>
                              {c.title && (
                                <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                                  {c.title}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {isStale ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                  <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                                  STALE (Edge Divergence)
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                  VERIFIED (PROV-O Valid)
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                4 entities (1 Data, 1 Code, 1 Run, 1 Fig)
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {c.boundAt || '2024-03-15 14:22 UTC'}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setActiveClaimId(c.id);
                                  setViewMode('DAG');
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded text-[11px] font-medium transition-colors shadow-2xs"
                              >
                                Inspect Lineage
                              </button>
                              <button
                                onClick={handleReRun}
                                disabled={isReRunning}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors shadow-2xs disabled:opacity-50"
                              >
                                Re-verify
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* UI-07: Interactive Branching Derivation Tree */
            <>
              {timelineMode === 'SNAPSHOT' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Bitemporal Snapshot Mode:</span>
                    <span>Displaying immutable lineage as recorded at manuscript submission (2024-03-15T09:30:00Z). Mutations disabled.</span>
                  </div>
                  <span className="font-mono text-[10px] bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-300 font-bold uppercase">
                    Frozen t_sub
                  </span>
                </div>
              )}

              {/* Main Branching Tree Container */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-2xs">
                {/* Root Claim Node Header */}
                <div className="p-4 rounded-lg border border-slate-900 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">
                        W3C Target Claim
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        {activeClaim.claimCode}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 font-serif-prose">
                      &ldquo;{activeClaim.selector.exactQuote}&rdquo;
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isClaimStale ? (
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-400 text-amber-950 flex items-center shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        STALE CLAIM DETECTED
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-semibold px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        VERIFIED CRYPTOGRAPHIC CHAIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Tree Branches */}
                <div className="border-l-2 border-slate-200 ml-4 pl-2 space-y-4">
                  {treeRoot.children && treeRoot.children.map((child, idx) => 
                    renderBranchNode(child, 1, idx === treeRoot.children!.length - 1)
                  )}
                </div>
              </div>

              {/* Inspected Node Inspector Card (UI-07 Bitemporal details) */}
              {selectedNode && (
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs space-y-3 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      {getNodeIcon(selectedNode.category)}
                      <span className="font-bold text-slate-900 font-mono">
                        {selectedNode.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-medium"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold">Category:</span>
                      <span className="font-semibold text-slate-800 font-mono">{selectedNode.category}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold">Relationship:</span>
                      <span className="font-semibold text-slate-800 font-mono">{selectedNode.relationship || 'Root Entity'}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold">Status:</span>
                      <span className={`font-semibold font-mono ${
                        selectedNode.status === 'MISMATCH' ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        {selectedNode.status}
                      </span>
                    </div>
                  </div>

                  {/* Bitemporal Coordinates (UI-07) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <div className="flex items-center text-slate-400 font-mono text-[10px] uppercase font-bold mb-0.5">
                        <Clock className="w-3 h-3 mr-1 text-slate-500" />
                        <span>Valid Time (t_valid):</span>
                      </div>
                      <span className="font-mono text-slate-800 text-[11px]">
                        2024-03-15T09:30:00Z (Experimental Observation)
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <div className="flex items-center text-slate-400 font-mono text-[10px] uppercase font-bold mb-0.5">
                        <Activity className="w-3 h-3 mr-1 text-slate-500" />
                        <span>Transaction Time (t_tx):</span>
                      </div>
                      <span className="font-mono text-slate-800 text-[11px]">
                        2024-03-15T14:22:10Z (System Ledger Commit)
                      </span>
                    </div>
                  </div>

                  {/* Downstream Blast Radius (UI-07) */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold mb-1">
                      Downstream Blast Radius (Impact Analysis):
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-slate-700 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>CLM-001 (Direct Dependency: Overall survival HR=0.68)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-700 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>CLM-002 (Indirect Dependency: Progression-free survival delta)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-700 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span>Figure 4B (Kaplan-Meier survival curves)</span>
                      </div>
                    </div>
                  </div>

                  {selectedNode.detail && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                      <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold mb-0.5">Description & Role:</span>
                      {selectedNode.detail}
                    </div>
                  )}

                  {selectedNode.hash && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] flex items-center justify-between">
                      <span className="truncate mr-2">
                        <span className="text-slate-400 mr-2">SHA-256:</span>
                        <span className="text-slate-900">{selectedNode.hash}</span>
                      </span>
                      <button
                        onClick={() => handleCopyHash(selectedNode.hash || '')}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Card: Read-only W3C Selector Coordinates */}
        <div className="p-4 px-6 border-t border-slate-200 bg-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                W3C TextQuoteSelector Coordinates
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                (RFC 7089 Open Annotation Standard)
              </span>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
              Target: {activeClaim.claimCode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono-code">
            {/* Prefix */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2">
              <span className="text-slate-400 text-[10px] font-sans uppercase font-bold block mb-0.5">prefix:</span>
              <span className="text-slate-700 select-all">&ldquo;{activeClaim.selector.prefix || '(none)'}&rdquo;</span>
            </div>

            {/* Exact */}
            <div className="bg-emerald-50/70 border border-emerald-300 rounded p-2 text-emerald-950 font-semibold">
              <span className="text-emerald-700 text-[10px] font-sans uppercase font-bold block mb-0.5">exact:</span>
              <span className="select-all">&ldquo;{activeClaim.selector.exactQuote}&rdquo;</span>
            </div>

            {/* Suffix */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2">
              <span className="text-slate-400 text-[10px] font-sans uppercase font-bold block mb-0.5">suffix:</span>
              <span className="text-slate-700 select-all">&ldquo;{activeClaim.selector.suffix || '(none)'}&rdquo;</span>
            </div>
          </div>
        </div>

        {/* UI-08 Invalidation Toast */}
        {isUpstreamChanged && showInvalidationToast && (
          <div className="fixed top-20 right-6 z-50 max-w-md bg-white border border-red-300 rounded-lg shadow-xl p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-900 uppercase tracking-wide">
                    Provenance Disruption Detected
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    Root dataset <code className="bg-red-50 text-red-800 px-1 py-0.2 rounded font-mono">cohort_clinical_raw.csv</code> mutated. 1 Claim marked as <strong className="text-red-900">STALE</strong>.
                  </p>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Downstream Blast Radius: 2 claims, 1 figure.
                  </div>
                  <div className="mt-2.5 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setActiveClaimId('claim-01');
                        setViewMode('DAG');
                        setIsToastDismissed(true);
                      }}
                      className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      View Affected Claims
                    </button>
                    <button
                      onClick={handleReRun}
                      disabled={isReRunning}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors"
                    >
                      {isReRunning ? 'Re-verifying...' : 'Re-verify'}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsToastDismissed(true)}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
