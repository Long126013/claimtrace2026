import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, GitCommit } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, getRedirectPathForUser } = useAuth();

  const handleReturnToAllowed = () => {
    const destination = getRedirectPathForUser();
    navigate(destination);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      {/* Top minimal bar */}
      <header className="h-14 px-6 md:px-12 flex items-center justify-between border-b border-slate-200 bg-white">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 font-sans">
            ClaimTrace
          </span>
        </Link>
      </header>

      {/* Main Forbidden Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xs p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4 border border-red-200">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 uppercase font-semibold">
            HTTP 403 Forbidden
          </span>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-3">
            Access Restricted by Role Policy
          </h1>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your current account credentials do not grant authorization to view this resource. 
            Academic provenance and evidence audit logs enforce strict role segregation (RBAC).
          </p>

          {/* User Role Card */}
          {currentUser && (
            <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded text-left text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">
                Active Session Identity
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{currentUser.fullName}</span>
                <span className="text-slate-500">{currentUser.email}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center space-x-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 uppercase">Assigned Roles:</span>
                {currentUser.roles.map((r, i) => (
                  <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReturnToAllowed}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Permitted Workspace</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
