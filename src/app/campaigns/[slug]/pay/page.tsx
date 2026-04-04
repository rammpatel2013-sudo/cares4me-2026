import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';

export const dynamic = 'force-dynamic';

type CampaignData = {
  id: number;
  slug: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  metricType: 'currency' | 'count';
  metricUnit: string;
  beneficiaries?: string;
  status: 'active' | 'archived';
};

async function loadCampaignBySlug(slug: string): Promise<CampaignData | null> {
  const campaignsDir = path.join(process.cwd(), 'public', 'campaigns');
  try {
    const files = await fs.readdir(campaignsDir);
    for (const file of files) {
      if (!file.endsWith('.json') || file.startsWith('_')) continue;
      try {
        const raw = await fs.readFile(path.join(campaignsDir, file), 'utf8');
        const data = JSON.parse(raw);
        if (data.slug === slug) {
          return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            description: data.description,
            targetAmount: Number(data.targetAmount) || 0,
            raisedAmount: Number(data.raisedAmount) || 0,
            metricType: data.metricType === 'count' ? 'count' : 'currency',
            metricUnit: data.metricUnit || 'USD',
            beneficiaries: data.beneficiaries || '',
            status: data.status === 'archived' ? 'archived' : 'active',
          };
        }
      } catch {}
    }
  } catch {}
  return null;
}

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
