// src/app/blog/page.tsx
// Dynamic blog listing page - no rebuild needed!

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  published: string;
  status: string;
  image?: string;
  imageType?: 'ai' | 'upload';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Blog</h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Blog</h1>
          <p className="text-gray-600 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Blog</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageSrc = post.image ? `/blog-images/${post.image}` : null;
            
            return (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-50">📝</span>
                      </div>
                    )}
                    {post.imageType === 'ai' && imageSrc && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1">
                        <span>✨</span> AI Generated
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wider mb-2">
                      {post.category.replace('-', ' ')}
                    </span>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                      <span>{post.author}</span>
                      <span>{new Date(post.published).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
