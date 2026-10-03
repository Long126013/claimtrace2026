/**
 * API Client with Bearer Token Interceptor & 401 Unauthorized handling
 */

export const TOKEN_STORAGE_KEY = 'claimtrace_access_token';
export const USER_STORAGE_KEY = 'claimtrace_user_profile';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    let errorData: unknown = null;
    let message = 'Session expired or unauthorized. Please sign in again.';
    try {
      errorData = await response.json();
      if (
        errorData &&
        typeof errorData === 'object' &&
        'message' in errorData &&
        typeof (errorData as { message: unknown }).message === 'string'
      ) {
        message = (errorData as { message: string }).message;
      }
    } catch {
      // ignore
    }

    const isLoginEndpoint = endpoint.includes('/api/auth/login');
    if (!isLoginEndpoint) {
      removeStoredToken();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    throw new ApiError(message, 401, errorData);
  }

  if (!response.ok) {
    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore
    }
    const message = (errorData && typeof errorData === 'object' && 'message' in errorData && typeof (errorData as { message: unknown }).message === 'string')
      ? (errorData as { message: string }).message
      : `HTTP ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status, errorData);
  }

  // Handle empty bodies (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
