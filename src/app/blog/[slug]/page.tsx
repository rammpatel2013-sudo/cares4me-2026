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
  status?: string;
  image?: string;
  imageType?: string;
  inlineImages?: string[];
}

type TextStyle = 'gradient' | 'glass' | 'plain';

async function getPublishedPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'public', 'blog-posts');

  try {
    const files = await readdir(blogDir);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(path.join(blogDir, file), 'utf8');
        const post = JSON.parse(content);
        if (post.status === 'published') {
          posts.push(post);
        }
      }
    }

    return posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  } catch (e) {
    return [];
  }
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const allPosts = await getPublishedPosts();
  const post = allPosts.find((item) => item.slug === slug) ?? null;

  if (!post) {
    notFound();
  }

  const styleInput = query.textStyle;
  const requestedStyle = Array.isArray(styleInput) ? styleInput[0] : styleInput;
  const textStyle: TextStyle = requestedStyle === 'glass' || requestedStyle === 'plain' ? requestedStyle : 'gradient';
  const relatedPosts = allPosts.filter((item) => item.slug !== slug).slice(0, 4);

  // Image path - images are stored in /blog-images/
  const imageSrc = post.image ? `/blog-images/${post.image}` : null;
  const inlineImages = (post.inlineImages || []).map((img) => `/blog-images/${img}`);
  const paragraphs = post.content.split('\n\n').filter((p) => p.trim());
  const dek = paragraphs[0]
    ? `${paragraphs[0].slice(0, 220).trim()}${paragraphs[0].length > 220 ? '...' : ''}`
    : 'A closer look at the work, people, and community momentum behind this Care4ME story.';
  const pullQuoteSource = paragraphs[Math.min(1, Math.max(paragraphs.length - 1, 0))] || paragraphs[0] || '';
  const pullQuote = pullQuoteSource
    ? `${pullQuoteSource.slice(0, 180).trim()}${pullQuoteSource.length > 180 ? '...' : ''}`
    : 'Community stories should feel lived-in, human, and visually rich.';
  const estimatedReadMinutes = Math.max(1, Math.round(post.content.split(/\s+/).filter(Boolean).length / 180));

  const textStyleClasses: Record<TextStyle, string> = {
    gradient:
      'border-emerald-100 bg-[linear-gradient(165deg,#ffffff_0%,#f5fbf7_46%,#eef8ff_100%)]',
    glass: 'border-white/70 bg-white/65 backdrop-blur-sm',
    plain: 'border-slate-200 bg-white',
  };

  const contentBlocks: ReactNode[] = [];
  let inlineCursor = 0;

  paragraphs.forEach((paragraph, idx) => {
    contentBlocks.push(
      idx === 0 ? (
        <p key={`p-${idx}`} className="mb-8 text-[1.18rem] leading-9 text-slate-800 sm:text-[1.28rem]">
          <span className="float-left mr-3 mt-1 font-serif text-6xl font-bold leading-none text-emerald-800 sm:text-7xl">
            {paragraph.charAt(0)}
          </span>
          <span className="font-medium text-slate-900">{paragraph.slice(1)}</span>
        </p>
      ) : (
        <p key={`p-${idx}`} className="mb-7 text-lg leading-8 text-slate-700 sm:text-[1.06rem]">
          {paragraph}
        </p>
      )
    );

    if (idx === 1) {
      contentBlocks.push(
        <blockquote
          key="pull-quote"
          className="my-10 border-y border-emerald-200 bg-[linear-gradient(135deg,rgba(240,253,244,0.95),rgba(236,254,255,0.9))] px-6 py-6 text-2xl font-black leading-tight text-slate-900 shadow-[0_20px_40px_-35px_rgba(16,185,129,0.8)] sm:px-8 sm:text-[2rem]"
          style={{ fontVariationSettings: "'wght' 820" }}
        >
          “{pullQuote}”
        </blockquote>
      );
    }

    const shouldPlaceImage = inlineCursor < inlineImages.length && (idx === 0 || (idx + 1) % 2 === 0);
    if (shouldPlaceImage) {
      const imagePath = inlineImages[inlineCursor];
      const editorialFigureClass =
        inlineCursor % 2 === 0
          ? 'lg:mr-12 lg:w-[88%]'
          : 'lg:ml-12 lg:w-[88%]';

      contentBlocks.push(
        <figure
          key={`img-${idx}-${inlineCursor}`}
          className={`my-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 p-3 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)] ${editorialFigureClass}`}
        >
          <img
            src={imagePath}
            alt={`${post.title} image ${inlineCursor + 1}`}
            className="mx-auto block max-h-[70vh] w-auto max-w-full rounded-[1.2rem] object-contain"
          />
        </figure>
      );
      inlineCursor += 1;
    }
  });

  while (inlineCursor < inlineImages.length) {
    const imagePath = inlineImages[inlineCursor];
    contentBlocks.push(
      <figure key={`img-tail-${inlineCursor}`} className="my-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 p-3 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)] lg:w-[88%]">
        <img src={imagePath} alt={`${post.title} image ${inlineCursor + 1}`} className="mx-auto block max-h-[70vh] w-auto max-w-full rounded-[1.2rem] object-contain" />
      </figure>
    );
    inlineCursor += 1;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)]">
      {/* Header */}
      <section className="px-4 py-12 text-white sm:px-6 bg-gradient-to-br from-[#0f704f] via-[#1a8a63] to-[#2ba5d7]">
        <div className="mx-auto max-w-6xl">
          <Link href="/blog" className="text-white/95 hover:text-white font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>
          <span className="inline-block text-xs font-bold uppercase tracking-wide bg-white/20 border border-white/30 rounded-full px-3 py-1 mb-4">
            {post.category.replace('-', ' ')}
          </span>
          <h1 className="text-4xl lg:text-6xl font-black mb-4">{post.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-white/92 sm:text-[1.18rem]">{dek}</p>
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
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#f8fafc,#e2f5ef)] p-4 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.7)] sm:p-5">
            <img src={imageSrc} alt={post.title} className="mx-auto block max-h-[78vh] w-auto max-w-full rounded-[1.5rem] object-contain" />
            {post.imageType === 'ai' && (
              <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm sm:text-sm">
                AI Generated
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content + Side Tiles */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,2fr)_320px]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Text Background</span>
              <Link
                href={`/blog/${post.slug}?textStyle=gradient`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  textStyle === 'gradient' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Gradient
              </Link>
              <Link
                href={`/blog/${post.slug}?textStyle=glass`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  textStyle === 'glass' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Glass
              </Link>
              <Link
                href={`/blog/${post.slug}?textStyle=plain`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  textStyle === 'plain' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Plain
              </Link>
            </div>

            <article className={`rounded-3xl border p-6 shadow-[0_20px_60px_-38px_rgba(0,0,0,0.4)] sm:p-10 ${textStyleClasses[textStyle]}`}>
              <div className="mb-10 grid gap-4 border-b border-slate-200/80 pb-8 text-sm text-slate-600 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Story Angle</p>
                  <p className="mt-2 text-sm leading-6">A documented impact story shaped like a feature article instead of a basic blog card.</p>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Read Time</p>
                  <p className="mt-2 text-sm leading-6">About {estimatedReadMinutes} min read</p>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Visual Rhythm</p>
                  <p className="mt-2 text-sm leading-6">Hero image first, then editorial inline frames with more breathing room.</p>
                </div>
              </div>

              {contentBlocks}
            </article>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Story At A Glance</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Format</p>
                  <p className="mt-1">Editorial post with layered visuals</p>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Default Canvas</p>
                  <p className="mt-1">Gradient article background</p>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Images</p>
                  <p className="mt-1">Contain-first display to avoid unexpected cropping</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Related Stories</h3>
              <p className="mt-2 text-sm text-slate-600">The side tiles stay visible and act more like an editorial rail than a basic list.</p>
            </div>

            {relatedPosts.length > 0 ? (
              relatedPosts.map((related) => {
                const relatedImageSrc = related.image ? `/blog-images/${related.image}` : null;
                return (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="h-32 overflow-hidden bg-slate-100">
                      {relatedImageSrc ? (
                        <img src={relatedImageSrc} alt={related.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-emerald-300 to-cyan-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {related.category.replace('-', ' ')}
                      </span>
                      <h4 className="mt-2 line-clamp-2 text-sm font-bold leading-tight text-slate-900">{related.title}</h4>
                    </div>
                  </Link>
                );
              })
            ) : (
              [1, 2, 3].map((tile) => (
                <div key={tile} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="h-20 bg-gradient-to-br from-emerald-200 to-cyan-200" />
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-slate-900">More stories coming soon</h4>
                    <p className="mt-1 text-xs text-slate-600">Publish additional posts to auto-fill side tiles here.</p>
                  </div>
                </div>
              ))
            )}
          </aside>
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
