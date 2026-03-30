import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  noStore();
  
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');
  
  if (!filename) {
    return new NextResponse('No file specified', { status: 400 });
  }

  // Security constraint: Prevent directory traversal hacking
  const safeFilename = path.basename(filename);
  // Re-routing to use the proven media-metadata Synology volume mount instead of the broken uploads volume
  const filePath = path.join(process.cwd(), 'public', 'media-metadata', safeFilename);
  
  try {
    let fileBuffer;
    try {
      // Phase 1: Check the new guaranteed metadata folder
      fileBuffer = await fs.readFile(filePath);
    } catch {
      // Phase 2: If it's an old photo, it's trapped in the uploads folder! Go rescue it.
      const legacyPath = path.join(process.cwd(), 'public', 'uploads', safeFilename);
      fileBuffer = await fs.readFile(legacyPath);
    }
    
    const ext = path.extname(safeFilename).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    };
    const mimeType = mimeMap[ext] || 'application/octet-stream';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'no-store, must-revalidate',
      },
      status: 200,
    });
  } catch (error) {
    return new NextResponse('Image not found on server hard drive', { status: 404 });
  }
}
