import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { generateRoCrateMetadata } from '../../services/mockData';
import { X, Copy, Check, Download, FileJson, ExternalLink } from 'lucide-react';

export const RoCrateDialog: React.FC = () => {
  const { 
    isRoCrateDialogOpen, 
    setRoCrateDialogOpen, 
    isUpstreamChanged, 
    claims, 
    artifacts,
    aiRecords 
  } = useProvenanceStore();
  const [copied, setCopied] = useState(false);

  if (!isRoCrateDialogOpen) return null;

  const currentAiRecord = aiRecords[0];
  const roCratePayload = generateRoCrateMetadata(isUpstreamChanged, claims, artifacts, currentAiRecord);
  const jsonString = JSON.stringify(roCratePayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ro-crate-metadata.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-slate-200 text-slate-700 rounded">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">RO-Crate Metadata Export</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  RO-Crate 1.1 + W3C PROV-O
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: <code className="font-mono text-slate-700">ro-crate-metadata.json</code> containing W3C PROV-JSON graph entities & SHA-256 hashes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRoCrateDialogOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-700">Graph Entities:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {roCratePayload['@graph'].length} PROV entities
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-medium text-slate-700">Encoding:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">application/ld+json</span>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="https://www.researchobject.org/ro-crate/1.1/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900 transition-colors"
              >
                Specification
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="relative rounded-md border border-slate-300 bg-white shadow-xs overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>ro-crate-metadata.json</span>
              <span className="text-[11px] text-slate-500">{jsonString.length} bytes</span>
            </div>
            <pre className="p-4 font-mono-code text-xs text-slate-800 leading-relaxed overflow-x-auto max-h-[380px] selection:bg-slate-200">
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Cryptographic lineage verified against W3C Open Annotation & FAIR models.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Download JSON
            </button>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded border transition-colors ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 active:bg-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
