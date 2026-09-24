import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitCommit, ArrowRight, ShieldCheck, FileCheck2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="h-16 border-b border-slate-200 bg-white px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <Link to="/" className="flex items-center space-x-2.5">
        <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
          <GitCommit className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-base tracking-tight text-slate-900 font-sans">
            ClaimTrace
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            v2.0
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-600">
        <a href="#features" className="hover:text-slate-900 transition-colors">
          Features
        </a>
        <a href="#provenance" className="hover:text-slate-900 transition-colors">
          Provenance Model
        </a>
        <a href="#cope" className="hover:text-slate-900 transition-colors flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700" />
          COPE Ethics
        </a>
        <a href="#docs" className="hover:text-slate-900 transition-colors flex items-center">
          <FileCheck2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Documentation
        </a>
      </div>

      {/* CTA Button */}
      <div className="flex items-center space-x-3">
        {location.pathname !== '/login' && (
          <Link
            to="/login"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded transition-colors"
          >
            Sign In
          </Link>
        )}
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs"
        >
          <span>Launch Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
};
