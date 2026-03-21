'use client';

import { AnimatedCard, AnimatedStatBox } from './animations';

export default function TransparencyPage() {
  const breakdown = [
    { category: 'Education Programs (India)', percentage: 35, amount: '$44,710' },
    { category: 'Senior Care & Nutrition', percentage: 28, amount: '$35,686' },
    { category: 'Women Wellness Initiative', percentage: 22, amount: '$28,038' },
    { category: 'Healthcare Access', percentage: 15, amount: '$19,116' },
  ];

  const partners = [
    { name: 'Blind School of Bombay', programs: 'Education Support', since: '2024' },
    { name: 'Meals on Wheels America', programs: 'Senior Nutrition', since: '2025' },
    { name: 'Feeding America', programs: 'Food Security', since: '2025' },
    { name: 'American Hospital Association', programs: 'Healthcare Access', since: '2026' },
    { name: 'Girls Who Code', programs: 'STEM Education', since: '2026' },
    { name: 'United Nations Women', programs: 'Women Empowerment', since: '2026' },
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Transparency Report</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Complete financial breakdown and program allocation. Trust is earned through transparency.
          </p>
        </div>
      </section>

      {/* Budget Allocation */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Budget Allocation</h2>
          <div className="space-y-6">
            {breakdown.map((item, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] p-6 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold text-[#1E5A96]">{item.category}</h3>
                    <span className="font-bold text-[#7CB342]">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-[#2BA5D7] h-4 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{item.percentage}% of total donations</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Organizations */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Verified Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white p-6 rounded-xl border-l-4 border-[#7CB342]">
                  <h3 className="font-bold text-[#1E5A96] mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{partner.programs}</p>
                  <p className="text-xs text-[#7CB342]">Partner since {partner.since}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Key Commitments */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Our Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedCard>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold text-[#1E5A96] mb-2">100% Direct</h3>
                <p className="text-sm text-gray-600">All donations go directly to programs</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-bold text-[#1E5A96] mb-2">Monthly Reports</h3>
                <p className="text-sm text-gray-600">Detailed program updates monthly</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-bold text-[#1E5A96] mb-2">Audited Financials</h3>
                <p className="text-sm text-gray-600">Third-party verified annually</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-bold text-[#1E5A96] mb-2">Impact Verified</h3>
                <p className="text-sm text-gray-600">On-ground verification of all programs</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </main>
  );
}
