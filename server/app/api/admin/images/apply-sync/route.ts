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

    // Always work with fresh data during sync — bypass any in-memory cache
    invalidateThemeCache();
    const freshLocators = await getThemeLocators();

    for (const locator of freshLocators) {
      try {
        // Force fresh fetch from Blob (bypass cache for sync operations)
        const locatorCopy = { ...locator };
        const parsed = await fetchThemeContent(locatorCopy);
        if (!parsed || !Array.isArray(parsed.verses)) continue;

        let themeWasUpdated = false;

        for (const verse of parsed.verses) {
          // Only process verses that have a verseimagelink field (even if it's just a filename)
          if (!verse.verseimagelink) continue;

          // Get just the filename part from the existing link (strip any path or old URL)
          const existingLink = verse.verseimagelink as string;
          const existingFileName = existingLink.split('/').pop() || existingLink;
          // Strip extension for comparison
          const existingBase = existingFileName.replace(/\.[^/.]+$/, '').toLowerCase();

          // Find the uploaded image that matches this verse's image filename
          const matchedPatch = patchedLinks.find(patch => {
            const uploadedBase = patch.fileName.replace(/\.[^/.]+$/, '').toLowerCase();
            // Match: uploaded "Love_1_image_1" vs existing "Love_1_image_1"
            return uploadedBase === existingBase || existingBase.endsWith(uploadedBase) || uploadedBase.endsWith(existingBase);
          });

          if (matchedPatch) {
            verse.verseimagelink = matchedPatch.url;
            themeWasUpdated = true;
            console.log(`[apply-sync] Matched: ${existingFileName} → ${matchedPatch.url}`);
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
          console.log(`[apply-sync] Saved updated theme: ${locator.fileName}`);
        } else {
          console.log(`[apply-sync] No matches found in theme: ${locator.fileName}`);
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
