import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const themeFiles = await fs.readdir(dataDir);
    const jsonFiles = themeFiles.filter(f => f.endsWith('.json'));

    const uploadResults = [];

    for (const file of files) {
      const blob = await put(file.name, file, { access: 'public' });
      const newUrl = blob.url;

      for (const jsonFile of jsonFiles) {
        const filePath = path.join(dataDir, jsonFile);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        let updated = false;

        if (parsed.verses && Array.isArray(parsed.verses)) {
          for (const verse of parsed.verses) {
            if (verse.verseimagelink && verse.verseimagelink.includes(file.name)) {
              verse.verseimagelink = newUrl;
              updated = true;
            }
          }
        }

        if (updated) {
          await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
        }
      }
      uploadResults.push({ fileName: file.name, url: newUrl });
    }

    return NextResponse.json({ 
      success: true, 
      count: files.length, 
      results: uploadResults 
    });

  } catch (error: any) {
    console.error('API Error in bulk upload:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
