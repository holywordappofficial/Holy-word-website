import { NextResponse } from 'next/server';
import { getThemeLocators, fetchThemeContent } from '@/lib/themes';

export async function GET() {
  try {
    const locators = await getThemeLocators();
    
    if (locators.length === 0) {
      return NextResponse.json({ totalThemes: 0, themes: [] });
    }

    const themePromises = locators.map(async (locator) => {
      try {
        const parsed = await fetchThemeContent(locator);
        
        // Robust structural validation
        if (!parsed || !parsed.theme || !Array.isArray(parsed.verses)) {
          return null;
        }

        return {
          id: locator.id,
          theme: parsed.theme,
          totalVerses: parsed.verses.length,
          fileName: locator.fileName,
          isBlob: locator.isBlob
        };
      } catch (err) {
        console.warn(`Skipping invalid or corrupt theme file: ${locator.fileName}`, err);
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
