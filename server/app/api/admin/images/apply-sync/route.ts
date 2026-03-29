import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getThemeLocators, fetchThemeContent, invalidateThemeCache } from '@/lib/themes';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const patchedLinks: { fileName: string; url: string }[] = body.patchedLinks;

    if (!patchedLinks || !Array.isArray(patchedLinks) || patchedLinks.length === 0) {
      return NextResponse.json({ success: false, error: 'No patched links provided' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    const locators = await getThemeLocators();
    let themesUpdatedCount = 0;

    for (const locator of locators) {
      try {
        const parsed = await fetchThemeContent(locator);
        if (!parsed || !Array.isArray(parsed.verses)) continue;

        let themeWasUpdated = false;

        for (const verse of parsed.verses) {
          if (verse.verseimagelink) {
            for (const patch of patchedLinks) {
              // Match by original filename (before WebP conversion)
              const baseName = patch.fileName.replace(/\.[^/.]+$/, '');
              if (verse.verseimagelink.includes(baseName)) {
                verse.verseimagelink = patch.url;
                themeWasUpdated = true;
                break;
              }
            }
          }
        }

        if (themeWasUpdated) {
          const buffer = Buffer.from(JSON.stringify(parsed, null, 2), 'utf-8');
          await put(`themes/${locator.fileName}`, buffer, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false
          });
          themesUpdatedCount++;
        }
      } catch (err) {
        console.error(`[apply-sync] Failed to patch theme ${locator.fileName}`, err);
      }
    }

    // Invalidate in-memory cache so next reads get the fresh patched JSON
    invalidateThemeCache();

    return NextResponse.json({ 
      success: true, 
      patchedLinksCount: patchedLinks.length,
      themesUpdatedCount 
    });

  } catch (error: any) {
    console.error('[apply-sync] Critical error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
