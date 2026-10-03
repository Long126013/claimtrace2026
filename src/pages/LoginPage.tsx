import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GitCommit, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, getRedirectPathForUser, error: authError, clearError } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('admin@claimtrace.com');
  const [password, setPassword] = useState('Admin@123');
  const [fullName, setFullName] = useState('Dr. Alice Vance');
  const [role, setRole] = useState<'RESEARCHER' | 'PRINCIPAL_INVESTIGATOR' | 'REVIEWER'>('RESEARCHER');

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for review/testing
  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    setIsSubmitting(true);

    try {
      if (mode === 'LOGIN') {
        const user = await login({ email, password });
        // Redirect to intended route or role-specific destination
        const fromState = (location.state as { from?: { pathname?: string } })?.from?.pathname;
        const target = fromState || getRedirectPathForUser(user);
        navigate(target, { replace: true });
      } else {
        const user = await register({ email, password, fullName, role });
        setSuccessMessage('Account registered successfully! Redirecting to workspace...');
        setTimeout(() => {
          const target = getRedirectPathForUser(user);
          navigate(target, { replace: true });
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrcidSignIn = async () => {
    fillCredentials('alice.vance@mit.edu', 'Password@123');
    setIsSubmitting(true);
    try {
      const user = await login({ email: 'alice.vance@mit.edu', password: 'Password@123' });
      navigate(getRedirectPathForUser(user), { replace: true });
    } catch {
      setLocalError('ORCID Federated Single Sign-On failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError;

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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xs p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-2 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {mode === 'LOGIN' ? 'Sign In to ClaimTrace' : 'Create Academic Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Scientific Claim Provenance & Traceability System (W3C PROV-O)
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setLocalError(null);
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
                mode === 'LOGIN'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setLocalError(null);
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
                mode === 'REGISTER'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Banners */}
          {activeError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start space-x-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{activeError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start space-x-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ORCID Single Sign-On Button (in Login mode) */}
          {mode === 'LOGIN' && (
            <>
              <button
                type="button"
                onClick={handleOrcidSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded border border-[#A6CE39]/80 bg-[#A6CE39]/10 hover:bg-[#A6CE39]/20 text-[#2B3E11] font-medium text-xs flex items-center justify-center space-x-2.5 transition-colors mb-4 disabled:opacity-50"
              >
                <div className="w-4 h-4 rounded-full bg-[#A6CE39] flex items-center justify-center text-white font-bold text-[10px] leading-none">
                  iD
                </div>
                <span>Sign in with ORCID iD</span>
              </button>

              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] text-slate-400 uppercase font-mono font-medium tracking-wider">
                  Or institutional credentials
                </span>
              </div>
            </>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name & Academic Title
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
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
                {mode === 'LOGIN' && (
                  <span className="text-[11px] text-slate-400">
                    Min. 6 chars
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
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

            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Research Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-800 bg-white"
                >
                  <option value="RESEARCHER">Researcher / Contributing Author</option>
                  <option value="PRINCIPAL_INVESTIGATOR">Principal Investigator (PI)</option>
                  <option value="REVIEWER">Independent Auditor / Reviewer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-2xs flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authenticating with Backend...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'LOGIN' ? 'Sign In to Workspace' : 'Create Account & Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px]">
            <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Quick Demo Credentials (1-Click Fill):</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => fillCredentials('admin@claimtrace.com', 'Admin@123')}
                className="p-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded text-left transition-colors"
                title="Admin -> UI-01 Users & UI-02 Quotas"
              >
                <div className="font-bold text-slate-900">Admin</div>
                <div className="text-slate-500 truncate">admin@claimtrace.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('alice.vance@mit.edu', 'Password@123')}
                className="p-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded text-left transition-colors"
                title="Researcher -> UI-05 Manuscript & UI-03 Evidence"
              >
                <div className="font-bold text-slate-900">Researcher</div>
                <div className="text-slate-500 truncate">alice.vance@mit.edu</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('reviewer@nature.org', 'Password@123')}
                className="p-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded text-left transition-colors"
                title="Auditor -> UI-09 Redacted Audit & UI-07 DAG"
              >
                <div className="font-bold text-slate-900">Auditor</div>
                <div className="text-slate-500 truncate">reviewer@nature.org</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('pi.smith@stanford.edu', 'Password@123')}
                className="p-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded text-left transition-colors"
                title="PI -> Dashboard & Quotas"
              >
                <div className="font-bold text-slate-900">PI (Lead)</div>
                <div className="text-slate-500 truncate">pi.smith@stanford.edu</div>
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
            Signed by Spring Boot IAM JWT • HMAC-SHA256 • RFC 7519
          </div>
        </div>
      </main>
    </div>
  );
};
