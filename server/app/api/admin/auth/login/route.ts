import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;
    const token = process.env.ADMIN_SESSION_TOKEN;

    if (!validUser || !validPass || !token) {
      console.error('[Auth] Missing required env vars: ADMIN_USER, ADMIN_PASS, or ADMIN_SESSION_TOKEN');
      return NextResponse.json(
        { success: false, error: 'Server authentication is not configured.' },
        { status: 500 }
      );
    }

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Use NextResponse.cookies — NOT cookies() from next/headers inside Route Handlers
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;

  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
