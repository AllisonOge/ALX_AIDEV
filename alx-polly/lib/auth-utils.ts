import { AuthError } from '@supabase/supabase-js';

export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';
  
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link to verify your account.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    default:
      return error.message || 'An authentication error occurred.';
  }
};

export const formatUserDisplayName = (user: any): string => {
  if (user?.user_metadata?.name) {
    return user.user_metadata.name;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  return 'User';
};

export const isUserEmailVerified = (user: any): boolean => {
  return !!user?.email_confirmed_at;
};
