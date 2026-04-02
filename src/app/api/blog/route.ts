// src/app/api/blog/route.ts
// Dynamic API route for blog posts - no rebuild needed!

import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

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
  imageType?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
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
    
    // Sort by published date, newest first
    posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    // If slug provided, return single post
    if (slug) {
      const post = posts.find(p => p.slug === slug);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    // Return all posts
    return NextResponse.json(posts);
    
  } catch (e) {
    return NextResponse.json([]);
  }
}
