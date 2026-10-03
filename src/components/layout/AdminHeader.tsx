import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GitCommit, 
  Users, 
  Cpu, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Shield 
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Branding & Section Title */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:opacity-85 transition-opacity">
          <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 font-sans">
            ClaimTrace
          </span>
        </Link>

        <span className="text-slate-300">/</span>

        <div className="flex items-center space-x-1.5 text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold font-mono">
          <Shield className="w-3 h-3 text-purple-600" />
          <span>ADMIN PORTAL</span>
        </div>
      </div>

      {/* Middle: Admin Sub-Tabs */}
      <nav className="hidden md:flex items-center space-x-1 text-xs">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
              isActive
                ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }`
          }
        >
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>User Management (UI-01)</span>
        </NavLink>

        <NavLink
          to="/admin/quotas"
          className={({ isActive }) =>
            `flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
              isActive
                ? 'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }`
          }
        >
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>AI Quotas & Provisioning (UI-02)</span>
        </NavLink>

        <span className="text-slate-200 px-1">|</span>

        <Link
          to="/dashboard"
          className="flex items-center space-x-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LayoutDashboard className="w-3 h-3 text-slate-400" />
          <span>Workspaces</span>
        </Link>

        <Link
          to="/workspace/proj-oncogen-01/sources"
          className="flex items-center space-x-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <FileText className="w-3 h-3 text-slate-400" />
          <span>Manuscript</span>
        </Link>
      </nav>

      {/* Right: User Chip & Logout Button */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-right">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.fullName || 'System Administrator'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
              {currentUser?.roles[0]?.replace('ROLE_', '') || 'ADMIN'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out of session"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
