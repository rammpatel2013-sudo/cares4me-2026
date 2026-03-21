export default function CampaignsPage() {
  const campaigns = [
    {
      name: "Student Education Program",
      description: "$100 = 1 year of full education for a student in India",
      target: "$75,000",
      raised: "$50,000",
      percentage: 67,
    },
    {
      name: "Senior Nutrition Drive",
      description: "Providing 5,000+ meals to seniors facing hunger and isolation",
      target: "$50,000",
      raised: "$40,000",
      percentage: 80,
    },
    {
      name: "Women's Wellness Initiative",
      description: "Health education and support for women in underserved communities",
      target: "$40,000",
      raised: "$28,000",
      percentage: 70,
    },
    {
      name: "Youth Health Literacy",
      description: "Training young people about reproductive and preventive health",
      target: "$30,000",
      raised: "$18,000",
      percentage: 60,
    },
    {
      name: "Hospital Partnerships",
      description: "Expanding partnerships with 10+ hospitals for community reach",
      target: "$60,000",
      raised: "$55,000",
      percentage: 92,
    },
    {
      name: "Blind School Support",
      description: "$125 = 1 full day of care for 50+ blind students",
      target: "$25,000",
      raised: "$22,000",
      percentage: 88,
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, idx) => (
              <div key={idx} className="bg-[#F5F5F5] rounded-xl p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-[#1E5A96] mb-2">{campaign.name}</h3>
                <p className="text-gray-700 text-sm mb-4">{campaign.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">Progress</span>
                    <span className="text-sm text-gray-600">{campaign.raised} of {campaign.target}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-[#7CB342] h-2 rounded-full"
                      style={{ width: `${campaign.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{campaign.percentage}% funded</p>
                </div>
                
                <a
                  href="/donate"
                  className="w-full block text-center bg-[#2BA5D7] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#1E5A96] transition"
                >
                  Support This Campaign
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Campaign Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">$213K</div>
              <p className="text-gray-100">Total Raised</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">75%</div>
              <p className="text-gray-100">Average Funded</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">1000+</div>
              <p className="text-gray-100">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">6</div>
              <p className="text-gray-100">Active Campaigns</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}