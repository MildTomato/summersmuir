import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border-color bg-app-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link 
          href="/" 
          className="text-lg font-semibold tracking-tight text-heading hover:text-subtitle transition-colors"
        >
          summersmuir
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-subtitle hover:text-heading transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-subtitle hover:text-heading transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/prs" 
            className="text-sm font-medium text-subtitle hover:text-heading transition-colors"
          >
            PRs
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

