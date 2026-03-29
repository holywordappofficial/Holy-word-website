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
