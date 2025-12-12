'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { PRWithScore, PRType } from '@/lib/prs';

interface PRListProps {
  prs: PRWithScore[];
}

type SortField = 'influenceScore' | 'date' | 'additions' | 'number';
type FilterState = 'all' | 'MERGED' | 'OPEN' | 'CLOSED';
type FilterType = 'all' | PRType;

const TYPE_COLORS: Record<PRType, string> = {
  feat: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  fix: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  chore: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  refactor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  docs: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  style: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  test: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  perf: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  ci: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  build: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  revert: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  other: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300',
};

export function PRList({ prs }: PRListProps) {
  const [sortBy, setSortBy] = useState<SortField>('influenceScore');
  const [filterState, setFilterState] = useState<FilterState>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedPRs = useMemo(() => {
    let result = [...prs];

    // Filter by state
    if (filterState !== 'all') {
      result = result.filter(pr => pr.state === filterState);
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(pr => pr.prType === filterType);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pr => 
        pr.title.toLowerCase().includes(query) ||
        pr.number.toString().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'influenceScore':
          return b.influenceScore - a.influenceScore;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'additions':
          return (b.additions + b.deletions) - (a.additions + a.deletions);
        case 'number':
          return b.number - a.number;
        default:
          return 0;
      }
    });

    return result;
  }, [prs, sortBy, filterState, filterType, searchQuery]);

  // Get unique types for filter dropdown
  const availableTypes = useMemo(() => {
    const types = new Set(prs.map(pr => pr.prType));
    return Array.from(types).sort();
  }, [prs]);

  const stateColor = (state: string) => {
    switch (state) {
      case 'MERGED':
        return 'text-purple-600 dark:text-purple-400';
      case 'OPEN':
        return 'text-green-600 dark:text-green-400';
      case 'CLOSED':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-subtitle';
    }
  };

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Filters */}
      <div className="sticky top-16 z-40 bg-app-bg/80 backdrop-blur-sm border-b border-border-color">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search PRs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* State filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-warm-cream dark:bg-neutral-900/50 border border-border-color">
                {(['all', 'MERGED', 'OPEN', 'CLOSED'] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => setFilterState(state)}
                    className={`
                      px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                      ${filterState === state 
                        ? 'bg-background text-heading shadow-sm' 
                        : 'text-subtitle hover:text-heading'}
                    `}
                  >
                    {state === 'all' ? 'All' : state.charAt(0) + state.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-3 py-2 text-xs bg-background border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="px-3 py-2 text-xs bg-background border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="influenceScore">Sort by Influence</option>
                <option value="date">Sort by Date</option>
                <option value="additions">Sort by Size</option>
                <option value="number">Sort by PR #</option>
              </select>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-faded">
            Showing {filteredAndSortedPRs.length} of {prs.length} PRs
          </p>
        </div>
      </div>

      {/* PR List */}
      <div className="divide-y divide-border-color">
        {filteredAndSortedPRs.map((pr) => (
          <Link
            key={pr.number}
            href={`/prs/${pr.number}`}
            className="block group"
          >
            <article className="px-6 md:px-8 lg:px-12 py-3 transition-colors hover:bg-hover-bg">
              <div className="max-w-6xl mx-auto flex items-center gap-4">
                {/* Influence score */}
                <div className="w-12 shrink-0 text-right">
                  <span className={`
                    text-sm font-mono font-medium
                    ${pr.influenceScore >= 50 ? 'text-purple-600 dark:text-purple-400' : 
                      pr.influenceScore >= 20 ? 'text-heading' : 'text-faded'}
                  `}>
                    {pr.influenceScore}
                  </span>
                </div>

                {/* PR number */}
                <span className="text-xs text-faded font-mono w-16 shrink-0">
                  #{pr.number}
                </span>

                {/* Type badge */}
                <span className={`hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${TYPE_COLORS[pr.prType]}`}>
                  {pr.prType}
                </span>

                {/* Title */}
                <h2 className="flex-1 text-sm font-light text-heading group-hover:text-subtitle transition-colors truncate">
                  {pr.title}
                </h2>

                {/* State */}
                <span className={`text-xs font-medium shrink-0 ${stateColor(pr.state)}`}>
                  {pr.state}
                </span>

                {/* Date */}
                <time className="hidden md:block text-xs text-faded tabular-nums w-24 shrink-0 text-right">
                  {new Date(pr.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>

                {/* Stats */}
                <div className="hidden lg:flex items-center gap-2 text-xs font-mono shrink-0">
                  <span className="text-green-600 dark:text-green-400">+{pr.additions.toLocaleString()}</span>
                  <span className="text-red-600 dark:text-red-400">-{pr.deletions.toLocaleString()}</span>
                </div>

                {/* Arrow */}
                <span className="text-faded group-hover:text-heading transition-colors shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
