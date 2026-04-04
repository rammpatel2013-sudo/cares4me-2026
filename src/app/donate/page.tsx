import { loadDonateContent } from '@/lib/singletonContent';
import { loadCampaigns } from '@/lib/getCampaigns';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
  const content = await loadDonateContent();
  const campaigns = await loadCampaigns();
  const primaryCampaign = campaigns[0] || null;

  const getTierHref = (amount: string) => {
    if (!primaryCampaign) return '/campaigns';
    const numericAmount = Number(String(amount).replace(/[^0-9.]/g, ''));
    if (Number.isFinite(numericAmount) && numericAmount > 0) {
      return `/campaigns/${primaryCampaign.slug}/pay?amount=${numericAmount}`;
    }
    return `/campaigns/${primaryCampaign.slug}/pay`;
  };

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">{content.hero.title}</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {content.hero.description}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Choose Your Level of Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {content.tiers.slice(0, 4).map(({ amount, impact, description }, i) => (
              <a
                key={i}
                href={getTierHref(amount)}
                className="bg-[#F5F5F5] border-2 border-gray-200 hover:border-[#2BA5D7] p-6 rounded-xl transition cursor-pointer"
              >
                <div className="text-2xl font-black text-[#1E5A96] mb-2">{amount}</div>
                <p className="text-sm font-bold text-[#7CB342] mb-2">{impact}</p>
                <p className="text-xs text-gray-600">{description}</p>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.tiers.slice(4).map(({ amount, impact, description, featured }, i) => (
              <a
                key={i}
                href={getTierHref(amount)}
                className={`p-6 rounded-xl transition cursor-pointer ${
                  featured ? "ring-2 ring-[#2BA5D7] bg-[#E8F4F8]" : "bg-[#F5F5F5] border-2 border-gray-200 hover:border-[#2BA5D7]"
                }`}
              >
                <div className="text-2xl font-black text-[#1E5A96] mb-2">{amount}</div>
                <p className="text-sm font-bold text-[#7CB342] mb-2">{impact}</p>
                <p className="text-xs text-gray-600">{description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">{content.partners.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.partners.items.map((partner, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition">
                <p className="font-bold text-sm text-[#7CB342]">{partner.name}</p>
                <p className="text-xs text-gray-200">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">{content.trustBadges.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.trustBadges.items.map((item, i) => (
              <div key={`${item}-${i}`}>
                <p className="text-2xl text-[#7CB342] font-bold mb-2">✓</p>
                <p className="text-sm text-gray-700 font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-6">{content.monthlyGiving.title}</h2>
          <p className="text-xl text-gray-700 mb-8">
            {content.monthlyGiving.description}
          </p>
          <a
            href={primaryCampaign ? `/campaigns/${primaryCampaign.slug}/pay` : '/campaigns'}
            className="inline-block bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition"
          >
            {content.monthlyGiving.buttonLabel}
          </a>
        </div>
      </section>
    </main>
  );
}