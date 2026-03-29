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
    // Combines current batch + ALL previously uploaded images in the images/ folder
    // Key: base filename (no extension, lowercase) e.g. "love_60_image_1"
    // Value: correct Vercel Blob URL
    const imageMap = new Map<string, string>();

    // 1a. Scan ALL existing blobs under images/ — catches images from any previous session
    let cursor: string | undefined;
    while (true) {
      const blobList = await list({ prefix: 'images/', limit: 1000, ...(cursor ? { cursor } : {}) });
      for (const blob of blobList.blobs) {
        const fileName = blob.pathname.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
        if (base) imageMap.set(base, blob.url);
      }
      if (!blobList.cursor) break;
      cursor = blobList.cursor;
    }

    // 1b. Current batch takes priority (most recently uploaded = most up to date)
    for (const patch of patchedLinks) {
      const base = patch.fileName.replace(/\.[^/.]+$/, '').toLowerCase();
      if (base) imageMap.set(base, patch.url);
    }

    console.log(`[apply-sync] Image map: ${imageMap.size} images available (${patchedLinks.length} from current batch)`);

    if (imageMap.size === 0) {
      return NextResponse.json(
        { success: false, error: 'No images found in blob storage. Upload images first.' },
        { status: 400 }
      );
    }

    // ─── Step 2: Fetch fresh themes (bypass 60s in-memory cache) ────────────
    invalidateThemeCache();
    const locators = await getThemeLocators();
    let themesUpdatedCount = 0;
    let totalVersesUpdated = 0;

    for (const locator of locators) {
      try {
        const parsed = await fetchThemeContent(locator);
        if (!parsed || !Array.isArray(parsed.verses)) continue;

        let themeWasUpdated = false;
        let themeVersesUpdated = 0;
        const themeName = (parsed.theme || parsed.themeInfo?.theme || '').toLowerCase();

        for (const verse of parsed.verses) {
          let matchFound = false;
          const verseId = String(verse.id || verse.verseNumber || '');

          // 1. Try matching using current verseimagelink if it exists
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

          // 2. If no match yet (or link was empty), try matching by Verse ID
          if (!matchFound && verseId && themeName) {
            // Find any blob filename that contains both theme and ID
            for (const [blobBase, blobUrl] of imageMap.entries()) {
              const lowerBlobBase = blobBase.toLowerCase();
              if (lowerBlobBase.includes(themeName) && lowerBlobBase.includes(verseId.toLowerCase())) {
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
          await put(`themes/${locator.fileName}`, buffer, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
          });
          themesUpdatedCount++;
          totalVersesUpdated += themeVersesUpdated;
          console.log(`[apply-sync] ✓ Saved: ${locator.fileName} (${themeVersesUpdated} verses fixed)`);
        }
      } catch (err) {
        console.error(`[apply-sync] Failed for ${locator.fileName}:`, err);
      }
    }

    // ─── Step 3: Invalidate cache so API serves updated data immediately ─────
    invalidateThemeCache();

    return NextResponse.json({
      success: true,
      imagesAvailable: imageMap.size,
      totalVersesUpdated,
      themesUpdatedCount,
    });

  } catch (error: any) {
    console.error('[apply-sync] Critical error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
