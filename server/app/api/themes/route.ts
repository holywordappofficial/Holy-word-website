import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const files = await fs.readdir(dataDir);
    
    const themeFiles = files.filter(file => file.endsWith('.json'));
    
    const themes = await Promise.all(
      themeFiles.map(async (file) => {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        
        return {
          id: file.replace('.json', ''),
          theme: parsed.theme,
          totalVerses: parsed.totalVerses,
          fileName: file
        };
      })
    );
    
    return NextResponse.json({
      totalThemes: themes.length,
      themes
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}
