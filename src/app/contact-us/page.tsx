import ContactPageClient from './ContactPageClient';
import { loadContactUsContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const content = await loadContactUsContent();
  return <ContactPageClient content={content} />;
}