import FAQPageClient from './FAQPageClient';
import { loadFaqPageContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const content = await loadFaqPageContent();
  return <FAQPageClient content={content} />;
}
