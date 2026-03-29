import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;
    const token = process.env.ADMIN_SESSION_TOKEN;

    if (!validUser || !validPass || !token) {
      console.error('[Auth] Missing ADMIN_USER, ADMIN_PASS, or ADMIN_SESSION_TOKEN env vars.');
      return NextResponse.json(
        { success: false, error: 'Server authentication is not configured. Add env vars to Vercel.' },
        { status: 500 }
      );
    }

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    (await cookies()).set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
