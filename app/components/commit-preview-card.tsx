'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface CommitPreviewCardProps {
  additions?: number;
  date: string;
  deletions?: number;
  message?: string;
  sha?: string;
}

function BuildingDotGrid() {
  return (
    <span
      aria-hidden
      className="grid size-[1ex] shrink-0 grid-cols-3 grid-rows-3 gap-[2px]"
    >
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className="status-grid-dot bg-current"
          style={{ animationDelay: `${index * 180}ms` }}
        />
      ))}
    </span>
  );
}

export function CommitPreviewCard({
  additions,
  date,
  deletions,
  message,
  sha,
}: CommitPreviewCardProps) {
  const shortSha = sha?.slice(0, 7);
  const hasChanges = additions !== undefined || deletions !== undefined;
  const commitUrl = sha
    ? `https://github.com/MildTomato/jonny.design/commit/${sha}`
    : 'https://github.com/MildTomato/jonny.design';

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={150}
        render={<button type="button" />}
        className="inline-flex cursor-default items-center gap-2 border-b border-dotted border-border-color pb-px text-subtitle transition-colors hover:text-heading focus-visible:rounded-sm focus-visible:text-heading focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading"
      >
        <span>site in progress</span>
        <BuildingDotGrid />
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        alignOffset={0}
        sideOffset={12}
        className="w-max max-w-[calc(100vw-3rem)] overflow-hidden rounded-sm border border-border-color bg-app-bg p-0 text-[13px] shadow-none ring-0"
      >
        <div className="bg-hover-bg px-3 py-2 font-mono text-[11px] text-subtitle">
          <p>{date}</p>
        </div>

        {(message || shortSha || hasChanges) && (
          <div className="border-t border-border-color px-3 py-2.5">
            {message && <p className="max-w-80 text-heading">{message}</p>}
            {(shortSha || hasChanges) && (
              <div className="mt-1.5 flex items-center gap-3 text-faded">
                {shortSha && (
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 underline decoration-border-color underline-offset-2 transition-colors hover:text-heading focus-visible:rounded-sm focus-visible:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading"
                  >
                    <svg
                      aria-hidden
                      className="size-[1em] shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.02 3.44 9.27 8.21 10.77.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.14 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.42.36.81 1.1.81 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.21.69.83.57C20.57 21.27 24 17.02 24 12 24 5.73 18.27.5 12 .5Z" />
                    </svg>
                    {shortSha}
                  </a>
                )}
                {hasChanges && (
                  <span className="flex items-center gap-2">
                    {additions !== undefined && (
                      <span
                        aria-label={`${additions} lines added`}
                        className="text-[var(--code-diff-add-text)]"
                      >
                        +{additions}
                      </span>
                    )}
                    {deletions !== undefined && (
                      <span
                        aria-label={`${deletions} lines deleted`}
                        className="text-[var(--code-diff-remove-text)]"
                      >
                        −{deletions}
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
