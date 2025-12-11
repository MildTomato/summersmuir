import { getBlogPosts } from '@/lib/blog';
import { BlogView } from '@/app/components/blog-view';

export default function BlogPage() {
  const posts = getBlogPosts();

  return <BlogView posts={posts} />;
}


