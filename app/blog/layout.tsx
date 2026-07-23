import { BlogMotionProvider } from '@/app/components/blog-motion';
import { Header } from '@/app/components/header';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-16">
        <BlogMotionProvider>{children}</BlogMotionProvider>
      </div>
    </>
  );
}
