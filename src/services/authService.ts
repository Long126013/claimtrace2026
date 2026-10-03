import { 
  apiFetch, 
  setStoredToken, 
  removeStoredToken, 
  getStoredToken,
  USER_STORAGE_KEY 
} from './apiClient';
import type { 
  LoginPayload, 
  RegisterPayload, 
  AuthSuccessResponse, 
  UserProfile 
} from '../types';

// Pre-seeded demo profiles for offline fallback when backend is not running
const DEMO_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'admin@claimtrace.com': {
    password: 'Admin@123',
    profile: {
      id: 'usr-admin-01',
      email: 'admin@claimtrace.com',
      fullName: 'System Administrator',
      enabled: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
      roles: ['ROLE_ADMIN', 'ADMIN']
    }
  },
  'alice.vance@mit.edu': {
    password: 'Password@123',
    profile: {
      id: 'usr-res-01',
      email: 'alice.vance@mit.edu',
      fullName: 'Dr. Alice Vance',
      enabled: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
      roles: ['ROLE_RESEARCHER', 'RESEARCHER']
    }
  },
  'pi.smith@stanford.edu': {
    password: 'Password@123',
    profile: {
      id: 'usr-pi-01',
      email: 'pi.smith@stanford.edu',
      fullName: 'Prof. Robert Smith (PI)',
      enabled: true,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
      roles: ['ROLE_PRINCIPAL_INVESTIGATOR', 'PRINCIPAL_INVESTIGATOR']
    }
  },
  'reviewer@nature.org': {
    password: 'Password@123',
    profile: {
      id: 'usr-rev-01',
      email: 'reviewer@nature.org',
      fullName: 'Dr. Helena Chen (Auditor)',
      enabled: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
      roles: ['ROLE_REVIEWER', 'REVIEWER', 'AUDITOR']
    }
  }
};

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export const authService = {
  /**
   * Authenticate with email & password against POST /api/auth/login
   */
  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    try {
      const response = await apiFetch<AuthSuccessResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setStoredToken(response.accessToken);
      setStoredUser(response.user);
      return response;
    } catch (err: unknown) {
      // If network error (backend server offline / unreachable on 8080), check fallback
      const errorMsg = (err instanceof Error) ? err.message : String(err);
      const isNetworkError = errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('fetch');

      if (isNetworkError) {
        const demo = DEMO_USERS[payload.email.toLowerCase().trim()];
        if (demo && demo.password === payload.password) {
          const fakeToken = `mock-jwt-${demo.profile.id}-${Date.now()}`;
          const fallbackResponse: AuthSuccessResponse = {
            accessToken: fakeToken,
            tokenType: 'Bearer',
            expiresIn: 1800,
            user: demo.profile
          };
          setStoredToken(fallbackResponse.accessToken);
          setStoredUser(fallbackResponse.user);
          return fallbackResponse;
        }
      }
      throw err;
    }
  },

  /**
   * Register new account against POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
    try {
      const response = await apiFetch<AuthSuccessResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName,
          role: payload.role
        })
      });

      setStoredToken(response.accessToken);
      setStoredUser(response.user);
      return response;
    } catch (err: unknown) {
      const errorMsg = (err instanceof Error) ? err.message : String(err);
      const isNetworkError = errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('fetch');

      if (isNetworkError) {
        const normalizedRole = payload.role?.toUpperCase() || 'RESEARCHER';
        const newProfile: UserProfile = {
          id: `usr-reg-${Date.now()}`,
          email: payload.email,
          fullName: payload.fullName,
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roles: [`ROLE_${normalizedRole}`, normalizedRole]
        };

        const fakeToken = `mock-jwt-${newProfile.id}-${Date.now()}`;
        const fallbackResponse: AuthSuccessResponse = {
          accessToken: fakeToken,
          tokenType: 'Bearer',
          expiresIn: 1800,
          user: newProfile
        };

        // Cache in memory for subsequent logins
        DEMO_USERS[payload.email.toLowerCase().trim()] = {
          password: payload.password,
          profile: newProfile
        };

        setStoredToken(fallbackResponse.accessToken);
        setStoredUser(fallbackResponse.user);
        return fallbackResponse;
      }
      throw err;
    }
  },

  /**
   * Verify token and fetch current profile from GET /api/auth/me
   */
  async getCurrentUser(): Promise<UserProfile> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const profile = await apiFetch<UserProfile>('/api/auth/me');
      setStoredUser(profile);
      return profile;
    } catch (err: unknown) {
      // If token is a mock token or backend is unreachable, restore cached profile
      const cached = getStoredUser();
      if (cached && token.startsWith('mock-jwt-')) {
        return cached;
      }
      throw err;
    }
  },

  /**
   * Log out and revoke token via POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      removeStoredToken();
    }
  }
};
