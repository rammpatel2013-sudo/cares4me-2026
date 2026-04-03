import { readdir, readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

// FORCE DYNAMIC - No rebuild needed!
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  inlineImages?: string[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const blogDir = path.join(process.cwd(), 'public', 'blog-posts');
  
  try {
    const files = await readdir(blogDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(path.join(blogDir, file), 'utf8');
        const post = JSON.parse(content);
        if (post.slug === slug && post.status === 'published') {
          return post;
        }
      }
    }
  } catch (e) {}
  
  return null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  // Image path - images are stored in /blog-images/
  const imageSrc = post.image ? `/blog-images/${post.image}` : null;
  const inlineImages = (post.inlineImages || []).map((img) => `/blog-images/${img}`);
  const paragraphs = post.content.split('\n\n').filter((p) => p.trim());

  const contentBlocks: ReactNode[] = [];
  let inlineCursor = 0;

  paragraphs.forEach((paragraph, idx) => {
    contentBlocks.push(
      <p key={`p-${idx}`} className={`text-slate-700 leading-8 mb-6 ${idx === 0 ? 'text-xl text-slate-900' : 'text-lg'}`}>
        {paragraph}
      </p>
    );

    const shouldPlaceImage = inlineCursor < inlineImages.length && (idx === 0 || (idx + 1) % 2 === 0);
    if (shouldPlaceImage) {
      const imagePath = inlineImages[inlineCursor];
      contentBlocks.push(
        <figure key={`img-${idx}-${inlineCursor}`} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)]">
          <img src={imagePath} alt={`${post.title} image ${inlineCursor + 1}`} className="h-auto w-full object-cover" />
        </figure>
      );
      inlineCursor += 1;
    }
  });

  while (inlineCursor < inlineImages.length) {
    const imagePath = inlineImages[inlineCursor];
    contentBlocks.push(
      <figure key={`img-tail-${inlineCursor}`} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)]">
        <img src={imagePath} alt={`${post.title} image ${inlineCursor + 1}`} className="h-auto w-full object-cover" />
      </figure>
    );
    inlineCursor += 1;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)]">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#0f704f] via-[#1a8a63] to-[#2ba5d7] text-white">
        <div className="max-w-5xl mx-auto">
          <Link href="/blog" className="text-white/95 hover:text-white font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>
          <span className="inline-block text-xs font-bold uppercase tracking-wide bg-white/20 border border-white/30 rounded-full px-3 py-1 mb-4">
            {post.category.replace('-', ' ')}
          </span>
          <h1 className="text-4xl lg:text-6xl font-black mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/95">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{new Date(post.published).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {imageSrc && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative">
          <img 
            src={imageSrc}
            alt={post.title}
            className="w-full h-auto rounded-3xl shadow-[0_30px_70px_-35px_rgba(0,0,0,0.7)]"
          />
          {post.imageType === 'ai' && (
            <div className="absolute top-4 right-8 bg-black/50 text-white text-xs sm:text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              🎨 AI Generated
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-[0_20px_60px_-38px_rgba(0,0,0,0.4)]">
          {contentBlocks}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1E5A96] mb-4">Want to Make a Difference?</h2>
          <p className="text-gray-600 mb-6">Join us in our mission to restore health and renew hope.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/donate"
              className="bg-[#7CB342] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#689F38] transition-colors"
            >
              Donate Now
            </Link>
            <Link 
              href="/volunteer"
              className="border-2 border-[#1E5A96] text-[#1E5A96] px-6 py-3 rounded-lg font-semibold hover:bg-[#1E5A96] hover:text-white transition-colors"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
