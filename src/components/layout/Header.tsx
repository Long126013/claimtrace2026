import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { useAuth } from '../../context/AuthContext';
import { 
  GitCommit, 
  Share2, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  LayoutDashboard,
  Shield,
  Users,
  Cpu,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, hasRole } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

        {/* Admin Portal Dropdown (RBAC Protected: ADMIN only) */}
        {hasRole(['ADMIN', 'ROLE_ADMIN']) && (
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Admin</span>
            </button>
            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-md hidden group-hover:block z-50 py-1 font-sans">
              <Link 
                to="/admin/users" 
                className="flex items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Users className="w-3.5 h-3.5 mr-2 text-slate-500" />
                <span>User Management (UI-01)</span>
              </Link>
              <Link 
                to="/admin/quotas" 
                className="flex items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-t border-slate-100"
              >
                <Cpu className="w-3.5 h-3.5 mr-2 text-slate-500" />
                <span>AI Quotas & Provisioning (UI-02)</span>
              </Link>
            </div>
          </div>
        )}

        {/* Subtle Reset state */}
        <button
          onClick={resetAll}
          title="Reset workspace state"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* User Identity Chip & Logout Action */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                {currentUser.roles[0]?.replace('ROLE_', '') || 'RESEARCHER'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Log out of session"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};
