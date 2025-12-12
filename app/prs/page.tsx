import { getPRs, getPRStats } from '@/lib/prs';
import { PRStats } from '@/app/components/pr-stats';
import { DataTable } from './data-table';
import { columns } from './columns';

export const metadata = {
  title: 'Supabase PRs | summersmuir',
  description: 'All my pull requests to supabase/supabase',
};

export default function PRsPage() {
  const prs = getPRs();
  const stats = getPRStats();

  return (
    <div className="min-h-screen bg-app-bg">
      <PRStats stats={stats} />
      <div className="max-w-6xl mx-auto px-6 py-4">
        <DataTable columns={columns} data={prs} />
      </div>
    </div>
  );
}
