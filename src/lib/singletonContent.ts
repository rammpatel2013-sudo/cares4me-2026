import { promises as fs } from 'fs';
import path from 'path';

let noStore: (() => void) | undefined;
try {
  // @ts-ignore
  noStore = require('next/cache').unstable_noStore;
} catch {}

export type HomeContent = typeof import('../../content/pages/home.json');
export type AboutUsContent = typeof import('../../content/pages/about-us.json');
export type DonateContent = typeof import('../../content/pages/donate.json');
export type VolunteerContent = typeof import('../../content/pages/volunteer.json');
export type ContactUsContent = typeof import('../../content/pages/contact-us.json');

async function readContentFile<T>(filename: string): Promise<T> {
  if (noStore) noStore();
  const contentDir = path.join(process.cwd(), 'content', 'pages');
  const filePath = path.join(contentDir, filename);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

export function getSingletonContentPath(pageKey: string) {
  return path.join(process.cwd(), 'content', 'pages', `${pageKey}.json`);
}

export async function loadHomeContent() {
  return readContentFile<HomeContent>('home.json');
}

export async function loadAboutUsContent() {
  return readContentFile<AboutUsContent>('about-us.json');
}

export async function loadDonateContent() {
  return readContentFile<DonateContent>('donate.json');
}

export async function loadVolunteerContent() {
  return readContentFile<VolunteerContent>('volunteer.json');
}

export async function loadContactUsContent() {
  return readContentFile<ContactUsContent>('contact-us.json');
}
