import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CampaignItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  metricType?: 'currency' | 'count';
  metricUnit?: string;
  status: 'active' | 'archived';
  beneficiaries?: string;
  updatedAt?: string;
};

type CampaignImpact = {
  totalRaised: string;
  averageFunded: string;
  livesImpacted: string;
  activeCampaigns: string;
};

const defaultImpact: CampaignImpact = {
  totalRaised: '$0',
  averageFunded: '0%',
  livesImpacted: '0',
  activeCampaigns: '0',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatMetric(value: number, metricType: 'currency' | 'count', metricUnit?: string) {
  if (metricType === 'currency') {
    return formatCurrency(value);
  }
  return `${Math.round(value).toLocaleString('en-US')} ${metricUnit || 'items'}`;
}

function computePercentage(raised: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((raised / target) * 100)));
}

async function loadCampaigns(): Promise<CampaignItem[]> {
  const campaignsDir = path.join(process.cwd(), 'public', 'campaigns');

  try {
    await fs.mkdir(campaignsDir, { recursive: true });
    const files = await fs.readdir(campaignsDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json') && !file.startsWith('_'));

    const campaigns: CampaignItem[] = [];

    for (const file of jsonFiles) {
      try {
        const raw = await fs.readFile(path.join(campaignsDir, file), 'utf8');
        const data = JSON.parse(raw);

        campaigns.push({
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          targetAmount: Number(data.targetAmount) || 0,
          raisedAmount: Number(data.raisedAmount) || 0,
          metricType: data.metricType === 'count' ? 'count' : 'currency',
          metricUnit: data.metricUnit || 'USD',
          status: data.status === 'archived' ? 'archived' : 'active',
          beneficiaries: data.beneficiaries || '',
          updatedAt: data.updatedAt || data.createdAt,
        });
      } catch {}
    }

    return campaigns
      .filter((item) => item.status === 'active')
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  } catch {
    return [];
  }
}

async function loadImpact(): Promise<CampaignImpact> {
  const impactFile = path.join(process.cwd(), 'public', 'campaigns', '_impact.json');

  try {
    const raw = await fs.readFile(impactFile, 'utf8');
    const data = JSON.parse(raw);

    return {
      totalRaised: data.totalRaised || defaultImpact.totalRaised,
      averageFunded: data.averageFunded || defaultImpact.averageFunded,
      livesImpacted: data.livesImpacted || defaultImpact.livesImpacted,
      activeCampaigns: data.activeCampaigns || defaultImpact.activeCampaigns,
    };
  } catch {
    return defaultImpact;
  }
}

export default async function CampaignsPage() {
  const campaigns = await loadCampaigns();
  const impact = await loadImpact();

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Current Campaigns</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Support the campaigns transforming lives right now. See where your donation goes.
          </p>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="text-2xl font-black text-[#1E5A96]">No Active Campaigns Yet</h3>
              <p className="mt-2 text-slate-600">Create campaigns from Discord using the campaign commands.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const percentage = computePercentage(campaign.raisedAmount, campaign.targetAmount);
                const metricType = campaign.metricType === 'count' ? 'count' : 'currency';
                const metricUnit = campaign.metricUnit || (metricType === 'currency' ? 'USD' : 'items');

                return (
                  <div key={campaign.id} className="bg-[#F5F5F5] rounded-xl p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold text-[#1E5A96] mb-2">{campaign.title}</h3>
                    <p className="text-gray-700 text-sm mb-4">{campaign.description}</p>

                    {!!campaign.beneficiaries && (
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#2BA5D7]">Impact: {campaign.beneficiaries}</p>
                    )}

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">Progress</span>
                        <span className="text-sm text-gray-600">{formatMetric(campaign.raisedAmount, metricType, metricUnit)} of {formatMetric(campaign.targetAmount, metricType, metricUnit)}</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-[#7CB342] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{percentage}% funded</p>
                    </div>

                    <a
                      href={`/campaigns/${campaign.slug}/pay`}
                      className="w-full block text-center bg-[#2BA5D7] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#1E5A96] transition"
                    >
                      Support This Campaign
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Campaign Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">{impact.totalRaised}</div>
              <p className="text-gray-100">Total Raised</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">{impact.averageFunded}</div>
              <p className="text-gray-100">Average Funded</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">{impact.livesImpacted}</div>
              <p className="text-gray-100">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">{impact.activeCampaigns}</div>
              <p className="text-gray-100">Active Campaigns</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}