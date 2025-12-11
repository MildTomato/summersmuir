import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2 text-black dark:text-zinc-50">
                {post.title}
              </h2>
              {post.date && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {post.description && (
                <p className="text-zinc-600 dark:text-zinc-400">{post.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


