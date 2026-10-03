import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  HardDrive, 
  FolderPlus, 
  Save, 
  X,
  Server
} from 'lucide-react';
import { MOCK_AI_QUOTAS } from '../../mocks';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import type { AiQuotaConfig, AiModelApproval } from '../../types';
import { AdminHeader } from '../../components/layout/AdminHeader';

export const AiQuotasView: React.FC = () => {
  const { addProject, projects } = useProvenanceStore();
  const [quotaConfig, setQuotaConfig] = useState<AiQuotaConfig>(MOCK_AI_QUOTAS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // New Project Form state
  const [projectName, setProjectName] = useState('');
  const [leadPI, setLeadPI] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [bucketUri, setBucketUri] = useState('');

  const tokenUsagePercentage = Math.round((quotaConfig.usedTokens / quotaConfig.monthlyTokenLimit) * 100);
  const budgetUsagePercentage = Math.round((quotaConfig.usedBudgetUsd / quotaConfig.monthlyBudgetLimitUsd) * 100);

  const handleToggleModelStatus = (modelId: string) => {
    setQuotaConfig(prev => ({
      ...prev,
      approvedModels: prev.approvedModels.map(m => {
        if (m.modelId === modelId) {
          const nextStatus: AiModelApproval['approvedStatus'] = 
            m.approvedStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
          return { ...m, approvedStatus: nextStatus };
        }
        return m;
      })
    }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !leadPI) return;

    addProject({
      name: projectName,
      leadInvestigator: leadPI,
      institution: 'Academic Research Consortium',
      activeManuscriptVersion: 'v1.0-draft',
      description,
      repositoryUrl: repoUrl || undefined
    });

    setIsNewProjectModalOpen(false);
    setProjectName('');
    setLeadPI('');
    setDescription('');
    setRepoUrl('');
    setBucketUri('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] overflow-y-auto select-text text-slate-900">
      {/* Global Admin Header */}
      <AdminHeader />

      {/* Top Header */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-purple-50 text-purple-700 rounded border border-purple-200">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>AI Quotas & Project Provisioning</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                    UI-02
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure LLM provider endpoints, manage approved models, set monthly token quotas, and provision projects.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Quota policy updated!
              </span>
            )}
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Provision Research Project</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Token Usage Card */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wide">Monthly Token Limit</span>
              <HardDrive className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {(quotaConfig.usedTokens / 1000000).toFixed(2)}M / {(quotaConfig.monthlyTokenLimit / 1000000).toFixed(1)}M
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${tokenUsagePercentage > 85 ? 'bg-amber-500' : 'bg-purple-600'}`}
                style={{ width: `${tokenUsagePercentage}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>{tokenUsagePercentage}% utilized</span>
              <span className="font-mono">{quotaConfig.requestCount} API calls</span>
            </div>
          </div>

          {/* Budget Limit Card */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wide">Financial Quota (USD)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              ${quotaConfig.usedBudgetUsd.toFixed(2)} / ${quotaConfig.monthlyBudgetLimitUsd.toFixed(2)}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-600"
                style={{ width: `${budgetUsagePercentage}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>{budgetUsagePercentage}% consumed</span>
              <span>Billing Cycle: Monthly</span>
            </div>
          </div>

          {/* Active Projects Scope */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wide">Target Project Scope</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {quotaConfig.projectName}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              All LLM interaction logs across this project are subject to mandatory COPE 2023 human oversight.
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              Total Workspaces: {projects.length}
            </div>
          </div>
        </div>

        {/* Provider Endpoints & Limits Form */}
        <form onSubmit={handleSaveConfig} className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-700" />
                <span>AI Gateway Provider Endpoints & Safeguards</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Specify secure enterprise gateway endpoints to prevent data leakage and enforce audit logging.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Safeguards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Primary API Gateway Endpoint:
              </label>
              <input
                type="text"
                value={quotaConfig.providerEndpoints.primary}
                onChange={(e) => setQuotaConfig({
                  ...quotaConfig,
                  providerEndpoints: { ...quotaConfig.providerEndpoints, primary: e.target.value }
                })}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Secondary / Fallback Endpoint (Optional):
              </label>
              <input
                type="text"
                value={quotaConfig.providerEndpoints.backup || ''}
                onChange={(e) => setQuotaConfig({
                  ...quotaConfig,
                  providerEndpoints: { ...quotaConfig.providerEndpoints, backup: e.target.value }
                })}
                placeholder="https://fallback.gateway.internal/v1"
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
          </div>
        </form>

        {/* Approved Models Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Approved Foundational Models
              </h2>
              <p className="text-[11px] text-slate-500">
                Only approved models can be invoked via the co-authorship ledger or code assistance.
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Model Identifier</th>
                <th className="py-3 px-4 font-semibold">Provider</th>
                <th className="py-3 px-4 font-semibold">Context Window</th>
                <th className="py-3 px-4 font-semibold">Cost / 1k Tokens</th>
                <th className="py-3 px-4 font-semibold">Policy Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotaConfig.approvedModels.map((m) => {
                const isApproved = m.approvedStatus === 'APPROVED';
                return (
                  <tr key={m.modelId} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 align-middle">
                      <div className="font-semibold text-slate-900 font-mono">{m.modelId}</div>
                      <div className="text-[11px] text-slate-500">{m.description}</div>
                    </td>

                    <td className="py-3 px-4 align-middle font-medium text-slate-700">
                      {m.provider}
                    </td>

                    <td className="py-3 px-4 align-middle font-mono text-slate-600">
                      {(m.maxContextTokens / 1000).toLocaleString()}k tokens
                    </td>

                    <td className="py-3 px-4 align-middle font-mono text-slate-600">
                      ${m.costPer1kTokensUsd.toFixed(4)}
                    </td>

                    <td className="py-3 px-4 align-middle">
                      {isApproved ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          APPROVED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 align-middle text-right">
                      <button
                        onClick={() => handleToggleModelStatus(m.modelId)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                          isApproved
                            ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {isApproved ? 'Suspend' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Research Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <FolderPlus className="w-4 h-4 text-slate-700" />
                <span>Provision New Research Project</span>
              </h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ImmunoTrace: Single-Cell Spatial Transcriptomics"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Principal Investigator (PI):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. David Baltimore"
                  value={leadPI}
                  onChange={(e) => setLeadPI(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Scope & Abstract:</label>
                <textarea
                  rows={2}
                  placeholder="Summary of research scope and methodological hypotheses..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">External Git Repository:</label>
                  <input
                    type="url"
                    placeholder="https://github.com/lab/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Store (S3 / GCS):</label>
                  <input
                    type="text"
                    placeholder="s3://lab-genomics-bucket"
                    value={bucketUri}
                    onChange={(e) => setBucketUri(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                >
                  Provision Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
