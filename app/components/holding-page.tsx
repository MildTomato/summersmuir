import { CommitPreviewCard } from '@/app/components/commit-preview-card';

function parseCommitStat(value: string | undefined) {
  if (!value) return undefined;

  const stat = Number.parseInt(value, 10);
  return Number.isNaN(stat) ? undefined : stat;
}

export function HoldingPage() {
  const commitDate = process.env.NEXT_PUBLIC_COMMIT_DATE;
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const commitMessage = process.env.NEXT_PUBLIC_COMMIT_MESSAGE;
  const commitAdditions = parseCommitStat(
    process.env.NEXT_PUBLIC_COMMIT_ADDITIONS
  );
  const commitDeletions = parseCommitStat(
    process.env.NEXT_PUBLIC_COMMIT_DELETIONS
  );
  const formattedCommitDate = commitDate
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore',
        timeZoneName: 'short',
      }).format(new Date(commitDate))
        .replace(', ', ' · ')
        .toUpperCase()
    : null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg p-6 leading-[1.45] tracking-[-0.01em] text-heading">
      <section className="w-full max-w-md">
        <div>
          <div className="flex flex-col items-start gap-8">
            <span aria-hidden className="relative block h-[18px] w-[22px]">
              <span className="absolute left-px top-0 z-30 h-3 w-5 border border-heading bg-app-bg" />
              <span className="absolute left-[3px] top-[3px] z-20 h-3 w-4 border border-subtitle bg-app-bg" />
              <span className="absolute left-[5px] top-[6px] z-10 h-3 w-3 border border-faded bg-app-bg" />
            </span>
            <p>hello, i&apos;m jonny</p>
          </div>

          <div className="mt-4">
            <p>founding designer at supabase</p>
            <p className="text-subtitle">currently head of design</p>
          </div>

          <div className="mt-7">
            <a
              href="https://x.com/jsummersmuir"
              target="_blank"
              rel="noreferrer"
              className="-my-3 inline-block py-3 underline decoration-border-color underline-offset-4 transition-colors hover:text-subtitle focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading"
            >
              @jsummersmuir
            </a>
            {formattedCommitDate ? (
              <div className="mt-7 w-fit">
                <CommitPreviewCard
                  additions={commitAdditions}
                  date={formattedCommitDate}
                  deletions={commitDeletions}
                  message={commitMessage}
                  sha={commitSha}
                />
              </div>
            ) : (
              <p className="mt-7 text-subtitle">site in progress</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
