import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { useMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to Blog
        </Link>
        
        <article className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-zinc-50">
            {post.title}
          </h1>
          
          {post.date && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={post.content} components={useMDXComponents({})} />
          </div>
        </article>
      </div>
    </div>
  );
}

