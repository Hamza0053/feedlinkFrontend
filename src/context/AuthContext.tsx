import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount: if token exists, validate and refresh user
    const token = localStorage.getItem('feedlink_token');
    if (token) {
      authService
        .getMe()
        .then((freshUser) => {
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('feedlink_user', JSON.stringify(freshUser));
          } else {
            // Token invalid — clear everything
            localStorage.removeItem('feedlink_token');
            localStorage.removeItem('feedlink_user');
          }
        })
        .catch(() => {
          localStorage.removeItem('feedlink_token');
          localStorage.removeItem('feedlink_user');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login({ email, password });
      setUser(loggedInUser);
      localStorage.setItem('feedlink_token', token);
      localStorage.setItem('feedlink_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
      organization?: string;
      phone?: string;
    }) => {
      setIsLoading(true);
      try {
        const { user: newUser, token } = await authService.signup(data);
        setUser(newUser);
        localStorage.setItem('feedlink_token', token);
        localStorage.setItem('feedlink_user', JSON.stringify(newUser));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('feedlink_token');
    localStorage.removeItem('feedlink_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
