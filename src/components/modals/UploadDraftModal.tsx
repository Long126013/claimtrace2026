import React, { useState } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { X, UploadCloud, FileText, Check } from 'lucide-react';

export const UploadDraftModal: React.FC = () => {
  const { isUploadDraftModalOpen, setUploadDraftModalOpen, uploadDraft } = useProvenanceStore();

  const [versionTag, setVersionTag] = useState('draft_v3.0.md');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authors, setAuthors] = useState('Alice Vance, Ph.D.¹, Erik Lindqvist, M.D.²');

  if (!isUploadDraftModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    uploadDraft(
      title.trim() || 'Revised Research Manuscript',
      versionTag.trim() || `draft_v${Date.now().toString(36)}.md`,
      content.trim(),
      authors
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Upload New Manuscript Revision
              </h3>
              <p className="text-[11px] text-slate-500">
                W3C TextQuoteSelectors automatically re-anchor against new revisions
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadDraftModalOpen(false)}
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
                  Version Identifier
                </label>
                <input
                  type="text"
                  required
                  value={versionTag}
                  onChange={(e) => setVersionTag(e.target.value)}
                  placeholder="e.g. draft_v3.0-peer-review.md"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Author Line
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Manuscript Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Robust Cross-Platform Multi-Omic Representation Learning..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Markdown Prose Content <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Plain text / Markdown</span>
              </div>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste new manuscript paragraphs or draft sections here. Claims with exactQuote text will re-anchor automatically..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 font-mono text-slate-800"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Deterministic Hashing:</span> Uploading calculates an immediate SHA-256 fingerprint for the draft revision to ensure tamper-evident reproducibility.
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={() => setUploadDraftModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Register Draft Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
