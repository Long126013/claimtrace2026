import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { AuthRole } from '../../types';

interface ProtectedRouteProps {
  requiredRoles?: AuthRole | AuthRole[] | string | string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRoles, 
  children 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8F9FA] text-slate-600 font-sans select-none">
        <div className="flex flex-col items-center space-y-3 p-6 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
          <span className="text-xs font-medium text-slate-700 font-mono">
            Verifying institutional session & security keys...
          </span>
          <span className="text-[10px] text-slate-400">
            W3C PROV-O • RFC 7089 Authorization Policy
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
