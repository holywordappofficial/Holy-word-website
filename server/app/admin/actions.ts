'use server';

import fs from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function uploadThemeJSON(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure it's valid JSON
    let parsed;
    try {
      parsed = JSON.parse(buffer.toString('utf-8'));
      if (!parsed.theme || !Array.isArray(parsed.verses)) {
        return { success: false, error: 'Invalid Theme JSON Structure' };
      }
    } catch {
      return { success: false, error: 'File is not valid JSON' };
    }

    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const filePath = path.join(dataDir, file.name);

    await fs.writeFile(filePath, buffer);
    return { success: true, message: `Theme ${file.name} uploaded successfully!` };
  } catch (error: any) {
    console.error('Error uploading theme JSON:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadImageToBlob(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No image provided' };
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return { success: false, error: 'Missing BLOB_READ_WRITE_TOKEN in environment' };
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

export async function bulkUploadAndUpdateJSON(formData: FormData) {
  try {
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return { success: false, error: 'No images provided' };
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { success: false, error: 'Missing BLOB_READ_WRITE_TOKEN in environment. Please add it to your .env.local file.' };
    }

    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const themeFiles = await fs.readdir(dataDir);
    const jsonFiles = themeFiles.filter(f => f.endsWith('.json'));

    const uploadResults = [];

    for (const file of files) {
      const blob = await put(file.name, file, { access: 'public' });
      const newUrl = blob.url;

      // search and replace in JSON files
      for (const jsonFile of jsonFiles) {
        const filePath = path.join(dataDir, jsonFile);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        let updated = false;

        if (parsed.verses && Array.isArray(parsed.verses)) {
          for (const verse of parsed.verses) {
            // We find any verse whose verseimagelink contains the original filename (e.g., "Love_1_image_1.png")
            if (verse.verseimagelink && verse.verseimagelink.includes(file.name)) {
              verse.verseimagelink = newUrl;
              updated = true;
            }
          }
        }

        if (updated) {
          await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
        }
      }
      
      uploadResults.push({ fileName: file.name, url: newUrl });
    }

    return { success: true, count: files.length, results: uploadResults };
  } catch (error: any) {
    console.error('Error in bulk upload:', error);
    return { success: false, error: error.message };
  }
}

import { cookies } from 'next/headers';

export async function loginAdmin(formData: FormData) {
  const username = formData.get('userName') as string;
  const password = formData.get('password') as string;

  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASS;
  const token = process.env.ADMIN_SESSION_TOKEN;

  // Reject immediately if any required env vars are not configured
  if (!validUser || !validPass || !token) {
    console.error('[Auth] ADMIN_USER, ADMIN_PASS, or ADMIN_SESSION_TOKEN is not set in environment variables.');
    return { success: false, error: 'Server authentication is not configured. Contact the administrator.' };
  }

  if (username === validUser && password === validPass) {
    (await cookies()).set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { success: true };
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_session');
  return { success: true };
}
