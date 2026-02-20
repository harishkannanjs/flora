import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for Firebase auth session cookie
    // Firebase stores a session token in indexedDB on the client side and 
    // a simpler way is to use a custom cookie we set on sign-in.
    // For now we use the Firebase auth cookie pattern.
    const token = request.cookies.get('firebase-token')?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !token) {
        const signInUrl = new URL('/auth/sign-in', request.url);
        signInUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
};
