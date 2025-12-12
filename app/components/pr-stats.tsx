import type { PRType } from '@/lib/prs';

interface PRStatsProps {
  stats: {
    total: number;
    merged: number;
    open: number;
    closed: number;
    totalAdditions: number;
    totalDeletions: number;
    totalFiles: number;
    byYear: Record<number, number>;
    byType: Record<PRType, number>;
    byRepo: Record<string, number>;
  };
}

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

export function PRStats({ stats }: PRStatsProps) {
  const years = Object.entries(stats.byYear)
    .sort(([a], [b]) => Number(b) - Number(a));
  
  const types = Object.entries(stats.byType)
    .sort(([, a], [, b]) => b - a);
  
  const repos = Object.entries(stats.byRepo)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-app-bg border-b border-border-color">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-heading mb-2">
          Supabase Contributions
        </h1>
        <p className="text-sm text-subtitle mb-6">
          All my pull requests to Supabase repositories
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-2xl font-semibold text-heading">{stats.total}</p>
            <p className="text-xs text-subtitle">Total PRs</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">{stats.merged}</p>
            <p className="text-xs text-subtitle">Merged</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">+{stats.totalAdditions.toLocaleString()}</p>
            <p className="text-xs text-subtitle">Additions</p>
          </div>
          <div className="bg-warm-cream dark:bg-neutral-900/50 rounded-lg p-4 border border-border-color">
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">-{stats.totalDeletions.toLocaleString()}</p>
            <p className="text-xs text-subtitle">Deletions</p>
          </div>
        </div>

        {/* Type breakdown */}
        <div className="mb-4">
          <p className="text-xs text-subtitle mb-2">By Type</p>
          <div className="flex flex-wrap gap-2">
            {types.map(([type, count]) => (
              <span 
                key={type}
                className={`px-3 py-1 text-xs rounded-full ${TYPE_COLORS[type as PRType]}`}
              >
                <span className="font-medium">{type}</span>
                <span className="ml-1 opacity-75">({count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Years breakdown */}
        <div className="mb-4">
          <p className="text-xs text-subtitle mb-2">By Year</p>
          <div className="flex flex-wrap gap-2">
            {years.map(([year, count]) => (
              <span 
                key={year}
                className="px-3 py-1 text-xs bg-warm-cream dark:bg-neutral-900/50 border border-border-color rounded-full"
              >
                <span className="font-medium text-heading">{year}</span>
                <span className="text-subtitle ml-1">({count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Repos breakdown */}
        {repos.length > 1 && (
          <div>
            <p className="text-xs text-subtitle mb-2">By Repository</p>
            <div className="flex flex-wrap gap-2">
              {repos.map(([repo, count]) => (
                <a 
                  key={repo}
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs bg-warm-cream dark:bg-neutral-900/50 border border-border-color rounded-full hover:border-purple-400 transition-colors"
                >
                  <span className="font-medium text-heading">{repo}</span>
                  <span className="text-subtitle ml-1">({count})</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
