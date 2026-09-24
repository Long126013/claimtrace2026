import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { X, Database, Check } from 'lucide-react';
import type { Artifact } from '../../types';


export const RegisterArtifactModal: React.FC = () => {
  const { isRegisterArtifactModalOpen, setRegisterArtifactModalOpen, registerArtifact } = useProvenanceStore();

  const [type, setType] = useState<Artifact['type']>('DATASET');
  const [name, setName] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [hash, setHash] = useState('');
  const [sizeOrDetail, setSizeOrDetail] = useState('');
  const [description, setDescription] = useState('');

  if (!isRegisterArtifactModalOpen) return null;

  const handleGenerateRandomHash = () => {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHash(`sha256_${randomHex}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalHash = hash.trim() || `sha256_${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    registerArtifact({
      type,
      name: name.trim(),
      version: version.trim() || 'v1.0',
      hash: finalHash,
      canonicalHash: finalHash,
      sizeOrDetail: sizeOrDetail.trim() || 'Custom registered entity',
      description: description.trim() || 'Research artifact registered in ClaimTrace provenance catalog',
      relationship: type === 'CODE' ? 'used' : type === 'EXECUTION_RUN' ? 'wasGeneratedBy' : 'wasDerivedFrom'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Register Digital Lineage Entity
              </h3>
              <p className="text-[11px] text-slate-500">
                W3C PROV-O Entity / Activity cryptographic fingerprinting
              </p>
            </div>
          </div>
          <button
            onClick={() => setRegisterArtifactModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Entity Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Artifact['type'])}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 bg-white"
                >
                  <option value="DATASET">DATASET (prov:Entity)</option>
                  <option value="CODE">CODE / SCRIPT (prov:Plan)</option>
                  <option value="EXECUTION_RUN">EXECUTION RUN (prov:Activity)</option>
                  <option value="FIGURE">FIGURE / PLOT (prov:Entity)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Entity Name / File Path
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. survival_curve_km.pdf"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Version / Tag / Git Commit
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. commit #a1b2c3 or v2.0"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Size / Environment Detail
                </label>
                <input
                  type="text"
                  value={sizeOrDetail}
                  onChange={(e) => setSizeOrDetail(e.target.value)}
                  placeholder="e.g. 52.4 MB (12,000 samples)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Cryptographic Content Hash (SHA-256)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomHash}
                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-medium"
                >
                  Generate Hash
                </button>
              </div>
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description & Lineage Role
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of artifact generation, deterministic steps, or quality control parameters..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={() => setRegisterArtifactModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Register in Provenance Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
