export default function PartnersPage() {
  const tiers = [
    {
      amount: "$5K/month",
      benefits: ["Logo on website", "Quarterly impact reports", "Newsletter mention"],
    },
    {
      amount: "$25K/month",
      benefits: ["Branded program", "Event naming rights", "Custom reports"],
    },
    {
      amount: "$100K+",
      benefits: ["Custom partnership", "Co-branded campaigns", "Executive briefings"],
    },
  ];

  const partners = [
    { name: "St. Barnabas Medical Center", type: "Hospital Partner" },
    { name: "Feeding America", type: "Senior Care Network" },
    { name: "Meals on Wheels America", type: "Nutrition Partner" },
    { name: "No Kid Hungry", type: "Child Welfare" },
    { name: "Women's Aid", type: "Social Support" },
    { name: "Blind School India", type: "Education Partner" },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Partner With Us</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Hospitals, corporations, and organizations trust Care4ME. Join us in transforming lives.
          </p>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Partnership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border-2 border-[#2BA5D7] hover:shadow-xl transition">
                <h3 className="text-2xl font-black text-[#1E5A96] mb-6">{tier.amount}</h3>
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className="text-[#7CB342] font-bold">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-[#2BA5D7] text-white font-bold py-3 rounded-lg hover:bg-[#1E5A96] transition">
                  Inquire
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Our Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div key={idx} className="bg-[#F5F5F5] p-6 rounded-lg text-center hover:bg-[#E8F4F8] transition">
                <p className="font-bold text-[#1E5A96] mb-1">{partner.name}</p>
                <p className="text-sm text-[#7CB342]">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Partner?</h2>
          <p className="text-xl mb-8 text-gray-100">Let's talk about how we can work together to create real impact.</p>
          <a
            href="mailto:info@caresforu.com"
            className="bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition inline-block"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}