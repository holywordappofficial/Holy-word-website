import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    const blob = await put(file.name, file, { access: 'public' });

    return NextResponse.json({ success: true, url: blob.url });

  } catch (error: any) {
    console.error('API Error uploading image:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
