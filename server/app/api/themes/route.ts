import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ensureThemeDir } from '@/lib/init';

export async function GET() {
  try {
    const dataDir = await ensureThemeDir();
    const files = await fs.readdir(dataDir);
    
    const themeFiles = files.filter(file => file.endsWith('.json'));
    
    const themePromises = themeFiles.map(async (file) => {
      try {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        
        // Robust structural validation
        if (!parsed.theme || !Array.isArray(parsed.verses)) {
          return null;
        }

        return {
          id: file.replace('.json', ''),
          theme: parsed.theme,
          totalVerses: parsed.verses.length,
          fileName: file
        };
      } catch (err) {
        console.warn(`Skipping invalid or corrupt theme file: ${file}`, err);
        return null;
      }
    });

    const results = await Promise.all(themePromises);
    const themes = results.filter((t): t is NonNullable<typeof t> => t !== null);
    
    return NextResponse.json({
      totalThemes: themes.length,
      themes
    });
  } catch (error) {
    console.error('Critical Error fetching themes:', error);
    return NextResponse.json({ error: 'Failed to access theme database' }, { status: 500 });
  }
}
