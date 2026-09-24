import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { 
  Database, 
  FileCode, 
  Terminal, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  GitBranch, 
  Search,
  Filter,
  Layers
} from 'lucide-react';

import type { Artifact } from '../../types';

export const EvidenceView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    artifacts, 
    setRegisterArtifactModalOpen, 
    isUpstreamChanged 
  } = useProvenanceStore();

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [webhookConnected, setWebhookConnected] = useState(false);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const handleConnectWebhook = () => {
    setWebhookConnected(true);
    setTimeout(() => setWebhookConnected(false), 3000);
  };

  const filteredArtifacts = artifacts.filter((art) => {
    const matchesType = filterType === 'ALL' || art.type === filterType;
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getArtifactIcon = (type: Artifact['type']) => {
    switch (type) {
      case 'DATASET':
        return <Database className="w-3.5 h-3.5 text-blue-700" />;
      case 'CODE':
        return <FileCode className="w-3.5 h-3.5 text-emerald-700" />;
      case 'EXECUTION_RUN':
        return <Terminal className="w-3.5 h-3.5 text-indigo-700" />;
      case 'FIGURE':
        return <ImageIcon className="w-3.5 h-3.5 text-amber-700" />;
    }
  };

  const getTypeBadge = (type: Artifact['type']) => {
    switch (type) {
      case 'DATASET':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">DATASET</span>;
      case 'CODE':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">CODE</span>;
      case 'EXECUTION_RUN':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">EXECUTION RUN</span>;
      case 'FIGURE':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">FIGURE</span>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden select-text">
      {/* Header bar */}
      <div className="h-14 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <Database className="w-4 h-4 mr-2 text-slate-700" />
            Evidence & Artifacts Registry
          </h1>
          <p className="text-[11px] text-slate-500">
            Registered digital entities supporting research claims with cryptographic SHA-256 signatures
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Claim Evidence Studio</span>
          </Link>

          <button
            onClick={handleConnectWebhook}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors shadow-2xs ${
              webhookConnected 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span>{webhookConnected ? 'Git Webhook Connected!' : '+ Connect Git Webhook'}</span>
          </button>

          <button
            onClick={() => setRegisterArtifactModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Register Dataset File via Hash</span>
          </button>
        </div>
      </div>

      {/* Upstream Mismatch Banner if active */}
      {isUpstreamChanged && (
        <div className="bg-[#FEF2F2] border-b border-[#FECACA] px-6 py-2.5 flex items-center justify-between text-xs text-[#991B1B] animate-in slide-in-from-top-1 duration-150 shrink-0">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">
              Root Invalidation Detected:
            </span>
            <span>
              <code>cohort_clinical_raw.csv</code> content hash has diverged from canonical baseline. Downstream artifacts require re-computation.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-red-300 font-bold uppercase">
            Status: Out of Sync
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Filter Category:</span>
          {(['ALL', 'DATASET', 'CODE', 'EXECUTION_RUN', 'FIGURE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                filterType === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifacts by name or hash..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </div>

      {/* Table of Registered Entities */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Entity Type</th>
                <th className="py-3 px-4 font-semibold">Name & Description</th>
                <th className="py-3 px-4 font-semibold">Version / Commit</th>
                <th className="py-3 px-4 font-semibold">Content Hash (SHA-256)</th>
                <th className="py-3 px-4 font-semibold">Lineage Status</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArtifacts.map((art) => {
                const isMismatch = art.status === 'MISMATCH';

                return (
                  <tr
                    key={art.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isMismatch ? 'bg-red-50/40' : ''
                    }`}
                  >
                    {/* Type */}
                    <td className="py-3 px-4 align-top">
                      {getTypeBadge(art.type)}
                    </td>

                    {/* Name & Details */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center space-x-1.5 font-bold font-mono text-slate-900">
                        {getArtifactIcon(art.type)}
                        <span>{art.name}</span>
                      </div>
                      {art.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {art.description}
                        </p>
                      )}
                      {art.sizeOrDetail && (
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {art.sizeOrDetail}
                        </span>
                      )}
                    </td>

                    {/* Version / Commit */}
                    <td className="py-3 px-4 align-top font-mono text-slate-700 text-[11px]">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {art.version}
                      </span>
                    </td>

                    {/* Hash */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-mono text-[11px] truncate max-w-[180px] sm:max-w-xs ${
                            isMismatch ? 'text-red-700 font-bold' : 'text-slate-800'
                          }`}
                          title={art.hash}
                        >
                          {art.hash.slice(0, 22)}...{art.hash.slice(-8)}
                        </span>
                        <button
                          onClick={() => handleCopyHash(art.hash)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copy full SHA-256 hash"
                        >
                          {copiedHash === art.hash ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Lineage Status */}
                    <td className="py-3 px-4 align-top">
                      {isMismatch ? (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          [HASH MISMATCH: v1 -&gt; v2]
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          SYNCHRONIZED
                        </span>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-4 align-top text-slate-400 font-mono text-[11px]">
                      {art.registeredDate || '2025-05-18'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 align-top text-right">
                      <Link
                        to={`/workspace/${projectId || 'proj-oncogen-01'}/curation`}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 transition-colors shadow-2xs"
                        title="Assemble this artifact into a claim in Claim Evidence Studio"
                      >
                        <Layers className="w-3 h-3 text-indigo-600" />
                        <span>Bind to Claim</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
