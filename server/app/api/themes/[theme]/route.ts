import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ theme: string }> }
) {
  try {
    const { theme: themeId } = await params;
    const fileName = themeId.endsWith('.json') ? themeId : `${themeId}.json`;
    const dataDir = path.join(process.cwd(), 'data', 'themes');
    const filePath = path.join(dataDir, fileName);

    // Prevent directory traversal
    if (!filePath.startsWith(dataDir)) {
      return NextResponse.json({ error: 'Invalid theme path' }, { status: 400 });
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Theme not found or failed to load' }, { status: 404 });
  }
}
