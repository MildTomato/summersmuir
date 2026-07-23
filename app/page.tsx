import Link from 'next/link';
import { PageLayout } from '@/app/components/page-layout';

export default function Home() {
  return (
    <PageLayout>
      <h1 className="max-w-[500px] text-4xl font-bold tracking-tight text-heading sm:text-5xl">
        Hey, I&apos;m Jonathan
      </h1>
      <p className="mt-6 text-lg leading-8 text-subtitle">
        Welcome to my personal website. I write about web development, 
        technology, and other things I find interesting.
      </p>
      <p className="mt-4 text-lg leading-8 text-subtitle">
        Check out my{" "}
        <Link
          href="/blog"
          className="font-medium text-heading underline underline-offset-4 hover:text-subtitle"
        >
          blog
        </Link>{" "}
        to read my latest posts.
      </p>
    </PageLayout>
  );
}
