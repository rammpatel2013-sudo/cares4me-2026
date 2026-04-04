import { promises as fs } from 'fs';
import path from 'path';

export type CampaignItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  metricType: 'currency' | 'count';
  metricUnit: string;
  status: 'active' | 'archived';
  beneficiaries?: string;
  updatedAt?: string;
  _file?: string;
};

export type CampaignImpact = {
  totalRaised: string;
  averageFunded: string;
  livesImpacted: string;
  activeCampaigns: string;
};

export const defaultImpact: CampaignImpact = {
  totalRaised: '$0',
  averageFunded: '0%',
  livesImpacted: '0',
  activeCampaigns: '0',
};

async function loadCampaignFiles(): Promise<CampaignItem[]> {
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
          _file: file,
        });
      } catch {}
    }

    return campaigns.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  } catch {
    return [];
  }
}

export async function loadCampaigns(options?: { includeArchived?: boolean }) {
  const campaigns = await loadCampaignFiles();
  if (options?.includeArchived) return campaigns;
  return campaigns.filter((item) => item.status === 'active');
}

export async function loadCampaignBySlug(slug: string) {
  const campaigns = await loadCampaignFiles();
  return campaigns.find((item) => item.slug === slug) || null;
}

export async function loadImpact(): Promise<CampaignImpact> {
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
