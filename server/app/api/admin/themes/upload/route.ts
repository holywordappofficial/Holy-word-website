import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate JSON
    try {
      const parsed = JSON.parse(buffer.toString('utf-8'));
      if (!parsed.theme || !Array.isArray(parsed.verses)) {
        return NextResponse.json({ success: false, error: 'Invalid Theme JSON Structure' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ success: false, error: 'File is not valid JSON' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    const blob = await put(`themes/${file.name}`, file, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false // We explicitly overwrite previous files of the same name
    });

    return NextResponse.json({ 
      success: true, 
      message: `Theme uploaded successfully to Vercel Blob!`,
      url: blob.url
    });

  } catch (error: any) {
    console.error('API Error uploading theme JSON:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
