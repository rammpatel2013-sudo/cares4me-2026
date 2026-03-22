'use client';

import { AnimatedCard, AnimatedStatBox } from '../animations';

export default function TransparencyPage() {
  const breakdown = [
    { category: 'Medical Equipment Distribution', percentage: 50, amount: '$63,725' },
    { category: 'Volunteer Support & Training', percentage: 20, amount: '$25,490' },
    { category: 'Shipping & Logistics', percentage: 20, amount: '$25,490' },
    { category: 'Community Outreach', percentage: 10, amount: '$12,745' }
  ];

  const partners = [
    { name: 'Feeding America', programs: 'Food Security', since: '2024' },
    { name: 'Meals on Wheels', programs: 'Senior Care', since: '2024' },
    { name: 'Local Churches & NGOs', programs: 'Community Distribution', since: '2024' },
    { name: 'Hospital Networks', programs: 'Equipment Supply', since: '2025' },
    { name: 'Blind Schools (India)', programs: 'Education Support', since: '2025' },
    { name: 'Community Health Organizations', programs: 'Healthcare Access', since: '2026' }
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Transparency Report</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Complete financial breakdown and program allocation. Trust is earned through transparency.</p>
        </div>
      </section>

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
                    <div className="bg-[#2BA5D7] h-4 rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{item.percentage}% of total donations</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

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
    </main>
  );
}