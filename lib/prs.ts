import fs from 'fs';
import path from 'path';

export interface PR {
  number: number;
  title: string;
  state: 'MERGED' | 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  body: string;
  baseRefName: string;
  headRefName: string;
  repo?: string;
  labels: {
    nodes: Array<{ name: string }>;
  };
  commits: {
    totalCount: number;
  };
  reviews: {
    totalCount: number;
  };
  comments: {
    totalCount: number;
  };
}

export type PRType = 'feat' | 'fix' | 'chore' | 'refactor' | 'docs' | 'style' | 'test' | 'perf' | 'ci' | 'build' | 'revert' | 'other';

export interface PRWithScore extends PR {
  influenceScore: number;
  prType: PRType;
}

const PR_TYPE_PATTERNS: Array<{ pattern: RegExp; type: PRType }> = [
  { pattern: /^feat[:\s\/\(]/i, type: 'feat' },
  { pattern: /^feature[:\s\/\(]/i, type: 'feat' },
  { pattern: /^fix[:\s\/\(]/i, type: 'fix' },
  { pattern: /^bug[:\s\/\(]/i, type: 'fix' },
  { pattern: /^hotfix[:\s\/\(]/i, type: 'fix' },
  { pattern: /^chore[:\s\/\(]/i, type: 'chore' },
  { pattern: /^refactor[:\s\/\(]/i, type: 'refactor' },
  { pattern: /^docs[:\s\/\(]/i, type: 'docs' },
  { pattern: /^style[:\s\/\(]/i, type: 'style' },
  { pattern: /^test[:\s\/\(]/i, type: 'test' },
  { pattern: /^perf[:\s\/\(]/i, type: 'perf' },
  { pattern: /^ci[:\s\/\(]/i, type: 'ci' },
  { pattern: /^build[:\s\/\(]/i, type: 'build' },
  { pattern: /^revert[:\s\/\(]/i, type: 'revert' },
];

function extractPRType(title: string, branchName: string): PRType {
  // Check title first
  for (const { pattern, type } of PR_TYPE_PATTERNS) {
    if (pattern.test(title)) {
      return type;
    }
  }
  
  // Check branch name
  for (const { pattern, type } of PR_TYPE_PATTERNS) {
    if (pattern.test(branchName)) {
      return type;
    }
  }
  
  // Infer from common keywords in title
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('fix') || lowerTitle.includes('bug') || lowerTitle.includes('patch')) {
    return 'fix';
  }
  if (lowerTitle.includes('add') || lowerTitle.includes('implement') || lowerTitle.includes('new')) {
    return 'feat';
  }
  if (lowerTitle.includes('update') || lowerTitle.includes('upgrade') || lowerTitle.includes('bump')) {
    return 'chore';
  }
  if (lowerTitle.includes('refactor') || lowerTitle.includes('cleanup') || lowerTitle.includes('clean up')) {
    return 'refactor';
  }
  if (lowerTitle.includes('deploy') || lowerTitle.includes('release')) {
    return 'chore';
  }
  if (lowerTitle.includes('doc') || lowerTitle.includes('readme')) {
    return 'docs';
  }
  if (lowerTitle.includes('test')) {
    return 'test';
  }
  if (lowerTitle.includes('revert')) {
    return 'revert';
  }
  
  return 'other';
}

function calculateInfluenceScore(pr: PR, maxRaw: number): number {
  const stateMultiplier = pr.state === 'MERGED' ? 1.5 : pr.state === 'OPEN' ? 1.0 : 0.5;
  const engagementMultiplier = 1 + (pr.reviews.totalCount * 0.1) + (pr.comments.totalCount * 0.05);
  const raw = (pr.additions + pr.deletions) * stateMultiplier * engagementMultiplier;
  return maxRaw > 0 ? Math.floor((raw / maxRaw) * 100) : 0;
}

export function getPRs(): PRWithScore[] {
  const jsonPath = path.join(process.cwd(), 'scripts/data/supabase-prs.json');
  
  if (!fs.existsSync(jsonPath)) {
    return [];
  }

  const fileContents = fs.readFileSync(jsonPath, 'utf8');
  const prs: PR[] = JSON.parse(fileContents);

  // Calculate max raw score for normalization
  const rawScores = prs.map(pr => {
    const stateMultiplier = pr.state === 'MERGED' ? 1.5 : pr.state === 'OPEN' ? 1.0 : 0.5;
    const engagementMultiplier = 1 + (pr.reviews.totalCount * 0.1) + (pr.comments.totalCount * 0.05);
    return (pr.additions + pr.deletions) * stateMultiplier * engagementMultiplier;
  });
  const maxRaw = Math.max(...rawScores);

  // Add influence scores and PR types
  return prs.map(pr => ({
    ...pr,
    influenceScore: calculateInfluenceScore(pr, maxRaw),
    prType: extractPRType(pr.title, pr.headRefName),
  }));
}

export function getPR(number: number): PRWithScore | null {
  const prs = getPRs();
  return prs.find(pr => pr.number === number) || null;
}

export function getPRStats() {
  const prs = getPRs();
  
  const merged = prs.filter(pr => pr.state === 'MERGED').length;
  const open = prs.filter(pr => pr.state === 'OPEN').length;
  const closed = prs.filter(pr => pr.state === 'CLOSED').length;
  
  const totalAdditions = prs.reduce((sum, pr) => sum + pr.additions, 0);
  const totalDeletions = prs.reduce((sum, pr) => sum + pr.deletions, 0);
  const totalFiles = prs.reduce((sum, pr) => sum + pr.changedFiles, 0);

  // Group by year
  const byYear = prs.reduce((acc, pr) => {
    const year = new Date(pr.createdAt).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Group by type
  const byType = prs.reduce((acc, pr) => {
    acc[pr.prType] = (acc[pr.prType] || 0) + 1;
    return acc;
  }, {} as Record<PRType, number>);

  // Group by repo
  const byRepo = prs.reduce((acc, pr) => {
    const repo = pr.repo || 'supabase/supabase';
    acc[repo] = (acc[repo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: prs.length,
    merged,
    open,
    closed,
    totalAdditions,
    totalDeletions,
    totalFiles,
    byYear,
    byType,
    byRepo,
  };
}
