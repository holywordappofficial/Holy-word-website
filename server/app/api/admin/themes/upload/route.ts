import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const filePath = path.join(dataDir, file.name);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      message: `Theme ${file.name} uploaded successfully via API!` 
    });

  } catch (error: any) {
    console.error('API Error uploading theme JSON:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
