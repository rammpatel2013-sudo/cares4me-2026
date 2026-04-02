import { readdir, readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-[#2BA5D7] hover:text-[#1E5A96] font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>
          <span className="block text-sm font-bold uppercase tracking-wide text-[#7CB342] mb-2">
            {post.category.replace('-', ' ')}
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1E5A96] mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative">
          <img 
            src={imageSrc}
            alt={post.title}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
          {post.imageType === 'ai' && (
            <div className="absolute top-4 right-8 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              🎨 AI Generated
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {post.content.split('\n\n').filter(p => p.trim()).map((paragraph, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed mb-6 text-lg">
              {paragraph}
            </p>
          ))}
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
