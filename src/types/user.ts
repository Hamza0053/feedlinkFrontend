// User types
export type UserRole = 'donor' | 'ngo' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  organization?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
