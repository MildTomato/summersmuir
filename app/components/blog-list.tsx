'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  image?: string;
}

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-subtitle">No posts yet.</p>
      </div>
    );
  }

  const hoveredPost = hoveredIndex !== null ? posts[hoveredIndex] : null;

  return (
    <div className="relative min-h-screen" onMouseMove={handleMouseMove}>
      {/* Floating image preview */}
      {hoveredPost?.image && (
        <div
          className="fixed pointer-events-none z-50 transition-opacity duration-200"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 100,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        >
          <div className="relative w-80 h-52 overflow-hidden shadow-2xl">
            <Image
              src={hoveredPost.image}
              alt={hoveredPost.title}
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="divide-y divide-border-color">
        {posts.map((post, index) => (
          <div key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <article className="px-4 md:px-8 lg:px-12 py-2 transition-colors hover:bg-hover-bg">
                <div className="flex items-center gap-4">
                  {/* Date column */}
                  {post.date && (
                    <time className="text-xs text-faded tabular-nums w-20 shrink-0">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  
                  {/* Title column */}
                <h2 className="flex-1 text-sm font-light text-heading group-hover:text-subtitle transition-colors truncate">
                    {post.title}
                  </h2>
                  
                  {/* Subtitle column */}
                  <p className="hidden md:block flex-1 text-xs text-faded truncate">
                    {post.subtitle || post.description}
                  </p>
                  
                  {/* Arrow */}
                  <span className="text-faded group-hover:text-heading transition-colors shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
