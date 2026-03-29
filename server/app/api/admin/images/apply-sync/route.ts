import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { getThemeLocators, fetchThemeContent, invalidateThemeCache } from '@/lib/themes';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // patchedLinks from the current upload session (may be empty for a manual re-sync)
    const patchedLinks: { fileName: string; url: string }[] = body.patchedLinks ?? [];

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN on server' }, { status: 500 });
    }

    // ─── Step 1: Build a COMPLETE image map ─────────────────────────────────
    const imageMap = new Map<string, string>();
    const debug: string[] = [];

    // 1a. Scan blobs. Try 'images/' prefix first, fallback to root if empty
    let cursor: string | undefined;
    while (true) {
      const blobList: any = await list({ prefix: 'images/', limit: 1000, ...(cursor ? { cursor } : {}) });
      for (const blob of blobList.blobs) {
        const fileName = blob.pathname.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
        if (base) imageMap.set(base, blob.url);
      }
      if (!blobList.cursor) break;
      cursor = blobList.cursor;
    }

    if (imageMap.size === 0) {
      debug.push("No images in 'images/' folder, checking root...");
      cursor = undefined;
      while (true) {
        const blobList: any = await list({ limit: 1000, ...(cursor ? { cursor } : {}) });
        for (const blob of blobList.blobs) {
          // Skip known non-image patterns if you want, or just check extension
          if (blob.pathname.includes('.') && !blob.pathname.endsWith('.json')) {
            const fileName = blob.pathname.split('/').pop() || '';
            const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
            if (base) imageMap.set(base, blob.url);
          }
        }
        if (!blobList.cursor) break;
        cursor = blobList.cursor;
      }
    }

    // 1b. Current batch uploads
    for (const patch of patchedLinks) {
      const base = patch.fileName.replace(/\.[^/.]+$/, '').toLowerCase();
      if (base) imageMap.set(base, patch.url);
    }

    debug.push(`Total images in map: ${imageMap.size}`);

    // ─── Step 2: Fetch and Sync themes ──────────────────────────────────────
    invalidateThemeCache();
    const locators = await getThemeLocators();
    debug.push(`Found ${locators.length} theme locators`);

    let themesUpdatedCount = 0;
    let totalVersesUpdated = 0;

    for (const locator of locators) {
      try {
        const parsed = await fetchThemeContent(locator);
        if (!parsed) {
          debug.push(`Failed to load content for ${locator.fileName}`);
          continue;
        }

        // Support both structures: 'verses' array OR a top-level theme file
        const verses = Array.isArray(parsed.verses) ? parsed.verses : [];
        if (verses.length === 0) {
          debug.push(`Theme ${locator.fileName} has 0 verses or invalid structure`);
          continue;
        }

        let themeWasUpdated = false;
        let themeVersesUpdated = 0;
        // Detect theme name from JSON or filename
        const themeName = (parsed.theme || parsed.themeInfo?.theme || locator.id.split('_').pop() || '').toLowerCase();

        for (const verse of verses) {
          let matchFound = false;
          const verseId = String(verse.id || verse.verseNumber || '');

          // 1. Existing Link Match (Highest priority)
          if (verse.verseimagelink) {
            const currentLink = verse.verseimagelink as string;
            const fileName = currentLink.split('/').pop() || currentLink;
            const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
            const correctUrl = imageMap.get(base);

            if (correctUrl && verse.verseimagelink !== correctUrl) {
              verse.verseimagelink = correctUrl;
              matchFound = true;
            }
          }

          // 2. ID/Theme Pattern Match (Fallback)
          if (!matchFound && verseId && themeName) {
            for (const [blobBase, blobUrl] of imageMap.entries()) {
              if (blobBase.includes(themeName) && blobBase.includes(verseId.toLowerCase())) {
                verse.verseimagelink = blobUrl;
                matchFound = true;
                break;
              }
            }
          }

          if (matchFound) {
            themeVersesUpdated++;
            themeWasUpdated = true;
          }
        }

        if (themeWasUpdated) {
          const buffer = Buffer.from(JSON.stringify(parsed, null, 2), 'utf-8');
          // locator.fileName now contains the full pathname (e.g. "themes/theme_01.json" or "theme_01.json")
          await put(locator.fileName, buffer, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
          });
          themesUpdatedCount++;
          totalVersesUpdated += themeVersesUpdated;
          debug.push(`Sync success: ${locator.fileName} (+${themeVersesUpdated} verses)`);
        }
      } catch (err: any) {
        debug.push(`Error processing ${locator.fileName}: ${err.message}`);
      }
    }

    // ─── Step 3: Invalidate cache so API serves updated data immediately ─────
    invalidateThemeCache();

    return NextResponse.json({
      success: true,
      imagesAvailable: imageMap.size,
      totalVersesUpdated,
      themesUpdatedCount,
      debug
    });

  } catch (error: any) {
    console.error('[apply-sync] Critical error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
