import { loadCampaignBySlug } from '@/lib/getCampaigns';
import { loadHomeContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

function formatMetric(value: number, metricType: 'currency' | 'count', metricUnit: string) {
  if (metricType === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return `${Math.round(value).toLocaleString('en-US')} ${metricUnit || 'items'}`;
}

function computePercentage(raised: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((raised / target) * 100)));
}

function buttonClass(style: string) {
  switch (style) {
    case 'primary-green':
      return 'bg-[#7CB342] text-white hover:bg-[#6BA032]';
    case 'outline-white':
      return 'border-2 border-white text-white hover:bg-white hover:text-[#1E5A96]';
    case 'primary-blue':
    default:
      return 'bg-[#2BA5D7] text-white hover:bg-[#1E5A96]';
  }
}

function resolveImageSrc(imageSrc: string) {
  if (!imageSrc) return '';

  if (imageSrc.startsWith('/uploads/') || imageSrc.startsWith('/blog-images/') || imageSrc.startsWith('/images/')) {
    const filename = imageSrc.split('/').filter(Boolean).pop();
    return filename ? `/api/image?file=${encodeURIComponent(filename)}` : imageSrc;
  }

  return imageSrc;
}

export default async function HomePage() {
  const content = await loadHomeContent();
  const linkedCampaign = content.featuredCampaign.slug
    ? await loadCampaignBySlug(content.featuredCampaign.slug)
    : null;

  const featuredTitle = linkedCampaign?.title || content.featuredCampaign.fallbackTitle;
  const featuredDescription = linkedCampaign?.description || content.featuredCampaign.fallbackDescription;
  const featuredRaised = linkedCampaign?.raisedAmount ?? content.featuredCampaign.fallbackRaised;
  const featuredTarget = linkedCampaign?.targetAmount ?? content.featuredCampaign.fallbackTarget;
  const featuredMetricType: 'currency' | 'count' =
    (linkedCampaign?.metricType ?? content.featuredCampaign.fallbackMetricType) === 'count' ? 'count' : 'currency';
  const featuredMetricUnit = linkedCampaign?.metricUnit ?? content.featuredCampaign.fallbackMetricUnit;
  const featuredPercentage = computePercentage(featuredRaised, featuredTarget);
  const featuredImageSrc = resolveImageSrc(content.featuredCampaign.imageSrc || '');

  return (
    <main className="bg-white">
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#F5F5F5] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6 leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">{content.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={content.hero.primaryButton.href}
                  className="bg-[#2BA5D7] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1E5A96] transition text-center"
                >
                  {content.hero.primaryButton.label}
                </a>
                <a
                  href={content.hero.secondaryButton.href}
                  className="border-2 border-[#7CB342] text-[#7CB342] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#7CB342] hover:text-white transition text-center"
                >
                  {content.hero.secondaryButton.label}
                </a>
              </div>
            </div>
            <div className="bg-[#E8F4F8] rounded-2xl p-12 h-96 flex items-center justify-center overflow-hidden">
              {content.hero.media.imageSrc ? (
                <img
                  src={content.hero.media.imageSrc}
                  alt={content.hero.media.imageAlt || content.hero.title}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="text-center">
                  <p className="text-[#2BA5D7] text-sm font-bold uppercase mb-2">{content.hero.media.eyebrow}</p>
                  <p className="text-2xl font-bold text-[#1E5A96]">{content.hero.media.headline}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {content.quickStats.map((item, idx) => (
              <div key={`${item.label}-${idx}`} className="text-center">
                <div className="text-4xl font-black mb-2" style={{ color: item.color }}>{item.value}</div>
                <p className="text-gray-700 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">{content.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.howItWorks.cards.map((card, idx) => (
              <div key={`${card.title}-${idx}`} className="bg-white p-8 rounded-xl border-l-4" style={{ borderLeftColor: card.color }}>
                <div className="text-3xl font-black mb-4" style={{ color: card.color }}>{card.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Featured Campaign</h2>
          <div className="bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8] rounded-2xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-96 bg-[#D0E8F2] rounded-xl flex items-center justify-center overflow-hidden">
              {featuredImageSrc ? (
                <img
                  src={featuredImageSrc}
                  alt={content.featuredCampaign.imageAlt || featuredTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="text-gray-500 text-center">{content.featuredCampaign.imagePlaceholder}</p>
              )}
            </div>
            <div>
              <p className="text-[#2BA5D7] font-bold uppercase mb-2">{content.featuredCampaign.eyebrow}</p>
              <h3 className="text-3xl font-black text-[#1E5A96] mb-4">{featuredTitle}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{featuredDescription}</p>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900">Progress</span>
                  <span className="text-gray-600">
                    {formatMetric(featuredRaised, featuredMetricType, featuredMetricUnit)} of {formatMetric(featuredTarget, featuredMetricType, featuredMetricUnit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#7CB342] h-3 rounded-full" style={{ width: `${featuredPercentage}%` }}></div>
                </div>
              </div>
              <a
                href={linkedCampaign ? `/campaigns/${linkedCampaign.slug}/pay` : content.featuredCampaign.ctaHref}
                className="bg-[#7CB342] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6BA032] transition inline-block"
              >
                {content.featuredCampaign.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">{content.cta.title}</h2>
          <p className="text-xl mb-8 text-gray-100">{content.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {content.cta.buttons.map((button, idx) => (
              <a
                key={`${button.label}-${idx}`}
                href={button.href}
                className={`${buttonClass(button.style)} px-8 py-4 rounded-lg font-bold text-lg transition`}
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}