import { readdir, readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';

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
  status: string;
  image?: string;
  heroImage?: string;
  inlineImages?: string[];
  imageType?: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'public', 'blog-posts');
  
  try {
    const files = await readdir(blogDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const posts: BlogPost[] = [];
    for (const file of jsonFiles) {
      try {
        const content = await readFile(path.join(blogDir, file), 'utf8');
        const post = JSON.parse(content);
        if (post.status === 'published') {
          posts.push(post);
        }
      } catch (e) {}
    }
    
    return posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  } catch (e) {
    return [];
  }
}

// Helper to get the correct image URL
function getBlogImageUrl(post: BlogPost): string | null {
  const image = post.heroImage || post.image;
  if (!image) return null;
  
  if (image.startsWith('http')) return image;
  
  // New format in blog-images folder
  if (image.includes('-hero') || image.includes('-inline') || image.startsWith('ai-') || image.startsWith('upload-')) {
    return `/blog-images/${image}`;
  }
  
  return `/api/image?file=${image}`;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Stories & Blog</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Real stories of real impact. See how donations change lives.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No blog posts yet</h3>
              <p className="text-gray-500">Use <code className="bg-gray-100 px-2 py-1 rounded">!blog</code> in Discord to create posts!</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {posts.map((post) => {
                const imageUrl = getBlogImageUrl(post);
                
                return (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="break-inside-avoid block">
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="relative overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-[#1E5A96] to-[#7CB342] flex items-center justify-center">
                            <span className="text-white/20 text-7xl font-black">C4M</span>
                          </div>
                        )}
                        
                        {post.imageType === 'ai' && (
                          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            🎨 AI
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                          <span className="text-xs font-bold uppercase tracking-wide text-[#7CB342]">
                            {post.category}
                          </span>
                          <h3 className="text-white font-bold text-lg mt-1 line-clamp-2">{post.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {post.content.substring(0, 150)}...
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-gray-500">
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.published).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}</span>
                          </div>
                          <span className="text-[#2BA5D7] font-bold group-hover:text-[#1E5A96] transition">Read →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
