import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Protect /admin and /api/admin routes
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    
    // Check for API Key (for external app integration)
    // Both values must be non-empty strings to prevent accidental open access
    const apiKey = req.headers.get('X-API-Key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (apiKey && validApiKey && apiKey === validApiKey) {
      return NextResponse.next();
    }

    // Check for Session Cookie (for web dashboard)
    // CRITICAL: Both must be non-empty. If ADMIN_SESSION_TOKEN env var is missing,
    // validToken is undefined and `undefined === undefined` would allow EVERYONE through.
    const sessionToken = req.cookies.get('admin_session')?.value;
    const validToken = process.env.ADMIN_SESSION_TOKEN;

    if (sessionToken && validToken && sessionToken === validToken) {
      return NextResponse.next();
    }

    // If it's an API route, return 401 Unauthorized
    if (url.pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing API Key' },
        { status: 401 }
      );
    }

    // Redirect to login if not authenticated (for browser routes)
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/admin/:path*'],
};
