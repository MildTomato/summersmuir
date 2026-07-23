import { BlogMotionProvider } from '@/app/components/blog-motion';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BlogMotionProvider>{children}</BlogMotionProvider>;
}
