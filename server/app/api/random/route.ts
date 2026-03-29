import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ensureThemeDir } from '@/lib/init';

export async function GET() {
  try {
    const dataDir = await ensureThemeDir();
    const files = await fs.readdir(dataDir);
    
    // Filter to only valid JSON files
    const themeFiles = files.filter(file => file.endsWith('.json'));
    
    if (themeFiles.length === 0) {
      return NextResponse.json({ error: 'No themes found in database.' }, { status: 404 });
    }

    // Attempt to find a valid random verse, up to 10 retries if themes are corrupted
    for (let i = 0; i < 10; i++) {
        const randomFileName = themeFiles[Math.floor(Math.random() * themeFiles.length)];
        const filePath = path.join(dataDir, randomFileName);
        
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(fileContent);

            const verses = parsed.verses || [];
            if (!parsed.theme || !Array.isArray(verses) || verses.length === 0) {
                continue; // Skip this one, try again
            }

            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            return NextResponse.json({
                themeInfo: {
                    id: randomFileName.replace('.json', ''),
                    theme: parsed.theme
                },
                verse: randomVerse
            });
        } catch (fileErr) {
            console.warn(`Random API: Skipping corrupted theme file ${randomFileName}`, fileErr);
            continue;
        }
    }

    return NextResponse.json({ error: 'Failed to find a valid verse in available themes.' }, { status: 404 });

  } catch (error) {
    console.error('Critical Error fetching random verse:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
