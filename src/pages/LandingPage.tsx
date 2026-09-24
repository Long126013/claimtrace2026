import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  ShieldCheck, 
  ArrowRight, 
  GitFork, 
  Database, 
  CheckCircle2, 
  FileCheck, 
  ExternalLink
} from 'lucide-react';


export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>PROV-O & RO-Crate 1.1 Specification Compliant</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
          Verifiable Research Provenance from <br className="hidden sm:inline" />
          <span className="underline decoration-slate-300 decoration-2 underline-offset-8">
            Empirical Claims
          </span> to Raw Evidence
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
          Binds moving manuscript sentences to evolving data pipelines, tracking cryptographic staleness and auditing human-in-the-loop AI decisions under COPE guidelines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm flex items-center justify-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/workspace/proj-oncogen-01/sources"
            className="w-full sm:w-auto px-6 py-3 rounded text-sm font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs flex items-center justify-center space-x-2"
          >
            <span>Explore Live Audit Demo</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </section>

      {/* Live Interactive Preview Teaser */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full mb-20">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="ml-2 text-slate-700 font-sans font-medium">ClaimTrace Interactive Workspace Preview</span>
            </div>
            <span>OncoGen AI Study • draft_v2.0.md</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
            {/* Left Preview Pane */}
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase mb-2">
                <span>W3C TextQuoteSelector Anchor</span>
                <span className="text-emerald-700 font-semibold">[SUPPORTED]</span>
              </div>
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded font-serif-prose text-slate-900 leading-relaxed mb-3">
                &ldquo;The normalization cohort yielded a verified AUROC of 0.92 (95% CI: 0.89-0.95).&rdquo;
              </div>
              <div className="font-mono-code text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                Exact text match bound to <code>cohort_clean.parquet</code> via RFC 7089 coordinates.
              </div>
            </div>

            {/* Middle Preview Pane */}
            <div className="p-5 bg-slate-50/60">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase mb-2">
                <span>Cryptographic Lineage Path</span>
                <span>SHA-256</span>
              </div>
              <div className="space-y-2 font-mono-code text-[11px]">
                <div className="flex items-center space-x-2 text-slate-800">
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  <span>cohort_clean.parquet</span>
                </div>
                <div className="pl-4 text-slate-400 text-[10px]">↳ wasGeneratedBy run_exec_001</div>
                <div className="pl-6 text-slate-400 text-[10px]">↳ used preprocess.py (#8f93b2)</div>
                <div className="pl-8 text-emerald-800 text-[10px] font-semibold">↳ used cohort_clinical_raw.csv</div>
              </div>
            </div>

            {/* Right Preview Pane */}
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase mb-2">
                <span>COPE AI Decision Audit</span>
                <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                  MODIFIED & APPROVED
                </span>
              </div>
              <div className="font-mono-code text-[10px] bg-slate-50 p-2 rounded border border-slate-200 space-y-1 mb-2">
                <div className="text-red-700 bg-red-50 px-1 rounded">- def norm(x): return x / 100</div>
                <div className="text-emerald-700 bg-emerald-50 px-1 rounded">+ def norm(x): return (x - np.mean(x)) / np.std(x)</div>
              </div>
              <div className="text-[11px] text-slate-600">
                Auditor: Dr. Alice Vance (ORCID: 0000-0002-1825-0097)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="features" className="py-16 px-6 md:px-12 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12">
          <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Foundational Capabilities
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for High-Impact Scientific Rigor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Durable W3C Anchoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Claims survive manuscript revisions using standardized W3C <code>TextQuoteSelectors</code> (exact quote, prefix context, suffix context) rather than fragile line numbers that break upon editing.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-4">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Reverse Staleness Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant upstream invalidation detection across 100k+ graph nodes. When a raw CSV changes hash, all downstream claims immediately flag as STALE with broken provenance edges.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Accountable AI Governance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Auditable human acceptance and modification records with visual Git diffs. Strictly enforces Committee on Publication Ethics (COPE) policies for synthetic code and analysis scripts.
            </p>
          </div>
        </div>
      </section>

      {/* Provenance & Standards Section */}
      <section id="provenance" className="py-16 px-6 md:px-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Interoperability
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Export One-Click W3C PROV-O & RO-Crate 1.1 Packages
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Export every claim, data entity, execution activity, and AI co-authorship ledger into an archive-grade <code>ro-crate-metadata.json</code> file. Seamlessly deposit to Zenodo, OSF, Figshare, or Nature publication repositories.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-xs font-medium text-slate-700">
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> JSON-LD Semantics</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> RFC 7089 Selectors</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> ORCID Signatures</span>
            </div>
          </div>

          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 p-5 rounded-lg shadow-2xs font-mono-code text-[11px] text-slate-700 max-w-md">
            <div className="text-slate-400 mb-2 font-bold">// Sample W3C RO-Crate Entity</div>
            <div className="text-indigo-900 font-semibold">&quot;@id&quot;: &quot;data/processed/cohort_clean.parquet&quot;,</div>
            <div className="text-slate-600">&quot;@type&quot;: [&quot;File&quot;, &quot;prov:Entity&quot;],</div>
            <div className="text-slate-600">&quot;sha256&quot;: &quot;sha256_e3b0c44298fc1c...&quot;,</div>
            <div className="text-blue-800">&quot;prov:wasGeneratedBy&quot;: &#123; &quot;@id&quot;: &quot;run_exec_001&quot; &#125;,</div>
            <div className="text-blue-800">&quot;prov:wasDerivedFrom&quot;: &#123; &quot;@id&quot;: &quot;cohort_clinical_raw.csv&quot; &#125;</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to secure claim-level reproducibility for your research?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join hundreds of research laboratories bringing verifiable cryptographic lineage and transparent AI oversight to academic publishing.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-md"
            >
              <span>Launch Research Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
