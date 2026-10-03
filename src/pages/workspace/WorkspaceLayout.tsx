import React, { useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { RoCrateDialog } from '../../components/layout/RoCrateDialog';
import { BindClaimModal } from '../../components/modals/BindClaimModal';
import { UploadDraftModal } from '../../components/modals/UploadDraftModal';
import { RegisterArtifactModal } from '../../components/modals/RegisterArtifactModal';
import { SimulateAiPromptModal } from '../../components/modals/SimulateAiPromptModal';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { 
  FileText, 
  Database, 
  ShieldCheck, 
  GitFork, 
  AlertTriangle,
  Layers,
  Sparkles,
  GitCompare,
  EyeOff,
  Award
} from 'lucide-react';

export const WorkspaceLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    setActiveProjectId, 
    claims, 
    artifacts, 
    aiRecords 
  } = useProvenanceStore();


  useEffect(() => {
    if (projectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId, setActiveProjectId]);

  const staleClaimsCount = claims.filter(c => c.status === 'STALE').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8F9FA] text-[#111827] overflow-hidden antialiased">
      {/* Global Persistent Workspace Header */}
      <Header />

      {/* Sub-Navigation Tabs Bar */}
      <nav className="h-11 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none overflow-x-auto">
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs overflow-x-auto py-1">
          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/sources`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Manuscript</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {claims.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/evidence`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Evidence</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {artifacts.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/ai-governance`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI COPE</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {aiRecords.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/triage`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-purple-50 text-purple-900 border-purple-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Triage</span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/diff`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-600" />
            <span>Diff & Anchors</span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            <span>Studio</span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/lineage-trees`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <GitFork className="w-3.5 h-3.5 text-slate-500" />
            <span>Lineage Trees</span>
            {staleClaimsCount > 0 ? (
              <span className="text-[10px] font-mono bg-[#FEF9C3] text-[#92400E] px-1.5 py-0.2 rounded border border-[#FDE68A] font-bold flex items-center">
                <AlertTriangle className="w-2.5 h-2.5 mr-0.5 inline" />
                {staleClaimsCount} STALE
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                SYNCED
              </span>
            )}
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/audit`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-rose-50 text-rose-900 border-rose-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
            <span>Audit View</span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/credit`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm font-medium transition-colors border whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>CRediT Matrix</span>
          </NavLink>
        </div>

        {/* Right contextual info */}
        <div className="hidden xl:flex items-center space-x-3 text-xs text-slate-500 pl-2">
          <span className="font-mono text-[11px] whitespace-nowrap">
            W3C RFC 7089 • PROV-O
          </span>
        </div>
      </nav>

      {/* Main Routed Sub-View */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Global Interactive Modals */}
      <RoCrateDialog />
      <BindClaimModal />
      <UploadDraftModal />
      <RegisterArtifactModal />
      <SimulateAiPromptModal />
    </div>
  );
};
