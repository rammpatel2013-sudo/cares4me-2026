import { loadPartnersContent } from '@/lib/singletonContent';

export const dynamic = 'force-dynamic';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NGO';
}

export default async function PartnersPage() {
  const content = await loadPartnersContent();
  const sliderItems = [...content.ngos.items, ...content.ngos.items];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">{content.hero.title}</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">{content.partners.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.partners.items.map((partner, idx) => (
              <div key={idx} className="bg-[#F5F5F5] p-6 rounded-lg text-center hover:bg-[#E8F4F8] transition">
                <p className="font-bold text-[#1E5A96] mb-1">{partner.name}</p>
                <p className="text-sm text-[#7CB342]">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-4">{content.ngos.title}</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">{content.ngos.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {content.ngos.items.map((ngo, idx) => (
              <a
                key={`${ngo.name}-${idx}`}
                href={ngo.href || '#'}
                target={ngo.href ? '_blank' : undefined}
                rel={ngo.href ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-xl p-6 border border-[#D7E8F3] hover:shadow-md transition"
              >
                <div className="h-14 mb-4 flex items-center justify-center">
                  {ngo.logoSrc ? (
                    <img src={ngo.logoSrc} alt={`${ngo.name} logo`} className="max-h-14 object-contain" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[#E8F4F8] text-[#1E5A96] font-black flex items-center justify-center">
                      {getInitials(ngo.name)}
                    </div>
                  )}
                </div>
                <p className="text-center font-bold text-[#1E5A96]">{ngo.name}</p>
              </a>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#D7E8F3] bg-white py-6">
            <div className="ngo-marquee-track flex w-max gap-4 px-4">
              {sliderItems.map((ngo, idx) => (
                <a
                  key={`${ngo.name}-slide-${idx}`}
                  href={ngo.href || '#'}
                  target={ngo.href ? '_blank' : undefined}
                  rel={ngo.href ? 'noopener noreferrer' : undefined}
                  className="min-w-[220px] rounded-xl border border-[#E2EEF6] bg-[#FAFCFF] px-4 py-3 flex items-center gap-3 hover:border-[#2BA5D7] transition"
                >
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#E8F4F8] overflow-hidden shrink-0">
                    {ngo.logoSrc ? (
                      <img src={ngo.logoSrc} alt={`${ngo.name} logo`} className="max-h-8 object-contain" />
                    ) : (
                      <span className="text-xs font-black text-[#1E5A96]">{getInitials(ngo.name)}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#1E5A96] truncate">{ngo.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">{content.cta.title}</h2>
          <p className="text-xl mb-8 text-gray-100">{content.cta.description}</p>
          <a
            href={content.cta.buttonHref}
            className="bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition inline-block"
          >
            {content.cta.buttonLabel}
          </a>
        </div>
      </section>
    </main>
  );
}