import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, getStoredUser } from '../services/authService';
import { getStoredToken, removeStoredToken } from '../services/apiClient';
import type { 
  UserProfile, 
  LoginPayload, 
  RegisterPayload, 
  AuthRole 
} from '../types';

export interface AuthContextValue {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  hasRole: (roles: AuthRole | AuthRole[] | string | string[]) => boolean;
  getRedirectPathForUser: (user?: UserProfile | null) => string;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Determine standard landing page based on role
  const getRedirectPathForUser = useCallback((user?: UserProfile | null): string => {
    const targetUser = user || currentUser;
    if (!targetUser || !targetUser.roles) {
      return '/dashboard';
    }

    const rolesUpper = targetUser.roles.map(r => r.toUpperCase());

    if (rolesUpper.some(r => r.includes('ADMIN'))) {
      return '/admin/users';
    }
    if (rolesUpper.some(r => r.includes('REVIEWER') || r.includes('AUDITOR'))) {
      return '/workspace/proj-oncogen-01/audit';
    }
    if (rolesUpper.some(r => r.includes('RESEARCHER') || r.includes('AUTHOR'))) {
      return '/workspace/proj-oncogen-01/sources';
    }
    if (rolesUpper.some(r => r.includes('PRINCIPAL_INVESTIGATOR') || r.includes('PI'))) {
      return '/dashboard';
    }

    return '/dashboard';
  }, [currentUser]);

  // Check role authorization
  const hasRole = useCallback((requiredRoles: AuthRole | AuthRole[] | string | string[]): boolean => {
    if (!currentUser || !currentUser.roles) return false;

    const currentRolesUpper = currentUser.roles.map(r => {
      const clean = r.toUpperCase();
      return clean.startsWith('ROLE_') ? clean.substring(5) : clean;
    });

    const targetList = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const targetListUpper = targetList.map(r => {
      const clean = r.toUpperCase();
      return clean.startsWith('ROLE_') ? clean.substring(5) : clean;
    });

    return targetListUpper.some(required => currentRolesUpper.includes(required));
  }, [currentUser]);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const profile = await authService.getCurrentUser();
        if (isMounted) {
          setCurrentUser(profile);
          setToken(storedToken);
        }
      } catch {
        if (isMounted) {
          removeStoredToken();
          setCurrentUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    // Listen to unauthorized interceptor events
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setToken(null);
      setError('Your session has expired. Please sign in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(payload);
      setToken(result.accessToken);
      setCurrentUser(result.user);
      return result.user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.register(payload);
      setToken(result.accessToken);
      setCurrentUser(result.user);
      return result.user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check inputs.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token && !!currentUser,
    currentUser,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    getRedirectPathForUser,
    clearError
  }), [token, currentUser, isLoading, error, login, register, logout, hasRole, getRedirectPathForUser, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
