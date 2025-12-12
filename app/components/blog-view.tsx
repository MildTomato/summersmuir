'use client';

import { useState } from 'react';
import { LayoutGroup, AnimatePresence } from 'framer-motion';
import { TimeMachine } from './time-machine';
import { BlogList } from './blog-list';

interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  image?: string;
}

interface BlogViewProps {
  posts: Post[];
}

export function BlogView({ posts }: BlogViewProps) {
  const [view, setView] = useState<'rolodex' | 'list'>('rolodex');

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Header with view toggle */}
      <div className="relative z-[200] pt-4 pb-4 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-warm-cream dark:bg-neutral-900/50 border border-border-color">
            <button
              onClick={() => setView('rolodex')}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${view === 'rolodex' 
                  ? 'bg-background text-heading shadow-sm' 
                  : 'text-subtitle hover:text-heading'}
              `}
              aria-label="Rolodex view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${view === 'list' 
                  ? 'bg-background text-heading shadow-sm' 
                  : 'text-subtitle hover:text-heading'}
              `}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* View content */}
      {view === 'rolodex' ? (
        <TimeMachine posts={posts} />
      ) : (
        <BlogList posts={posts} />
      )}
    </div>
  );
}
