'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  displayName?: string | null;
  role: string;
  status: string;
  timezone: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (path: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:3333/api/v1';

  const refreshSession = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        const profileRes = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser(profile);
        }
      }
    } catch (e) {
      console.error('Failed to refresh session', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      setUser(profile);
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      setUser(profile);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error(e);
    }
    setAccessToken(null);
    setUser(null);
  };

  const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    let token = accessToken;

    if (!token) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          token = refreshData.accessToken;
          setAccessToken(token);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (res.status === 401) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setAccessToken(refreshData.accessToken);
          return await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
            credentials: 'include',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
