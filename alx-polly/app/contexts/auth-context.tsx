'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthContextType, AuthUser } from '@/types';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Refresh the page on auth state changes to sync with server
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          window.location.reload();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // These methods are now deprecated in favor of server actions
  // but kept for backward compatibility with any remaining client components
  const signIn = async (email: string, password: string) => {
    console.warn('signIn method is deprecated. Use signInAction server action instead.');
    return { error: new Error('Use server actions for authentication') };
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.warn('signUp method is deprecated. Use signUpAction server action instead.');
    return { error: new Error('Use server actions for authentication') };
  };

  const signOut = async () => {
    console.warn('signOut method is deprecated. Use signOutAction server action instead.');
  };

  const resetPassword = async (email: string) => {
    console.warn('resetPassword method is deprecated. Use resetPasswordAction server action instead.');
    return { error: new Error('Use server actions for authentication') };
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
