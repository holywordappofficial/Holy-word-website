import fs from 'fs/promises';
import path from 'path';

export async function ensureThemeDir() {
  const dataDir = path.join(process.cwd(), 'data', 'themes');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('Created data/themes directory as it was missing.');
  }
  return dataDir;
}
