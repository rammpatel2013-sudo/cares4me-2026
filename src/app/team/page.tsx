'use client';

import { useEffect, useState } from 'react';
import { AnimatedCard } from '../animations';

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  category?: string;
  timestamp?: number;
}

// Hardcoded fallback team members
const defaultTeamMembers: TeamMember[] = [
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

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const res = await fetch('/api/media?destination=team');
        if (res.ok) {
          const data = await res.json();
          
          // Convert Discord uploads to team member format
          const discordMembers: TeamMember[] = data.map((item: any) => ({
            name: item.name || item.caption || 'Team Member',
            title: item.role || item.category || 'Team Member',
            bio: item.bio || item.caption || '',
            image: `/api/image?file=${item.timestamp}-web.webp`,
            category: item.category,
            timestamp: item.timestamp
          }));

          // Combine Discord uploads with default members
          // Discord uploads come first (newest additions)
          if (discordMembers.length > 0) {
            setTeamMembers([...discordMembers, ...defaultTeamMembers]);
          }
        }
      } catch (error) {
        console.error('Error loading team members:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeamMembers();
  }, []);

  // Get unique categories for filter
  const categories = ['all', 'staff', 'volunteers', 'board'];

  // Filter team members
  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.category?.toLowerCase() === filter || m.title?.toLowerCase().includes(filter));

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

      {/* Filter */}
      <section className="py-8 px-4 sm:px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filter === cat
                    ? 'bg-[#1E5A96] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Team' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1E5A96] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading team members...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMembers.map((member, idx) => (
                <div
                  key={member.timestamp || idx}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition border border-gray-100"
                >
                  <div className="overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full max-h-80 object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-team.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1E5A96] mb-1">{member.name}</h3>
                    <p className="text-[#7CB342] font-medium mb-3">{member.title}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No team members found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Join Our Team</h2>
          <p className="text-xl text-gray-200 mb-8">
            Want to make a difference? We're always looking for passionate volunteers and team members.
          </p>
          <a
            href="/volunteer"
            className="inline-block bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition"
          >
            Become a Volunteer
          </a>
        </div>
      </section>
    </main>
  );
}
