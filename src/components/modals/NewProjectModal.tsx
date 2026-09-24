import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { X, FolderPlus, Check, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setNewProjectModalOpen, addProject } = useProvenanceStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [leadInvestigator, setLeadInvestigator] = useState('Dr. Alice Vance');
  const [institution, setInstitution] = useState('Oncology Research Institute');
  const [domain, setDomain] = useState('Computational Oncology & Genomics');
  const [repositoryUrl, setRepositoryUrl] = useState('https://github.com/vance-lab/');
  const [description, setDescription] = useState('');

  if (!isNewProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = addProject({
      name: name.trim(),
      leadInvestigator: leadInvestigator.trim(),
      institution: institution.trim(),
      domain: domain.trim(),
      repositoryUrl: repositoryUrl.trim(),
      description: description.trim() || 'Research workspace evaluating empirical machine learning claims and provenance chains.',
      activeManuscriptVersion: 'draft_v1.0.md'
    });

    navigate(`/workspace/${newId}/sources`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-slate-200 text-slate-800 rounded">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Create New Research Workspace
              </h3>
              <p className="text-[11px] text-slate-500">
                Initialize FAIR data provenance container with RO-Crate manifest
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewProjectModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Neoantigen Affinity Deep Learning Validation"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lead Investigator (PI)
                </label>
                <input
                  type="text"
                  value={leadInvestigator}
                  onChange={(e) => setLeadInvestigator(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Affiliation / Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Research Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Computational Oncology & Genomics"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <GitBranch className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Primary Code Repository URL
              </label>
              <input
                type="url"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/consortium/study-repo"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Study Summary / Abstract Excerpt
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of research hypothesis and computational pipelines..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Initialize Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
