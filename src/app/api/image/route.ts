import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');
  
  if (!filename) {
    return new NextResponse('No file specified', { status: 400 });
  }

  const safeFilename = path.basename(filename);
  const publicDirs = [
    process.env.APP_DIR ? path.join(process.env.APP_DIR, 'public') : '',
    path.join(/*turbopackIgnore: true*/ process.cwd(), 'public'),
  ].filter(Boolean);

  const candidatePaths: string[] = [];
  for (const publicDir of publicDirs) {
    candidatePaths.push(
      path.join(publicDir, 'blog-images', safeFilename),
      path.join(publicDir, 'uploads', safeFilename),
      path.join(publicDir, 'images', safeFilename),
    );
  }
  
  try {
    let fileBuffer = null;

    for (const candidatePath of candidatePaths) {
      try {
        fileBuffer = await fs.readFile(candidatePath);
        break;
      } catch {}
    }

    if (!fileBuffer) {
      return new NextResponse('Image not found', { status: 404 });
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
    });
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 });
  }
}
