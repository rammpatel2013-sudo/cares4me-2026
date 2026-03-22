'use client';

import { AnimatedCard } from '../animations';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Aamya",
      title: "Team Member",
      bio: "Dedicated to restoring health and making a difference in underserved communities.",
      image: "/images/aamya.jpg"
    },
    {
      name: "Hanna",
      title: "Team Member",
      bio: "Committed to ensuring every donation reaches those who need it most.",
      image: "/images/hanna.jpg"
    },
    {
      name: "Laila",
      title: "Team Member",
      bio: "Passionate about building partnerships and expanding our impact globally.",
      image: "/images/laila.jpg"
    },
    {
      name: "Simryn",
      title: "Team Member",
      bio: "Focused on transparency and trust-based relationships with our partners.",
      image: "/images/simryn.jpg"
    },
    {
      name: "Unnati",
      title: "Team Member",
      bio: "Working to bring medical equipment to those who need it the most.",
      image: "/images/unnati.jpg"
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Meet the Team</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Meet the dedicated people behind Care4ME. We're driven by a shared mission: Restoring health and renewing hope one step at a time.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] rounded-xl overflow-hidden hover:shadow-lg transition">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-black text-[#1E5A96] mb-1">{member.name}</h3>
                    <p className="text-[#7CB342] font-bold text-sm mb-4">{member.title}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Stats */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Organization Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">501(c)(3)</div>
              <p className="text-gray-100">Registered Nonprofit</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">2020</div>
              <p className="text-gray-100">Founded</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">6</div>
              <p className="text-gray-100">Staff Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#7CB342] mb-2">18</div>
              <p className="text-gray-100">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Restoring health and renewing hope through education, partnership, and direct action. We believe every person deserves access to health information, resources, and dignity — regardless of geography or economic status.
          </p>
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#7CB342]">
            <p className="text-lg font-bold text-[#1E5A96]">100% of donations fund programs directly. Zero overhead. Real impact.</p>
          </div>
        </div>
      </section>
    </main>
  );
}