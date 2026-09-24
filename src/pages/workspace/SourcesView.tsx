import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProvenanceStore } from '../../store/useProvenanceStore';
import { 
  FileText, 
  UploadCloud, 
  BookmarkPlus, 
  CheckCircle, 
  AlertCircle, 
  Hash, 
  Copy, 
  Check, 
  Info,
  Clock,
  Highlighter
} from 'lucide-react';
import type { Claim, W3CSelector } from '../../types';

interface SelectionCoords {
  top: number;
  left: number;
  selector: W3CSelector;
}

export const SourcesView: React.FC = () => {
  const { 
    manuscripts, 
    activeManuscriptId, 
    setActiveManuscriptId, 
    claims, 
    activeClaimId, 
    setActiveClaimId, 
    setPendingBinding,
    setUploadDraftModalOpen 
  } = useProvenanceStore();

  const [selectionPopup, setSelectionPopup] = useState<SelectionCoords | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDraft = manuscripts.find((m) => m.id === activeManuscriptId) || manuscripts[0];

  // Clear popup when mouse clicking elsewhere
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.bind-trigger-btn')) return;
      if (window.getSelection()?.isCollapsed) {
        setSelectionPopup(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // W3C TextQuoteSelector calculation on mouse up
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionPopup(null);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 5) {
      setSelectionPopup(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !container.contains(range.commonAncestorContainer)) {
      setSelectionPopup(null);
      return;
    }

    const startNode = range.startContainer.parentElement;
    const endNode = range.endContainer.parentElement;
    if (startNode?.closest('.claim-highlight') || endNode?.closest('.claim-highlight')) {
      setSelectionPopup(null);
      return;
    }

    const fullText = container.innerText || '';
    const exactIndex = fullText.indexOf(selectedText);
    let prefix = '';
    let suffix = '';

    if (exactIndex !== -1) {
      const prefixStart = Math.max(0, exactIndex - 35);
      prefix = fullText.slice(prefixStart, exactIndex);
      const suffixEnd = Math.min(fullText.length, exactIndex + selectedText.length + 35);
      suffix = fullText.slice(exactIndex + selectedText.length, suffixEnd);
    }

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setSelectionPopup({
      top: rect.top - containerRect.top - 36,
      left: Math.max(10, rect.left - containerRect.left + (rect.width / 2) - 60),
      selector: {
        exactQuote: selectedText,
        prefix,
        suffix
      }
    });
  }, []);

  const handleOpenBindingModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectionPopup) {
      setPendingBinding(selectionPopup.selector);
      setSelectionPopup(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  // Helper to segment paragraph text by bound claims
  const renderParagraphContent = (text: string) => {
    const matches: Array<{ claim: Claim; start: number; end: number }> = [];

    claims.forEach((claim) => {
      const index = text.indexOf(claim.selector.exactQuote);
      if (index !== -1) {
        matches.push({
          claim,
          start: index,
          end: index + claim.selector.exactQuote.length
        });
      }
    });

    if (matches.length === 0) {
      return text;
    }

    matches.sort((a, b) => a.start - b.start);

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach(({ claim, start, end }, i) => {
      if (start > lastIndex) {
        segments.push(
          <span key={`text-${i}`}>{text.substring(lastIndex, start)}</span>
        );
      }

      const isActive = claim.id === activeClaimId;
      const isStale = claim.status === 'STALE';
      const isBroken = claim.status === 'BROKEN';

      let statusClasses = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#D1FAE5]';
      let badgeLabel = 'SUPPORTED';
      let badgeClasses = 'bg-[#065F46] text-white';

      if (isStale) {
        statusClasses = 'bg-[#FEF9C3] text-[#92400E] border-[#FDE68A] hover:bg-[#FEF08A]';
        badgeLabel = 'STALE';
        badgeClasses = 'bg-[#92400E] text-white';
      } else if (isBroken) {
        statusClasses = 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] hover:bg-[#FEE2E2]';
        badgeLabel = 'BROKEN';
        badgeClasses = 'bg-[#991B1B] text-white';
      }

      segments.push(
        <span
          key={claim.id}
          onClick={(e) => {
            e.stopPropagation();
            setActiveClaimId(claim.id);
          }}
          className={`claim-highlight inline-block px-1 py-0.5 my-0.5 mx-0.5 rounded border text-inherit transition-all cursor-pointer select-text relative font-serif-prose ${statusClasses} ${
            isActive ? 'ring-2 ring-slate-800 shadow-xs' : ''
          }`}
          title={`Click to inspect evidence lineage for ${claim.claimCode} (${claim.status})`}
        >
          <span>{claim.selector.exactQuote}</span>
          <span
            className={`inline-flex items-center ml-1.5 px-1 py-0.2 rounded font-mono text-[9px] font-bold uppercase tracking-wider align-middle select-none ${badgeClasses}`}
          >
            {isStale && <AlertCircle className="w-2.5 h-2.5 mr-0.5 inline" />}
            {!isStale && !isBroken && <CheckCircle className="w-2.5 h-2.5 mr-0.5 inline" />}
            [{claim.claimCode}: {badgeLabel}]
          </span>
        </span>
      );

      lastIndex = end;
    });

    if (lastIndex < text.length) {
      segments.push(
        <span key="text-end">{text.substring(lastIndex)}</span>
      );
    }

    return segments;
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#F8F9FA] overflow-hidden select-text">
      {/* Left Panel: Version Sidebar (25% on desktop) */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Manuscript Versions
            </h2>
            <p className="text-[11px] text-slate-500">
              Deterministic revision history
            </p>
          </div>
          <button
            onClick={() => setUploadDraftModalOpen(true)}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>+ Upload</span>
          </button>
        </div>

        {/* Revisions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {manuscripts.map((m) => {
            const isSelected = m.id === activeManuscriptId;

            return (
              <div
                key={m.id}
                onClick={() => setActiveManuscriptId(m.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-slate-800 bg-slate-50/80 ring-1 ring-slate-800 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-slate-900 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {m.versionTag}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-white uppercase font-bold">
                      Active
                    </span>
                  )}
                </div>

                <div className="font-medium text-slate-800 line-clamp-1 mb-1">
                  {m.title}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {m.uploadedAt}
                  </span>
                  <span>{m.wordCount} words</span>
                </div>

                {/* Fingerprint */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span className="truncate mr-2">
                    SHA: {m.contentHash.slice(0, 14)}...
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyHash(m.contentHash);
                    }}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy full SHA-256 fingerprint"
                  >
                    {copiedHash === m.contentHash ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5 mb-1 font-medium text-slate-700">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>W3C Text Quote Resiliency</span>
          </div>
          <span>
            Anchors tolerate minor wording adjustments and line rearrangements across drafts.
          </span>
        </div>
      </aside>

      {/* Right Panel: Document Reader & W3C Anchoring (75% on desktop) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Reader Action Toolbar */}
        <div className="h-10 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-800 uppercase tracking-wider">
              Manuscript Reader
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-slate-600">{activeDraft.versionTag}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center text-slate-600 font-medium">
              <Highlighter className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Highlight text to assert claim
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {claims.length} Registered Claims
            </span>
          </div>
        </div>

        {/* A4 Document Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div
            ref={containerRef}
            onMouseUp={handleMouseUp}
            className="relative w-full max-w-[820px] bg-white border border-slate-200 rounded-sm shadow-xs p-8 md:p-14 mb-12 font-serif-prose text-[#111827]"
          >
            {/* Floating W3C Claim Binding Trigger Button */}
            {selectionPopup && (
              <div
                style={{
                  top: `${selectionPopup.top}px`,
                  left: `${selectionPopup.left}px`
                }}
                className="absolute z-30 bind-trigger-btn animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={handleOpenBindingModal}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-sans font-medium rounded shadow-md hover:bg-slate-800 transition-all border border-slate-700"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Assert as Claim</span>
                </button>
              </div>
            )}

            {/* Paper Header */}
            <div className="border-b border-slate-200 pb-6 mb-6 text-center select-text font-sans">
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">
                OncoGen Consortium Pre-Print • Audited Draft
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-3 font-serif-prose">
                {activeDraft.title}
              </h1>
              <p className="text-xs text-slate-600 mb-1">
                {activeDraft.authors || 'Dr. Alice Vance et al.'}
              </p>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 mt-2">
                <span>DOI: {activeDraft.doi || '10.1101/2025.04.12.589104'}</span>
                <span>•</span>
                <span>SHA-256: {activeDraft.contentHash.slice(0, 18)}...</span>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6 text-[14px] md:text-[15px] leading-relaxed select-text">
              {activeDraft.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-justify text-[#111827] leading-relaxed">
                  {renderParagraphContent(paragraph)}
                </p>
              ))}
            </div>

            {/* Paper Footer */}
            <div className="mt-12 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-sans">
              <div className="flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Text quotes are anchored using RFC 7089 exact/prefix/suffix selectors.</span>
              </div>
              <span className="font-mono">Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
