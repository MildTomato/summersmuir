import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/format';
import { rehypePlugins, remarkPlugins } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';
import { PageLayout } from '@/app/components/page-layout';
import { TableOfContents } from '@/app/components/toc';
import { SharedBlogImage } from '@/app/components/blog-motion';
import { isProductionDeployment } from '@/lib/deployment';

export const dynamicParams = false;

export async function generateStaticParams() {
  if (isProductionDeployment) {
    return [];
  }

  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageLayout maxWidth="full">
      <article>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-faded hover:text-heading transition-colors"
          >
            ← Back to Blog
          </Link>
          
          <header className="mt-8">
            <h1 className="text-3xl font-medium tracking-tight text-heading sm:text-4xl">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="mt-3 text-lg text-subtitle">
                {post.subtitle}
              </p>
            )}
            
            {post.date && (
              <time className="mt-4 block text-sm text-faded">
                {formatDate(post.date)}
              </time>
            )}
          </header>
        </div>

        {post.image && (
          <SharedBlogImage
            slug={post.slug}
            src={post.image}
            alt={post.title}
            sizes="(max-width: 1280px) 100vw, 1280px"
              className="relative mt-8 aspect-[40/21] w-full overflow-hidden bg-muted"
              imageClassName="object-cover"
              borderRadius="0.5rem"
              preload
          />
        )}

        <div className="prose mt-12 max-w-3xl mx-auto">
          <MDXRemote 
            source={post.content} 
            components={getMDXComponents({})}
            options={{
              mdxOptions: { remarkPlugins, rehypePlugins },
            }}
          />
        </div>
      </article>

      <aside className="hidden xl:block fixed right-8 top-24 w-56">
        <TableOfContents />
      </aside>
    </PageLayout>
  );
}
