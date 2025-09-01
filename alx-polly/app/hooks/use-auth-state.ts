import { useAuth } from '@/app/contexts/auth-context';

export const useAuthState = () => {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_confirmed_at ? true : false;
  const userDisplayName = user?.user_metadata?.name || user?.email || 'User';

  return {
    user,
    loading,
    isAuthenticated,
    isEmailVerified,
    userDisplayName,
    // Note: signIn, signUp, signOut, resetPassword are deprecated
    // Use server actions instead: signInAction, signUpAction, signOutAction, resetPasswordAction
  };
};
