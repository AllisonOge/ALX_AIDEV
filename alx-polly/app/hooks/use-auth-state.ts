import { useAuth } from '@/app/contexts/auth-context';

export const useAuthState = () => {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useAuth();

  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_confirmed_at ? true : false;
  const userDisplayName = user?.user_metadata?.name || user?.email || 'User';

  return {
    user,
    loading,
    isAuthenticated,
    isEmailVerified,
    userDisplayName,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};
