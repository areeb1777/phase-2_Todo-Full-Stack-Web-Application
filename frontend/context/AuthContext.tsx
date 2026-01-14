'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { todoApi, getToken, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  updateUserProfile: (userData: { email?: string; profile_picture?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on initial load
    const checkAuthStatus = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await todoApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired, clear it
          todoApi.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await todoApi.login({ email, password });
    setUser(result.user);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string) => {
    const result = await todoApi.register({ email, password });
    setUser(result.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await todoApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await todoApi.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // If refreshing fails, user is no longer authenticated
      await logout();
    }
  };

  const updateProfilePicture = async (file: File) => {
    if (!user) return;

    try {
      const updatedUser = await todoApi.updateProfilePicture(file);

      // Update the user state to reflect the new profile picture immediately
      setUser(updatedUser);

      // Optionally refresh user data to ensure consistency
      // In some cases we might want to fetch the latest user data from the server
      const refreshedUser = await todoApi.getCurrentUser();
      setUser(refreshedUser);

      // Return nothing to match the defined interface
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: { email?: string; profile_picture?: string }) => {
    if (!user) return;

    try {
      const updatedUser = await todoApi.updateProfile(userData);
      setUser(updatedUser);
      // Return nothing to match the defined interface
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateProfilePicture,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}