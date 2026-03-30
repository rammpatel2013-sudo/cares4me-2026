import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

export interface MediaMetadata {
  timestamp: number;
  filename: string;
  destination: string;
  category: string;
  caption: string;
  platforms: string[];
  published: string;
}

export async function getMediaByDestination(destination: string): Promise<MediaMetadata[]> {
  // ☢️ Nuclear Option: Explicitly forbid Next.js from caching this function!
  noStore();
  
  const metadataDir = path.join(process.cwd(), 'public', 'media-metadata');
  
  try {
    // Ensure the directory exists to avoid crashes
    try {
      await fs.access(metadataDir);
    } catch {
      return []; // Return empty array if directory doesn't exist yet
    }

    const files = await fs.readdir(metadataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const mediaItems: MediaMetadata[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(metadataDir, file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      try {
        const data = JSON.parse(fileContents) as MediaMetadata;
        if (data.destination === destination) {
          mediaItems.push(data);
        }
      } catch (e) {
        console.error(`Error parsing JSON in ${file}`, e);
      }
    }
    
    // Sort items by newest first
    return mediaItems.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading media metadata directory:', error);
    return [];
  }
}
