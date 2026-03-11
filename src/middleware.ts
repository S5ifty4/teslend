import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as { profile_completed?: boolean } | null;
    const { pathname } = req.nextUrl;

    // If signed in but profile not completed, redirect to onboarding
    // (except if already going to onboarding or api routes)
    if (
      token &&
      token.profile_completed === false &&
      pathname !== '/onboarding' &&
      !pathname.startsWith('/api')
    ) {
      const url = req.nextUrl.clone();
      url.pathname = '/onboarding';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware for authenticated users on protected routes
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const protectedRoutes = ['/listings/new', '/my-listings'];
        if (protectedRoutes.some((r) => pathname.startsWith(r))) {
          return !!token;
        }
        // Allow all other routes, but still run middleware fn if signed in
        return true;
      },
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
