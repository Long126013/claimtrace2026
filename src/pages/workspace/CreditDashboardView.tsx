import React, { useState } from 'react';
import { 
  Award, 
  Package, 
  FileJson, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  X,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { MOCK_CREDIT_CONTRIBUTORS } from '../../mocks';
import { generateRoCrateMetadata } from '../../services/mockData';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import type { CreditRole, CreditContributor, RoCrateExportProgress } from '../../types';

const CREDIT_ROLES_LIST: CreditRole[] = [
  'Conceptualization',
  'Data Curation',
  'Formal Analysis',
  'Funding Acquisition',
  'Investigation',
  'Methodology',
  'Project Administration',
  'Resources',
  'Software',
  'Supervision',
  'Validation',
  'Visualization',
  'Writing – Original Draft',
  'Writing – Review & Editing'
];

export const CreditDashboardView: React.FC = () => {
  const { claims, artifacts, aiRecords, isUpstreamChanged } = useProvenanceStore();
  const [contributors] = useState<CreditContributor[]>(MOCK_CREDIT_CONTRIBUTORS);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Export progress modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'RO_CRATE' | 'PROV_JSON'>('RO_CRATE');
  const [exportProgress, setExportProgress] = useState<RoCrateExportProgress>({
    step: 'IDLE',
    percentage: 0,
    message: ''
  });

  const handleStartExport = (type: 'RO_CRATE' | 'PROV_JSON') => {
    setExportType(type);
    setExportModalOpen(true);
    setExportProgress({
      step: 'HASHING_ENTITIES',
      percentage: 25,
      message: 'Computing canonical SHA-256 byte hashes for 14 dataset & figure artifacts...'
    });

    setTimeout(() => {
      setExportProgress({
        step: 'BUILDING_JSONLD',
        percentage: 60,
        message: 'Serializing W3C PROV-O ontology & RO-Crate 1.1 JSON-LD context...'
      });
    }, 700);

    setTimeout(() => {
      setExportProgress({
        step: 'PACKAGING_ZIP',
        percentage: 90,
        message: 'Bundling metadata manifest and data descriptors into crate package...'
      });
    }, 1400);

    setTimeout(() => {
      setExportProgress({
        step: 'READY',
        percentage: 100,
        message: 'RO-Crate 1.1 Research Object package validated and ready for archive!'
      });
    }, 2000);
  };

  const handleDownloadPayload = () => {
    const jsonLd = generateRoCrateMetadata(
      isUpstreamChanged, 
      claims, 
      artifacts, 
      aiRecords[0]
    );

    const blob = new Blob([JSON.stringify(jsonLd, null, 2)], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportType === 'RO_CRATE' ? 'ro-crate-metadata.json' : 'prov-lineage.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-y-auto select-text text-slate-900">
      {/* Top Banner Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>CRediT Contributor Taxonomy & RO-Crate Exporter</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  UI-10
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized 14-role contributor attribution (CRediT), AI co-authorship disclosure, and archival research object packaging.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStartExport('PROV_JSON')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-500" />
              <span>Export PROV-JSON</span>
            </button>

            <button
              onClick={() => handleStartExport('RO_CRATE')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Package className="w-3.5 h-3.5 text-white" />
              <span>Export RO-Crate 1.1</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* COPE 2023 AI Transparency Callout */}
        <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 block">
                COPE 2023 / ICMJE Compliant AI Transparency Policy
              </span>
              <p className="text-emerald-900/90 text-[11px] mt-0.5">
                AI generative tools cannot be designated as study co-authors. All machine assistance is formally declared under the 'Software' role with full prompt fingerprint logs.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-800 font-bold uppercase shrink-0">
            Audit Ready: 100%
          </span>
        </div>

        {/* CRediT 14-Role Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contributor Roles Taxonomy (CRediT Matrix)
              </h2>
              <p className="text-[11px] text-slate-500">
                Detailed breakdown across all 14 standardized academic contribution categories.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Highlight Role:</span>
              <select
                aria-label="Highlight Role"
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="p-1 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="ALL">Show All 14 Roles</option>
                {CREDIT_ROLES_LIST.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold sticky left-0 bg-slate-50 min-w-[200px]">
                    Author / Contributor
                  </th>
                  {CREDIT_ROLES_LIST.map(role => (
                    <th
                      key={role}
                      className={`py-3 px-2 text-center font-semibold whitespace-nowrap ${
                        selectedRoleFilter === role ? 'bg-purple-100 text-purple-900' : ''
                      }`}
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {contributors.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-medium text-slate-900 sticky left-0 bg-white">
                      <div className="flex items-center space-x-2">
                        {c.isAi ? (
                          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {c.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.isAi && (
                              <span className="font-mono text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                                AI ASSISTANT
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {c.institution}
                          </div>
                        </div>
                      </div>
                    </td>

                    {CREDIT_ROLES_LIST.map(role => {
                      const hasRole = c.roles.includes(role);
                      const isHighlighted = selectedRoleFilter === role;
                      return (
                        <td
                          key={role}
                          className={`py-3 px-2 text-center align-middle ${
                            isHighlighted ? 'bg-purple-50/40' : ''
                          }`}
                        >
                          {hasRole ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-200">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Transparency Declarations Box */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Formal Manuscript Co-Authorship Transparency Statement</span>
          </h3>
          <p className="text-xs text-slate-700 font-serif leading-relaxed italic bg-slate-50 p-4 rounded border border-slate-200">
            "The authors confirm that during the preparation of this work, Generative AI (OpenAI GPT-4o-2024-05-13) was utilized solely for computational loop vectorization in preprocess.py and initial draft formatting of Table 2 under human supervisory direction. All machine outputs were critically verified and reproduced by Dr. Marcus Vance and Prof. Elena Rostova. The AI tool is not listed as an author in accordance with COPE 2023 recommendations."
          </p>
        </div>
      </div>

      {/* Export RO-Crate Simulation Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-slate-700" />
                <span>
                  {exportType === 'RO_CRATE' ? 'Export RO-Crate 1.1 Package' : 'Export W3C PROV-JSON'}
                </span>
              </h3>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-slate-800">
                    {exportProgress.step === 'READY' ? 'Packaging Completed' : 'Assembling Crate...'}
                  </span>
                  <span>{exportProgress.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 transition-all duration-300"
                    style={{ width: `${exportProgress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {exportProgress.message}
                </p>
              </div>

              {exportProgress.step === 'READY' ? (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-950">
                    Validation Passed (RO-Crate v1.1 Compliant)
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Contains 4 claims, 14 artifacts, 4 AI prompt records, and complete W3C PROV-O JSON-LD ontology.
                  </p>
                  <button
                    onClick={handleDownloadPayload}
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {exportType === 'RO_CRATE' ? 'ro-crate-metadata.json' : 'prov-lineage.json'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  <span>Packaging Research Objects...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
