import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPR, getPRs, type PRType } from '@/lib/prs';

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

interface PageProps {
  params: Promise<{ number: string }>;
}

export async function generateStaticParams() {
  const prs = getPRs();
  return prs.map((pr) => ({
    number: pr.number.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { number } = await params;
  const pr = getPR(parseInt(number, 10));
  
  if (!pr) {
    return { title: 'PR Not Found' };
  }

  return {
    title: `PR #${pr.number}: ${pr.title} | summersmuir`,
    description: pr.body?.slice(0, 160) || `Pull request #${pr.number} to ${pr.repo || 'supabase/supabase'}`,
  };
}

export default async function PRPage({ params }: PageProps) {
  const { number } = await params;
  const pr = getPR(parseInt(number, 10));

  if (!pr) {
    notFound();
  }

  const stateColor = {
    MERGED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    OPEN: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CLOSED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }[pr.state];

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link 
          href="/prs" 
          className="inline-flex items-center gap-2 text-sm text-subtitle hover:text-heading transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to PRs
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <a 
              href={`https://github.com/${pr.repo || 'supabase/supabase'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-faded hover:text-heading transition-colors"
            >
              {pr.repo || 'supabase/supabase'}
            </a>
            <span className="text-sm font-mono text-faded">#{pr.number}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${stateColor}`}>
              {pr.state}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${TYPE_COLORS[pr.prType]}`}>
              {pr.prType}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Score: {pr.influenceScore}
            </span>
          </div>
          
          <h1 className="text-2xl font-semibold text-heading mb-4">
            {pr.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-subtitle">
            <time>
              Created: {new Date(pr.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {pr.mergedAt && (
              <time>
                Merged: {new Date(pr.mergedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">+{pr.additions.toLocaleString()}</p>
            <p className="text-xs text-subtitle">Additions</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">-{pr.deletions.toLocaleString()}</p>
            <p className="text-xs text-subtitle">Deletions</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-xl font-semibold text-heading">{pr.changedFiles}</p>
            <p className="text-xs text-subtitle">Files Changed</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-xl font-semibold text-heading">{pr.commits.totalCount}</p>
            <p className="text-xs text-subtitle">Commits</p>
          </div>
        </div>

        {/* Branch info */}
        <div className="mb-8 p-4 bg-warm-cream dark:bg-neutral-900/50 rounded-lg border border-border-color">
          <p className="text-sm font-mono text-subtitle">
            <span className="text-heading">{pr.baseRefName}</span>
            <span className="mx-2">←</span>
            <span className="text-heading">{pr.headRefName}</span>
          </p>
        </div>

        {/* Labels */}
        {pr.labels.nodes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-heading mb-2">Labels</h2>
            <div className="flex flex-wrap gap-2">
              {pr.labels.nodes.map((label) => (
                <span 
                  key={label.name}
                  className="px-2 py-1 text-xs bg-warm-cream dark:bg-neutral-900/50 border border-border-color rounded-full"
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {pr.body && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-heading mb-3">Description</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-warm-cream dark:bg-neutral-900/50 rounded-lg border border-border-color">
              <pre className="whitespace-pre-wrap text-sm text-subtitle font-sans">
                {pr.body}
              </pre>
            </div>
          </div>
        )}

        {/* External link */}
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          View on GitHub
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
