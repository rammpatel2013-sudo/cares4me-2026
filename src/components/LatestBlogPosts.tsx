// src/components/LatestBlogPosts.tsx
// Shows latest 3 blog posts as tiles on homepage

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  published: string;
  image?: string;
  imageType?: string;
}

function getBlogImageUrl(image: string | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.endsWith('.webp') && (image.startsWith('ai-') || image.startsWith('upload-'))) {
    return `/blog-images/${image}`;
  }
  return `/api/image?file=${image}`;
}

export default function LatestBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data.slice(0, 3)); // Only show latest 3
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-8">Latest Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#1E5A96]">Latest Stories</h2>
          <Link 
            href="/blog" 
            className="text-[#2BA5D7] font-bold hover:text-[#1E5A96] transition"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const imageUrl = getBlogImageUrl(post.image);
            
            return (
              <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1E5A96] to-[#7CB342] flex items-center justify-center">
                        <span className="text-white/20 text-5xl font-black">C4M</span>
                      </div>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-[#7CB342] text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                      {post.category}
                    </div>
                    
                    {/* AI badge */}
                    {post.imageType === 'ai' && (
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        🎨 AI
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E5A96] transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(post.published).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
