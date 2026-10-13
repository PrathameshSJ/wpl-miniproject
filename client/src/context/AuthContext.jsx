import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bakeease_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('bakeease_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const profile = await apiFetch('/auth/me');
          setUser(profile);
          localStorage.setItem('bakeease_user', JSON.stringify(profile));
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('bakeease_token');
          localStorage.removeItem('bakeease_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('bakeease_token', data.token);
    localStorage.setItem('bakeease_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (details) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: details,
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('bakeease_token', data.token);
    localStorage.setItem('bakeease_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bakeease_token');
    localStorage.removeItem('bakeease_user');
  };

  const updateProfile = async (updates) => {
    const data = await apiFetch('/auth/update_settings', {
      method: 'POST',
      body: updates,
    });
    setUser(data.user);
    localStorage.setItem('bakeease_user', JSON.stringify(data.user));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
