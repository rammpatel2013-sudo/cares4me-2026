import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';
import { loadCampaignBySlug } from '@/lib/getCampaigns';

export const dynamic = 'force-dynamic';

export default async function CampaignPayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await loadCampaignBySlug(slug);

  if (!campaign) notFound();

  if (campaign.status === 'archived') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-black text-[#1E5A96] mb-4">Campaign Closed</h1>
          <p className="text-gray-600 mb-6">
            This campaign is no longer accepting donations. Check our{' '}
            <a href="/campaigns" className="text-[#2BA5D7] underline hover:text-[#1E5A96]">
              active campaigns
            </a>{' '}
            to find other ways to help.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F9FF]">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Back link */}
        <a
          href="/campaigns"
          className="inline-flex items-center gap-1 text-sm text-[#2BA5D7] hover:text-[#1E5A96] mb-8 font-medium"
        >
          ← Back to Campaigns
        </a>

        <PaymentClient campaign={campaign} />
      </div>
    </main>
  );
}
