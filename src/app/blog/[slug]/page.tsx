import { readdir, readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  published: string;
  image?: string;
  imageType?: string;  // 'ai' or 'upload'
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const blogDir = path.join(process.cwd(), 'public', 'blog-posts');
  
  try {
    const files = await readdir(blogDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(path.join(blogDir, file), 'utf8');
        const post = JSON.parse(content);
        if (post.slug === slug) {
          return post;
        }
      }
    }
  } catch (e) {}
  
  return null;
}

// Helper to get the correct image URL
function getBlogImageUrl(image: string | undefined): string | null {
  if (!image) return null;
  
  // If it's already a full URL, use it
  if (image.startsWith('http')) {
    return image;
  }
  
  // If it's in blog-images folder (new format from AI/upload)
  if (image.endsWith('.webp') && (image.startsWith('ai-') || image.startsWith('upload-'))) {
    return `/blog-images/${image}`;
  }
  
  // Fallback to old /api/image route for legacy images
  return `/api/image?file=${image}`;
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

  const imageUrl = getBlogImageUrl(post.image);

  return (
    <main className="bg-white min-h-screen">
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-[#2BA5D7] hover:text-[#1E5A96] font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>
          <span className="block text-sm font-bold uppercase tracking-wide text-[#7CB342] mb-2">
            {post.category}
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

      {imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative">
          <img 
            src={imageUrl}
            alt={post.title}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
          {/* AI badge */}
          {post.imageType === 'ai' && (
            <div className="absolute top-4 right-8 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              🎨 AI Generated
            </div>
          )}
        </div>
      )}

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed mb-6 text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
