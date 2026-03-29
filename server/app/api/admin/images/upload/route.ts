import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Server-side MIME validation (client can be spoofed)
    if (!file.type.startsWith('image/') && !file.type.includes('webp')) {
      return NextResponse.json({ success: false, error: `Invalid file type: ${file.type}` }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    // Namespace under 'images/' to avoid collision with theme JSON files
    const blob = await put(`images/${file.name}`, file, { 
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ success: true, url: blob.url });

  } catch (error: any) {
    console.error('[image-upload] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
