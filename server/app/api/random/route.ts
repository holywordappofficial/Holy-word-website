import { NextResponse } from 'next/server';
import { getThemeLocators, fetchThemeContent } from '@/lib/themes';

export async function GET() {
  try {
    const locators = await getThemeLocators();
    
    if (locators.length === 0) {
      return NextResponse.json({ error: 'No themes found in database.' }, { status: 404 });
    }

    // Attempt to find a valid random verse, up to 10 retries if themes are corrupted
    for (let i = 0; i < 10; i++) {
        const randomLocator = locators[Math.floor(Math.random() * locators.length)];
        
        try {
            const parsed = await fetchThemeContent(randomLocator);

            if (!parsed) continue;

            const verses = parsed.verses || [];
            if (!parsed.theme || !Array.isArray(verses) || verses.length === 0) {
                continue; // Skip this one, try again
            }

            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            return NextResponse.json({
                themeInfo: {
                    id: randomLocator.id,
                    theme: parsed.theme
                },
                verse: randomVerse
            });
        } catch (fileErr) {
            console.warn(`Random API: Skipping corrupted theme file ${randomLocator.fileName}`, fileErr);
            continue;
        }
    }

    return NextResponse.json({ error: 'Failed to find a valid verse in available themes.' }, { status: 404 });

  } catch (error) {
    console.error('Critical Error fetching random verse:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
