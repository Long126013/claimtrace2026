import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GitCommit, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alice.vance@oncology-res.org');
  const [password, setPassword] = useState('••••••••••••');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleOrcidSignIn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      {/* Top minimal bar */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-slate-200 bg-white">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 font-sans">
            ClaimTrace
          </span>
        </Link>
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
          ← Back to Overview
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xs p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-3 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sign in to ClaimTrace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Academic research provenance and claim audit platform
            </p>
          </div>

          {/* ORCID Single Sign-On Button */}
          <button
            onClick={handleOrcidSignIn}
            className="w-full py-2.5 px-4 rounded border border-[#A6CE39]/80 bg-[#A6CE39]/10 hover:bg-[#A6CE39]/20 text-[#2B3E11] font-medium text-xs flex items-center justify-center space-x-2.5 transition-colors mb-5"
          >
            {/* Standard ORCID Green iD icon */}
            <div className="w-5 h-5 rounded-full bg-[#A6CE39] flex items-center justify-center text-white font-bold text-[11px] leading-none">
              iD
            </div>
            <span>Sign in with ORCID iD</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium tracking-wider">
              Or use institutional email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] text-slate-500 hover:text-slate-800">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs flex items-center justify-center space-x-2 pt-2.5"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by cryptographic public key signatures and SAML / EduGAIN SSO.
          </div>
        </div>
      </main>
    </div>
  );
};
