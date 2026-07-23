import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { execFileSync } from 'node:child_process';

function readGit(format: string) {
  try {
    return execFileSync('git', ['log', '-1', `--format=${format}`], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
}

function readGitChanges() {
  try {
    const numstat = execFileSync(
      'git',
      ['show', '--numstat', '--format=', 'HEAD'],
      { encoding: 'utf8' }
    ).trim();

    return numstat.split('\n').reduce(
      (totals, line) => {
        const [added, deleted] = line.split('\t');

        if (/^\d+$/.test(added)) totals.additions += Number(added);
        if (/^\d+$/.test(deleted)) totals.deletions += Number(deleted);

        return totals;
      },
      { additions: 0, deletions: 0 }
    );
  } catch {
    return null;
  }
}

const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || readGit('%H');
const commitDate = readGit('%cI');
const commitMessage =
  process.env.VERCEL_GIT_COMMIT_MESSAGE || readGit('%s');
const commitChanges = readGitChanges();

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  poweredByHeader: false,
  typedRoutes: true,
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
    NEXT_PUBLIC_COMMIT_DATE: commitDate,
    NEXT_PUBLIC_COMMIT_MESSAGE: commitMessage,
    NEXT_PUBLIC_COMMIT_ADDITIONS:
      commitChanges?.additions.toString() ?? '',
    NEXT_PUBLIC_COMMIT_DELETIONS:
      commitChanges?.deletions.toString() ?? '',
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
