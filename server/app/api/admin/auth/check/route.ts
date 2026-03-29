import { NextResponse } from 'next/server';

// Diagnostic endpoint — checks if env vars are configured without revealing values
export async function GET() {
  return NextResponse.json({
    ADMIN_USER_set: !!process.env.ADMIN_USER,
    ADMIN_PASS_set: !!process.env.ADMIN_PASS,
    ADMIN_SESSION_TOKEN_set: !!process.env.ADMIN_SESSION_TOKEN,
    ADMIN_API_KEY_set: !!process.env.ADMIN_API_KEY,
    BLOB_TOKEN_set: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
