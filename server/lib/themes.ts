import fs from 'fs/promises';
import path from 'path';
import { list } from '@vercel/blob';

export interface ThemeLocator {
  id: string;
  fileName: string;
  isBlob: boolean;
  url?: string;
  localPath?: string;
}

// Simple in-memory cache to save Blob Read requests
let cachedLocators: ThemeLocator[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

const contentCache = new Map<string, { data: any; time: number }>();

/** Call this after any write to Blob to ensure next reads get fresh data */
export function invalidateThemeCache() {
  cachedLocators = null;
  lastCacheTime = 0;
  contentCache.clear();
}

/**
 * Gets a unique list of all available themes.
 * Blob version takes precedence over local files with the same name.
 * Paginates the Blob listing to handle stores with >1000 blobs.
 */
export async function getThemeLocators(): Promise<ThemeLocator[]> {
  const now = Date.now();
  if (cachedLocators && (now - lastCacheTime < CACHE_TTL)) {
    return cachedLocators;
  }

  const locators = new Map<string, ThemeLocator>();
  
  // 1. Read Local fallback
  try {
    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const files = await fs.readdir(dataDir);
    for (const file of files.filter(f => f.endsWith('.json'))) {
      locators.set(file, { 
        id: file.replace('.json', ''), 
        fileName: file, 
        isBlob: false, 
        localPath: path.join(dataDir, file) 
      });
    }
  } catch {
    // Local directory missing or inaccessible on Vercel runtime — ignore
  }

  // 2. Read Blob (paginated, Blob version always wins)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      let cursor: string | undefined;
      while (true) {
        const blobList = await list({ prefix: 'themes/', limit: 1000, ...(cursor ? { cursor } : {}) });
        for (const blob of blobList.blobs) {
          if (blob.pathname.endsWith('.json')) {
            const fileName = blob.pathname.replace('themes/', '');
            locators.set(fileName, { 
              id: fileName.replace('.json', ''), 
              fileName, 
              isBlob: true, 
              url: blob.url 
            });
          }
        }
        if (!blobList.cursor) break;
        cursor = blobList.cursor;
      }
    } catch (e) {
      console.warn('[themes] Error listing Vercel Blob themes:', e);
    }
  }

  const result = Array.from(locators.values());
  cachedLocators = result;
  lastCacheTime = now;
  return result;
}

/**
 * Downloads and parses the JSON content for a given ThemeLocator.
 * Uses a 60-second in-memory cache to reduce Blob read operations.
 */
export async function fetchThemeContent(locator: ThemeLocator): Promise<any> {
  const cacheKey = locator.isBlob ? (locator.url ?? locator.fileName) : (locator.localPath ?? locator.fileName);
  const now = Date.now();
  const cached = contentCache.get(cacheKey);

  if (cached && (now - cached.time < CACHE_TTL)) {
    return cached.data;
  }

  try {
    let data = null;
    if (locator.isBlob && locator.url) {
      const res = await fetch(locator.url, { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`Failed to fetch Blob: ${res.status}`);
      data = await res.json();
    } else if (locator.localPath) {
      const fileContent = await fs.readFile(locator.localPath, 'utf-8');
      data = JSON.parse(fileContent);
    }

    if (data) {
      contentCache.set(cacheKey, { data, time: now });
      return data;
    }
  } catch (err) {
    console.error(`[themes] Error loading content for ${locator.fileName}:`, err);
  }
  return null;
}

