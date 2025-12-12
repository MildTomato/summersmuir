'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { PRWithScore, PRType } from '@/lib/prs';

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

export const columns: ColumnDef<PRWithScore>[] = [
  {
    accessorKey: 'influenceScore',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.getValue('influenceScore') as number;
      return (
        <span className={`font-mono font-medium ${
          score >= 50 ? 'text-purple-600 dark:text-purple-400' : 
          score >= 20 ? 'text-heading' : 'text-faded'
        }`}>
          {score}
        </span>
      );
    },
  },
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        #
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-faded">#{row.getValue('number')}</span>
    ),
  },
  {
    accessorKey: 'repo',
    header: 'Repo',
    cell: ({ row }) => {
      const repo = row.original.repo || 'supabase/supabase';
      const shortName = repo.replace('supabase/', '').replace('supabase-community/', '');
      return (
        <a
          href={`https://github.com/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          title={repo}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {shortName}
        </a>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'prType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('prType') as PRType;
      return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_COLORS[type]}`}>
          {type}
        </span>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link 
        href={`/prs/${row.original.number}`}
        className="text-heading hover:text-purple-600 dark:hover:text-purple-400 transition-colors max-w-md truncate block"
      >
        {row.getValue('title')}
      </Link>
    ),
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => {
      const state = row.getValue('state') as string;
      const stateColor = {
        MERGED: 'text-purple-600 dark:text-purple-400',
        OPEN: 'text-green-600 dark:text-green-400',
        CLOSED: 'text-red-600 dark:text-red-400',
      }[state] || 'text-subtitle';
      return <span className={`text-xs font-medium ${stateColor}`}>{state}</span>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <span className="text-xs text-faded tabular-nums">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    accessorKey: 'additions',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        +/-
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs font-mono">
        <span className="text-green-600 dark:text-green-400">
          +{(row.original.additions).toLocaleString()}
        </span>
        <span className="text-red-600 dark:text-red-400">
          -{(row.original.deletions).toLocaleString()}
        </span>
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.additions + rowA.original.deletions;
      const b = rowB.original.additions + rowB.original.deletions;
      return a - b;
    },
  },
];
