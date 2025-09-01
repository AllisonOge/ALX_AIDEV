import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  // Check if user is trying to access protected routes
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/polls/create') || 
                          request.nextUrl.pathname.startsWith('/polls/') && 
                          !request.nextUrl.pathname.startsWith('/polls/page');

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/polls', request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
