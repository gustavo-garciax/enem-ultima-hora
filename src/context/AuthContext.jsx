import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Falha ao carregar sessão:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result.user;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updatedFields) => {
    const updatedUser = await authService.updateProfile(updatedFields);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

