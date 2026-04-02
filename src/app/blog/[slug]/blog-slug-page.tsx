// src/app/blog/[slug]/page.tsx
// Dynamic blog post page - no rebuild needed!

'use client';

import { useState, useEffect, use } from 'react';
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

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/blog?slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.published).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Image path - images are stored in /blog-images/
  const imageSrc = post.image ? `/blog-images/${post.image}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/blog" className="text-green-600 hover:text-green-700 font-medium mb-8 inline-block">
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
              {post.category.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </header>

        {/* Featured Image */}
        {imageSrc && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg relative">
            <img
              src={imageSrc}
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {post.imageType === 'ai' && (
              <span className="absolute bottom-4 right-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1">
                <span>✨</span> AI Generated
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this post</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Facebook
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
