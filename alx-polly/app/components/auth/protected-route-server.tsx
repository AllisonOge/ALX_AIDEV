import { getCurrentUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

interface ProtectedRouteServerProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function ProtectedRouteServer({ 
  children, 
  redirectTo = '/auth/login' 
}: ProtectedRouteServerProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
