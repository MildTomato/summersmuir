'use client';

import { useState, useRef } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function CodeBlock({ children, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const code = codeRef.current?.textContent || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--code-border)', backgroundColor: 'var(--code-bg)' }}>
      {title && (
        <div className="flex items-center gap-2 border-b px-4 py-2 text-sm text-muted-foreground" style={{ borderColor: 'var(--code-border)', backgroundColor: 'var(--code-title-bg)' }}>
          <FileIcon />
          <span className="font-mono">{title}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md p-1.5 text-faded opacity-0 transition-opacity hover:bg-hover-bg hover:text-subtitle group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <div ref={codeRef} className={className}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
