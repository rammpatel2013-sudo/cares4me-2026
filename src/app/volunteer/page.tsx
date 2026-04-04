import VolunteerPageClient from './VolunteerPageClient';
import { loadVolunteerContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

export default async function VolunteerPage() {
  const content = await loadVolunteerContent();
  return <VolunteerPageClient content={content} />;
}