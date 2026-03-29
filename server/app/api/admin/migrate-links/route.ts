import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { getThemeLocators, fetchThemeContent, invalidateThemeCache } from '@/lib/themes';

/**
 * One-time migration: Fixes all verseimagelink URLs in JSON themes.
 * Updates old/wrong URLs to the correct Vercel Blob URLs under the images/ prefix.
 * 
 * Call once via: POST /api/admin/migrate-links
 * Protected by middleware (requires session or API key)
 */
export async function POST() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
    }

    // Step 1: Build a lookup map of all actual image blobs in the images/ prefix
    // key = base filename (no extension, lowercase), value = actual blob URL
    const imageBlobMap = new Map<string, string>();

    let cursor: string | undefined;
    while (true) {
      const blobList = await list({ prefix: 'images/', limit: 1000, ...(cursor ? { cursor } : {}) });
      for (const blob of blobList.blobs) {
        // e.g. pathname = "images/Faith_99_image_1.webp"
        const fileName = blob.pathname.split('/').pop() || '';
        const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
        imageBlobMap.set(base, blob.url);
      }
      if (!blobList.cursor) break;
      cursor = blobList.cursor;
    }

    console.log(`[migrate-links] Found ${imageBlobMap.size} images in Blob storage`);

    if (imageBlobMap.size === 0) {
      return NextResponse.json({ success: false, error: 'No images found under images/ in Blob. Upload images first.' });
    }

    // Step 2: Load fresh themes (bypass cache)
    invalidateThemeCache();
    const locators = await getThemeLocators();

    let totalVersesFixed = 0;
    let themesUpdated = 0;
    const report: { theme: string; fixed: number; notFound: string[] }[] = [];

    for (const locator of locators) {
      const parsed = await fetchThemeContent(locator);
      if (!parsed || !Array.isArray(parsed.verses)) continue;

      let themeFixed = 0;
      const notFound: string[] = [];

      for (const verse of parsed.verses) {
        if (!verse.verseimagelink) continue;

        // Extract the base filename from whatever is currently stored
        const currentLink = verse.verseimagelink as string;
        const fileName = currentLink.split('/').pop() || currentLink;
        const base = fileName.replace(/\.[^/.]+$/, '').toLowerCase();

        // Find the matching blob URL
        const correctUrl = imageBlobMap.get(base);

        if (correctUrl && verse.verseimagelink !== correctUrl) {
          // Only update if different (avoids unnecessary writes)
          verse.verseimagelink = correctUrl;
          themeFixed++;
          totalVersesFixed++;
        } else if (!correctUrl) {
          notFound.push(fileName);
        }
      }

      if (themeFixed > 0) {
        // Save updated JSON back to Blob
        const buffer = Buffer.from(JSON.stringify(parsed, null, 2), 'utf-8');
        await put(`themes/${locator.fileName}`, buffer, {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false
        });
        themesUpdated++;
        console.log(`[migrate-links] Updated ${themeFixed} links in ${locator.fileName}`);
      }

      report.push({ theme: locator.fileName, fixed: themeFixed, notFound });
    }

    // Invalidate cache so API immediately serves fresh data
    invalidateThemeCache();

    return NextResponse.json({
      success: true,
      summary: {
        totalVersesFixed,
        themesUpdated,
        imagesInBlob: imageBlobMap.size,
      },
      report
    });

  } catch (error: any) {
    console.error('[migrate-links] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
