import React from 'react';
import { Link } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { 
  GitCommit, 
  Share2, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    projects,
    activeProjectId,
    manuscripts,
    activeManuscriptId,
    isUpstreamChanged, 
    toggleUpstreamChanged, 
    setRoCrateDialogOpen,
    resetAll
  } = useProvenanceStore();

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const currentManuscript = manuscripts.find(m => m.id === activeManuscriptId) || manuscripts[0];

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Branding & Contextual Breadcrumb */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:opacity-85 transition-opacity">
          <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 font-sans hidden sm:inline">
            ClaimTrace
          </span>
        </Link>

        <span className="text-slate-300">/</span>

        {/* Breadcrumb to Dashboard */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-600">
          <Link 
            to="/dashboard"
            className="flex items-center hover:text-slate-900 text-slate-500 font-medium transition-colors"
          >
            <LayoutDashboard className="w-3 h-3 mr-1" />
            <span>Workspaces</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-900 max-w-[180px] sm:max-w-xs truncate" title={currentProject.name}>
            {currentProject.name.split(':')[0]}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
          <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 hidden sm:inline">
            {currentManuscript.versionTag}
          </span>
        </div>
      </div>

      {/* Right: Controls & Global Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center mr-1">
          {isUpstreamChanged ? (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-200 transition-all">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>⚠️ 1 Broken Provenance Edge (Stale Claim)</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 transition-all">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>● All nodes synchronized</span>
            </div>
          )}
        </div>

        {/* Primary Simulation Toggle */}
        <button
          onClick={toggleUpstreamChanged}
          title={isUpstreamChanged ? "Restore original upstream dataset" : "Simulate mutation in root dataset cohort_clinical_raw.csv"}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors shadow-2xs ${
            isUpstreamChanged
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isUpstreamChanged ? 'text-amber-600 fill-amber-500' : 'text-amber-500'}`} />
          <span className="font-sans font-medium">
            {isUpstreamChanged ? '⚡ Revert Dataset (v2 → v1)' : '⚡ Simulate Upstream Data Change (v1 -> v2)'}
          </span>
        </button>

        {/* RO-Crate Export Dialog Trigger */}
        <button
          onClick={() => setRoCrateDialogOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-300" />
          <span>Export RO-Crate (JSON-LD)</span>
        </button>

        {/* Subtle Reset state */}
        <button
          onClick={resetAll}
          title="Reset workspace state"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
