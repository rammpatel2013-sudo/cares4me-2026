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
  const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename);
  
  try {
    const fileBuffer = await fs.readFile(filePath);
    
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
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 });
  }
}
