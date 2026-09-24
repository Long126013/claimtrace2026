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
  Layers
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
      <nav className="h-11 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs overflow-x-auto py-1">
          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/sources`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Manuscript & Versioning</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {claims.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/evidence`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Evidence & Artifacts</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {artifacts.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/ai-governance`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Interaction & COPE Audit</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
              {aiRecords.length}
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            <span>Claim Evidence Studio</span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-indigo-200 text-indigo-700 font-semibold">
              AUTHORING
            </span>
          </NavLink>

          <NavLink
            to={`/workspace/${projectId || 'proj-oncogen-01'}/lineage-trees`}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <GitFork className="w-3.5 h-3.5 text-slate-500" />
            <span>Lineage Trees & Claims</span>
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
        </div>

        {/* Right contextual info */}
        <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            W3C Open Annotation RFC 7089 • PROV-O
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
