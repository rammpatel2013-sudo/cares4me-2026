import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');

  const metadataDir = path.join(process.cwd(), 'public', 'media-metadata');

  try {
    // Check if directory exists
    try {
      await fs.access(metadataDir);
    } catch {
      return NextResponse.json([]);
    }

    const files = await fs.readdir(metadataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const mediaItems = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(metadataDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);

        // Filter by destination if provided
        if (!destination || data.destination === destination) {
          mediaItems.push(data);
        }
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }
    }

    // Sort by timestamp (newest first)
    mediaItems.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Error reading media metadata:', error);
    return NextResponse.json([]);
  }
}
