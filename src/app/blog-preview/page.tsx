'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function BlogPreviewPage() {
  const [useUploadedImage, setUseUploadedImage] = useState(true);

  const post = useMemo(
    () => ({
      title: 'Sole Mates for a Cause: Our Shoe Drive Success Story',
      category: 'success-stories',
      author: 'nj77',
      published: '2026-04-01T20:07:43.001Z',
      uploadedHero: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
      aiHero: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop',
      content:
        'At Care4ME, we are thrilled to share the incredible success of our recent shoe drive, which brought together our community in a remarkable display of kindness and generosity. Over the course of the drive, we collected an astonishing 100 pairs of shoes, thanks to the tireless efforts of our volunteers and the support of local partners, including Arbor Terrace of Mt Laurel and Marlton, as well as the Library of Mt Laurel and Marlton. This outpouring of support is a testament to the power of community and the impact that we can have when we work together towards a common goal.\n\nThe success of our shoe drive was made possible by the dedication of 30 volunteers who selflessly gave their time to help sort, pair, and prepare the shoes for distribution. These amazing individuals worked tirelessly to ensure that every pair of shoes was carefully matched, separated by size, individually wrapped, and then boxed for shipping. Their hard work and attention to detail were instrumental in making this project a success, and we are deeply grateful for their contributions. As we reflect on the success of this drive, we are reminded of the importance of community involvement and the role that each and every one of us can play in making a positive difference in the lives of others.\n\nThe shoes collected during our drive will be shipped to Haiti, where they will provide much-needed footwear for individuals in need. Additionally, a portion of the shoes will be distributed to a local shelter, where they will help to provide comfort and dignity to those who are struggling. We are proud to be able to make a difference in the lives of others, both near and far, and we are grateful for the opportunity to serve as a conduit for kindness and compassion. As we look to the future, we are excited to continue exploring new ways to make a positive impact in our community and beyond.\n\nAs we celebrate the success of our shoe drive, we are reminded that there is always more work to be done and more opportunities to make a difference. We invite you to join us in our mission to restore health and renew hope in our community. Whether you are able to volunteer your time, donate goods or services, or simply spread the word about our organization, every effort counts and every contribution makes a difference. Together, we can create a brighter, more compassionate world, one small act of kindness at a time. Will you join us on this journey and help us to make a lasting impact in the lives of others?'
    }),
    []
  );

  const morePosts = [
    {
      title: 'Hope Through Healthcare: Student Supply Team Delivers Faster',
      category: 'impact',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&h=600&fit=crop'
    },
    {
      title: 'Community Pop-Up Day: 600 Check-Ins and Stronger Follow-Up',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=600&fit=crop'
    },
    {
      title: 'How to Request Equipment: A Practical Family Guide',
      category: 'tips',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&h=600&fit=crop'
    },
    {
      title: 'Youth Leadership: Building Systems Before Graduation',
      category: 'community',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=600&fit=crop'
    }
  ];

  const inlineImages = [
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1400&h=900&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-b53601020f90?w=1400&h=900&fit=crop',
    'https://images.unsplash.com/photo-1593113598332-cd59a93a9f24?w=1400&h=900&fit=crop'
  ];

  const imageSrc = useUploadedImage ? post.uploadedHero : post.aiHero;
  const paragraphs = post.content.split('\n\n').filter((p) => p.trim());

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f0fdf4_0%,#f8fafc_45%,#ffffff_100%)] text-slate-800">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,112,79,0.12),rgba(43,165,215,0.08),rgba(124,179,66,0.12))]" />
        <div className="noise absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
            Preview - Enhanced Single Blog Page
          </div>
          <h1 className="fade-up mt-4 max-w-4xl text-3xl font-black leading-tight text-slate-900 sm:text-5xl" style={{ fontVariationSettings: "'wght' 860" }}>
            Replicated layout of your current blog post with upgraded visuals and motion.
          </h1>
          <p className="fade-up mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
            This mirrors your current structure: header, hero image, article body, and call-to-action section. Use the toggle to simulate your Discord flow where uploaded image is preferred and AI image is fallback.
          </p>

          <div className="fade-up mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setUseUploadedImage(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                useUploadedImage
                  ? 'bg-[#0f704f] text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50'
              }`}
            >
              Uploaded Hero (Discord attachment)
            </button>
            <button
              onClick={() => setUseUploadedImage(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !useUploadedImage
                  ? 'bg-[#1e5a96] text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50'
              }`}
            >
              AI Hero (fallback)
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
            <header className="relative bg-gradient-to-br from-[#0f704f] via-[#1a8a63] to-[#2ba5d7] px-6 py-10 text-white sm:px-10 sm:py-14">
              <div className="noise absolute inset-0" />
              <div className="relative">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/95 hover:text-white">
                  ← Back to Blog
                </Link>
                <span className="mt-5 inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {post.category.replace('-', ' ')}
                </span>
                <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl" style={{ fontVariationSettings: "'wght' 850" }}>
                  {post.title}
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/95">
                  <span>By {post.author}</span>
                  <span className="h-1 w-1 rounded-full bg-white/90" />
                  <span>
                    {new Date(post.published).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </header>

            <div className="relative h-[300px] overflow-hidden sm:h-[500px]">
              <img src={imageSrc} alt={post.title} className="hero-pan h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-4 right-4 rounded-full border border-white/40 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {useUploadedImage ? 'User Uploaded Image' : 'AI Generated Image'}
              </div>
            </div>

            <div className="px-6 py-10 sm:px-10 sm:py-12">
              {paragraphs.map((paragraph, idx) => (
                <div key={`block-${idx}`}>
                  <p
                    className={`article-rise mb-7 leading-8 text-slate-700 ${idx === 0 ? 'text-xl text-slate-900' : 'text-lg'}`}
                    style={{ animationDelay: `${120 + idx * 70}ms`, fontVariationSettings: idx === 0 ? "'wght' 600" : "'wght' 430" }}
                  >
                    {paragraph}
                  </p>

                  {inlineImages[idx] && (
                    <figure className="article-rise mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]" style={{ animationDelay: `${160 + idx * 70}ms` }}>
                      <img src={inlineImages[idx]} alt={`Inline visual ${idx + 1}`} className="h-auto w-full object-cover transition duration-500 hover:scale-[1.02]" />
                    </figure>
                  )}
                </div>
              ))}

              <div className="article-rise rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Multi-image preview: first image = hero, next images flow inline between paragraphs in a magazine-style rhythm.
              </div>
            </div>

            <section className="border-t border-slate-200 bg-gradient-to-br from-[#e8f4f8] to-[#f0f8e8] px-6 py-10 sm:px-10">
              <h3 className="text-2xl font-black text-[#1e5a96]">Want to Make a Difference?</h3>
              <p className="mt-3 max-w-2xl text-slate-700">
                Join our mission to restore health and renew hope. Every volunteer hour, every shared post, and every donation helps families access the care and dignity they deserve.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#7cb342] px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#689f38]">
                  Donate Now
                </button>
                <button className="rounded-xl border-2 border-[#1e5a96] px-6 py-3 font-bold text-[#1e5a96] transition hover:bg-[#1e5a96] hover:text-white">
                  Volunteer
                </button>
              </div>
            </section>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">If you had more posts</h3>
              <p className="mt-2 text-sm text-slate-600">
                This side panel previews how related stories can appear while keeping focus on the main article.
              </p>
            </div>

            {morePosts.map((item, idx) => (
              <article key={item.title} className="card-pop overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${idx * 90}ms` }}>
                <div className="h-32 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {item.category}
                  </span>
                  <h4 className="mt-2 line-clamp-2 text-sm font-bold leading-tight text-slate-900">{item.title}</h4>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <style jsx global>{`
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes zoomSlow {
          from { transform: scale(1); }
          to { transform: scale(1.07); }
        }

        @keyframes softPop {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .fade-up {
          animation: riseUp 700ms ease both;
        }

        .article-rise {
          animation: riseUp 650ms ease both;
        }

        .hero-pan {
          animation: zoomSlow 13s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .card-pop {
          animation: softPop 540ms ease both;
        }

        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.13;
          background-image: radial-gradient(rgba(0, 0, 0, 0.2) 0.7px, transparent 0.7px);
          background-size: 4px 4px;
        }
      `}</style>
    </main>
  );
}
