import { promises as fs } from 'fs';
import path from 'path';
// Only import noStore if available (Next.js server context)
let noStore: (() => void) | undefined;
try {
  // @ts-ignore
  noStore = require('next/cache').unstable_noStore;
} catch {}

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
  if (noStore) noStore();

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
<<<<<<< HEAD
    
    const mediaItems: MediaMetadata[] = [];
    
=======

    const mediaItems: MediaMetadata[] = [];

>>>>>>> 8b4d54bf1d1afde204cfc096de0ab82a93027812
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
<<<<<<< HEAD
=======

export async function getMediaByCategory(category: string): Promise<MediaMetadata[]> {
  if (noStore) noStore();

  const metadataDir = path.join(process.cwd(), 'public', 'media-metadata');

  try {
    try {
      await fs.access(metadataDir);
    } catch {
      return [];
    }

    const files = await fs.readdir(metadataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const mediaItems: MediaMetadata[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(metadataDir, file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      try {
        const data = JSON.parse(fileContents) as MediaMetadata;
        if (data.category === category) {
          mediaItems.push(data);
        }
      } catch (e) {
        console.error(`Error parsing JSON in ${file}`, e);
      }
    }

    return mediaItems.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading media metadata directory:', error);
    return [];
  }
}

export async function getAllMedia(): Promise<MediaMetadata[]> {
  if (noStore) noStore();

  const metadataDir = path.join(process.cwd(), 'public', 'media-metadata');

  try {
    try {
      await fs.access(metadataDir);
    } catch {
      return [];
    }

    const files = await fs.readdir(metadataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const mediaItems: MediaMetadata[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(metadataDir, file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      try {
        const data = JSON.parse(fileContents) as MediaMetadata;
        mediaItems.push(data);
      } catch (e) {
        console.error(`Error parsing JSON in ${file}`, e);
      }
    }

    return mediaItems.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading media metadata directory:', error);
    return [];
  }
}
