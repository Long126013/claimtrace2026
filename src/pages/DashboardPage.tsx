import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProvenanceStore } from '../store/useProvenanceStore';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import type { ProjectWorkspace } from '../types';
import { 
  GitCommit, 
  FolderPlus, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  User, 
  ExternalLink,
  GitBranch,
  Building,
  FileText
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setActiveProjectId, setNewProjectModalOpen } = useProvenanceStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p: ProjectWorkspace) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    navigate(`/workspace/${projectId}/sources`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 font-sans">
              ClaimTrace
            </span>
            <span className="text-[10px] font-mono text-slate-400 ml-2 hidden sm:inline">
              Research Dashboard
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Create New Research Workspace</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* User Profile Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <User className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Dr. Alice Vance
                </h1>
                <a
                  href="https://orcid.org/0000-0002-1825-0097"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  ORCID: 0000-0002-1825-0097
                  <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Oncology Research Institute
                </span>
                <span>•</span>
                <span>Role: Principal Investigator & Audit Reviewer</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-right">
            <div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {projects.length}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Total Projects
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                {projects.reduce((acc: number, p: ProjectWorkspace) => acc + p.claimsCount, 0)}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Tracked Claims
              </div>
            </div>
          </div>
        </div>

        {/* Workspace / Projects Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Research Workspaces
              </h2>
              <p className="text-xs text-slate-500">
                Reproducible research containers with connected data pipelines and claim graphs
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter projects by title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project: ProjectWorkspace) => {
              const isStale = project.healthStatus === 'HAS_STALE_CLAIMS';


              return (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Domain & Health Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[170px]">
                        {project.domain || 'Oncology'}
                      </span>

                      {isStale ? (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEF9C3] text-[#92400E] border border-[#FDE68A] shrink-0">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          1 Stale Claim Detected
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] shrink-0">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          All Claims Synchronized
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors line-clamp-2 mb-2 leading-snug">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-2 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center text-[11px]">
                        <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Active Version:
                      </span>
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {project.activeManuscriptVersion}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center text-[11px]">
                        <GitBranch className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Total Bound Claims:
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-900">
                        {project.claimsCount} claims
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-end text-xs font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal for creating new workspace */}
      <NewProjectModal />
    </div>
  );
};
