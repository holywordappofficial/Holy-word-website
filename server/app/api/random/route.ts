import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const files = await fs.readdir(dataDir);
    
    const themeFiles = files.filter(file => file.endsWith('.json'));
    
    if (themeFiles.length === 0) {
      return NextResponse.json({ error: 'No themes found' }, { status: 404 });
    }

    // Pick a random theme
    const randomFileName = themeFiles[Math.floor(Math.random() * themeFiles.length)];
    const filePath = path.join(dataDir, randomFileName);
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    const verses = parsed.verses || [];
    
    if (verses.length === 0) {
      return NextResponse.json({ error: 'No verses found in theme' }, { status: 404 });
    }

    // Pick a random verse
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    return NextResponse.json({
      themeInfo: {
        id: randomFileName.replace('.json', ''),
        theme: parsed.theme
      },
      verse: randomVerse
    });

  } catch (error) {
    console.error('Error fetching random verse:', error);
    return NextResponse.json({ error: 'Failed to fetch random verse' }, { status: 500 });
  }
}
