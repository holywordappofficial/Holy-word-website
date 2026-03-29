import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ theme: string }> }
) {
  try {
    const { theme: themeId } = await params;
    const fileName = themeId.endsWith('.json') ? themeId : `${themeId}.json`;
    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const filePath = path.join(dataDir, fileName);

    // Prevent directory traversal
    if (!filePath.startsWith(dataDir)) {
      return NextResponse.json({ error: 'Invalid theme path' }, { status: 400 });
    }

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
        id: fileName.replace('.json', ''),
        theme: parsed.theme
      },
      verse: randomVerse
    });

  } catch (error) {
    console.error('Error fetching random verse for theme:', error);
    return NextResponse.json({ error: 'Theme not found or failed to load' }, { status: 404 });
  }
}
