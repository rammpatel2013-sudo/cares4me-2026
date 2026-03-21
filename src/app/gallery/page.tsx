'use client';

import { useState, useEffect } from 'react';

interface GalleryItem {
  timestamp: number;
  filename: string;
  destination: string;
  category: string;
  caption: string;
  platforms: string[];
  published: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        // Fallback: Load from public/media-metadata using Next.js public folder
        // In production, fetch from /api/gallery endpoint
        const response = await fetch('/uploads/');
        // For now, use hardcoded for demo
        setItems([]);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  // Fallback if no items
  const fallbackItems = [
    { name: "Student Education Program", image: "Education", impact: "500+ students supported" },
    { name: "Senior Nutrition Drive", image: "Nutrition", impact: "5,000+ meals delivered" },
    { name: "Women's Wellness Initiative", image: "Women", impact: "2,000+ women reached" },
    { name: "Youth Health Literacy", image: "Youth", impact: "800+ youth trained" },
    { name: "Hospital Partnership Launch", image: "Hospital", impact: "6 hospitals partnered" },
    { name: "Blind School Support", image: "School", impact: "100+ students cared for" },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Our Impact Gallery</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            See our campaigns and programs in action. Real work, real people, real impact.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fallbackItems.map((item, idx) => (
              <div key={idx} className="bg-[#F5F5F5] rounded-xl overflow-hidden hover:shadow-lg transition">
                <div className="h-64 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8] flex items-center justify-center">
                  <p className="text-gray-500 text-center font-bold">{item.image} Photo Placeholder</p>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#1E5A96] mb-2">{item.name}</h3>
                  <p className="text-[#7CB342] font-bold text-sm">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uploaded Images Info */}
      <section className="py-12 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            ✅ Gallery uploads via Discord bot are saved to: <code className="bg-white px-2 py-1 rounded">/public/uploads/</code>
          </p>
          <p className="text-gray-500 text-sm mt-2">Phase 2 will add dynamic loading and real-time updates</p>
        </div>
      </section>
    </main>
  );
}