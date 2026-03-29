import { NextResponse } from 'next/server';
import { getThemeLocators, fetchThemeContent } from '@/lib/themes';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ theme: string }> }
) {
  try {
    const { theme: themeId } = await params;
    const cleanId = themeId.replace('.json', '');

    const locators = await getThemeLocators();
    const locator = locators.find(loc => loc.id === cleanId);

    if (!locator) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    const parsed = await fetchThemeContent(locator);

    if (!parsed) {
      return NextResponse.json({ error: 'Failed to load theme data' }, { status: 500 });
    }

    const verses = parsed.verses || [];
    
    if (verses.length === 0) {
      return NextResponse.json({ error: 'No verses found in theme' }, { status: 404 });
    }

    // Pick a random verse
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    return NextResponse.json({
      themeInfo: {
        id: locator.id,
        theme: parsed.theme
      },
      verse: randomVerse
    });

  } catch (error) {
    console.error('Error fetching random verse for theme:', error);
    return NextResponse.json({ error: 'Theme not found or failed to load' }, { status: 404 });
  }
}
