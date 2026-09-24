import React from 'react';
import { ExternalLink, GitCommit } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 px-6 md:px-12 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <div className="h-5 w-5 rounded bg-slate-900 flex items-center justify-center text-white">
              <GitCommit className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-900">ClaimTrace</span>
            <span className="text-[10px] font-mono text-slate-400">Open Provenance Protocol</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
            Cryptographic research provenance from empirical manuscript sentences to raw data artifacts. Implementing W3C Open Annotation, PROV-O, and FAIR digital object specifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <a
            href="https://www.w3.org/TR/prov-overview/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 flex items-center transition-colors"
          >
            <span>W3C PROV-O</span>
            <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
          </a>
          <a
            href="https://www.researchobject.org/ro-crate/1.1/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 flex items-center transition-colors"
          >
            <span>RO-Crate 1.1</span>
            <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
          </a>
          <a
            href="https://www.go-fair.org/fair-principles/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 flex items-center transition-colors"
          >
            <span>FAIR Principles</span>
            <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
          </a>
          <a
            href="https://publicationethics.org/guidance/Guidelines"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 flex items-center transition-colors"
          >
            <span>COPE AI Guidelines</span>
            <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
        <div>© 2025 ClaimTrace Academic Consortium. Built for reproducible science.</div>
        <div className="mt-2 sm:mt-0 font-mono">Status: All Cryptographic Signatures Valid</div>
      </div>
    </footer>
  );
};
