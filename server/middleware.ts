import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Auth routes must be publicly accessible — they ARE the login/logout endpoints
  if (url.pathname.startsWith('/api/admin/auth/')) {
    return NextResponse.next();
  }

  // Protect all other /admin and /api/admin routes
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    
    // Check for API Key (for external app integration)
    const apiKey = req.headers.get('X-API-Key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (apiKey && validApiKey && apiKey === validApiKey) {
      return NextResponse.next();
    }

    // Check for Session Cookie (for web dashboard)
    // CRITICAL: Both must be non-empty strings to prevent undefined === undefined bypass
    const sessionToken = req.cookies.get('admin_session')?.value;
    const validToken = process.env.ADMIN_SESSION_TOKEN;

    if (sessionToken && validToken && sessionToken === validToken) {
      return NextResponse.next();
    }

    // If it's an API route, return 401 Unauthorized
    if (url.pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing credentials' },
        { status: 401 }
      );
    }

    // Redirect browser to login page
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/admin/:path*'],
};
