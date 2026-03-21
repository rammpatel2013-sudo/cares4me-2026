export default function DonatePage() {
  const donationTiers = [
    { amount: "$5", impact: "1 hot meal for a senior", description: "Meals on Wheels USA" },
    { amount: "$10", impact: "1 week prenatal vitamins", description: "Women's Health Network USA" },
    { amount: "$20", impact: "1 month after-school meals", description: "No Kid Hungry USA" },
    { amount: "$50", impact: "1 month safe housing", description: "Domestic Violence Programs USA" },
    { amount: "$100", impact: "1 year student education", description: "India Education Program", featured: true },
    { amount: "$125", impact: "1 day blind school care", description: "Blind School India", featured: true },
    { amount: "Custom", impact: "Your choice of impact", description: "Flexible allocation" },
  ];

  const partners = [
    { name: "Feeding America", type: "Senior Care Network" },
    { name: "Meals on Wheels America", type: "Nutrition Partner" },
    { name: "No Kid Hungry", type: "Child Food Programs" },
    { name: "Women's Aid", type: "Domestic Violence Support" },
    { name: "St. Barnabas Medical Center", type: "Hospital Partner" },
    { name: "Blind School India", type: "Education & Care" },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Make Your Impact</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Every donation goes directly to real people in need. See exactly what your gift provides.
          </p>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Choose Your Level of Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {donationTiers.slice(0, 4).map(({ amount, impact, description }, i) => (
              <div
                key={i}
                className="bg-[#F5F5F5] border-2 border-gray-200 hover:border-[#2BA5D7] p-6 rounded-xl transition cursor-pointer"
              >
                <div className="text-2xl font-black text-[#1E5A96] mb-2">{amount}</div>
                <p className="text-sm font-bold text-[#7CB342] mb-2">{impact}</p>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationTiers.slice(4).map(({ amount, impact, description, featured }, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl transition cursor-pointer ${
                  featured ? "ring-2 ring-[#2BA5D7] bg-[#E8F4F8]" : "bg-[#F5F5F5] border-2 border-gray-200 hover:border-[#2BA5D7]"
                }`}
              >
                <div className="text-2xl font-black text-[#1E5A96] mb-2">{amount}</div>
                <p className="text-sm font-bold text-[#7CB342] mb-2">{impact}</p>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Where Your Donation Goes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition">
                <p className="font-bold text-sm text-[#7CB342]">{partner.name}</p>
                <p className="text-xs text-gray-200">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Why Donate to Care4ME?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl text-[#7CB342] font-bold mb-2">✓</p>
              <p className="text-sm text-gray-700 font-bold">501(c)(3) Verified</p>
            </div>
            <div>
              <p className="text-2xl text-[#7CB342] font-bold mb-2">✓</p>
              <p className="text-sm text-gray-700 font-bold">100% Tax-Deductible</p>
            </div>
            <div>
              <p className="text-2xl text-[#7CB342] font-bold mb-2">✓</p>
              <p className="text-sm text-gray-700 font-bold">Zero Overhead</p>
            </div>
            <div>
              <p className="text-2xl text-[#7CB342] font-bold mb-2">✓</p>
              <p className="text-sm text-gray-700 font-bold">Secure Donation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Giving */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-6">Become a Monthly Supporter</h2>
          <p className="text-xl text-gray-700 mb-8">
            Transform lives every month. Monthly giving powers consistent, sustainable impact.
          </p>
          <button className="bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition">
            Start Monthly Giving
          </button>
        </div>
      </section>
    </main>
  );
}