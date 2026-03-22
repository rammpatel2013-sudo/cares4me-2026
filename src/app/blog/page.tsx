'use client';

import { AnimatedCard } from '../animations';

export default function BlogPage() {
  const stories = [
    { title: 'How Care4ME Started: A Student\'s Mission', excerpt: 'Darsh Gajera\'s journey from garage to global impact.', image: '🚀', date: 'March 20, 2026', author: 'Care4ME Team' },
    { title: 'Meet Our Volunteers', excerpt: 'The incredible people making our mission possible.', image: '🤝', date: 'March 18, 2026', author: 'Volunteer Stories' },
    { title: 'Equipment That Changes Lives', excerpt: 'Real stories of families receiving wheelchairs and medical equipment.', image: '❤️', date: 'March 15, 2026', author: 'Impact Stories' },
    { title: 'Partnership Highlights', excerpt: 'How we work with NGOs and churches around the world.', image: '🌍', date: 'March 12, 2026', author: 'Partnership Program' }
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Stories & Blog</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Real stories of real impact. See how donations change lives.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
                  <div className="bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8] h-48 flex items-center justify-center text-6xl">{story.image}</div>
                  <div className="p-6">
                    <p className="text-sm text-[#7CB342] font-bold mb-2">{story.date}</p>
                    <h3 className="text-xl font-black text-[#1E5A96] mb-3">{story.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{story.excerpt}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{story.author}</span>
                      <a href="#" className="text-[#2BA5D7] font-bold hover:text-[#1E5A96]">Read →</a>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}