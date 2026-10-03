/**
 * ClaimTrace Academic Research IAM Data Contracts
 * Defines TypeScript interfaces matching Spring Boot IAM backend entities.
 */

export type AuthRole = 'ADMIN' | 'PRINCIPAL_INVESTIGATOR' | 'RESEARCHER' | 'REVIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[]; // e.g. ["ROLE_ADMIN", "ADMIN"]
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface AuthSuccessResponse {
  accessToken: string;
  tokenType: string; // "Bearer"
  expiresIn: number; // in seconds
  user: UserProfile;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  hasRole: (role: AuthRole | AuthRole[]) => boolean;
  clearError: () => void;
}
