import { User as SupabaseUser } from '@supabase/supabase-js';

// User types
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

// Supabase User type for authentication
export type AuthUser = SupabaseUser;

// Authentication context types
export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

// Poll types
export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  isPublic: boolean
  createdBy: string
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

// Vote types
export interface Vote {
  id: string
  pollId: string
  optionId: string
  userId: string
  createdAt: Date
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreatePollFormData {
  question: string
  options: { id: string; text: string }[]
  endDate: string
  isPublic: boolean
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
