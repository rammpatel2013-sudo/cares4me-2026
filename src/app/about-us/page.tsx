import AboutPageClient from './AboutPageClient';
import { loadAboutUsContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const content = await loadAboutUsContent();
  return <AboutPageClient content={content} />;
}
