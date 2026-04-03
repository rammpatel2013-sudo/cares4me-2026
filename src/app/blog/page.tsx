'use client';

import { useEffect, useMemo, useState } from 'react';
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
  inlineImages?: string[];
}

const TILE_SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1'
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroPost = useMemo(() => posts[0], [posts]);
  const remainingPosts = useMemo(() => posts.slice(1), [posts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-44 bg-slate-200" />
                <div className="p-5">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-4/5 rounded bg-slate-200" />
                  <div className="mt-2 h-5 w-2/3 rounded bg-slate-200" />
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)] py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black text-slate-900">Blog</h1>
          <p className="mt-4 text-lg text-slate-600">No blog posts yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)] pb-16">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#0f704f] via-[#1a8a63] to-[#2ba5d7] text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 0.7px, transparent 0.7px)', backgroundSize: '4px 4px' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
            Care4ME Stories
          </span>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">Community Impact, Student Leadership, and Real-World Care</h1>
          <p className="mt-4 max-w-3xl text-base text-white/95 sm:text-lg">
            Browse recent updates from Care4ME. Each story highlights measurable action and the people behind it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        {heroPost && (
          <Link href={`/blog/${heroPost.slug}`} className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_26px_70px_-40px_rgba(15,23,42,0.45)]">
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div className="relative h-64 overflow-hidden sm:h-80 lg:h-full">
                {heroPost.image ? (
                  <img src={`/blog-images/${heroPost.image}`} alt={heroPost.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500">
                    <span className="text-6xl opacity-60">📝</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {heroPost.category.replace('-', ' ')}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{heroPost.title}</h2>
                <p className="mt-4 line-clamp-4 text-slate-600">{heroPost.content.substring(0, 280)}...</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{heroPost.author}</span>
                  <span>•</span>
                  <span>{new Date(heroPost.published).toLocaleDateString()}</span>
                  {!!heroPost.inlineImages?.length && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">+{heroPost.inlineImages.length} inline photos</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3 md:auto-rows-[190px]">
          {remainingPosts.map((post, idx) => {
            const imageSrc = post.image ? `/blog-images/${post.image}` : null;
            return (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${TILE_SPANS[idx % TILE_SPANS.length]}`}
              >
                <div className="absolute inset-0">
                  {imageSrc ? (
                    <img src={imageSrc} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-emerald-300 to-cyan-400" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
                </div>

                <div className="relative flex h-full flex-col justify-end p-4 text-white sm:p-5">
                  <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {post.category.replace('-', ' ')}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-black leading-tight sm:text-base">{post.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-white/90 sm:text-xs">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.published).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
