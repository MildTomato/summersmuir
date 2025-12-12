import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/app/components/code-block';
import { ImageCarousel } from '@/app/components/image-carousel';
import { HeadingLink } from '@/app/components/heading-link';
import { PRTable } from '@/components/pr-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Let prose handle most styling - only override where needed
    h1: ({ children, ...props }) => (
      <HeadingLink 
        as="h1" 
        className="text-2xl font-medium tracking-tight text-heading mt-10 mb-4" 
        {...props}
      >
        {children}
      </HeadingLink>
    ),
    h2: ({ children, ...props }) => (
      <HeadingLink 
        as="h2" 
        className="text-xl font-medium tracking-tight text-heading mt-8 mb-3" 
        {...props}
      >
        {children}
      </HeadingLink>
    ),
    h3: ({ children, ...props }) => (
      <HeadingLink 
        as="h3" 
        className="text-lg font-medium text-heading mt-6 mb-2" 
        {...props}
      >
        {children}
      </HeadingLink>
    ),
    a: ({ children, href }) => (
      <a 
        href={href} 
        className="text-heading underline underline-offset-2 decoration-muted hover:decoration-subtitle transition-colors"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-border-color pl-4 text-subtitle my-6">
        {children}
      </blockquote>
    ),
    pre: ({ children, ...props }) => {
      const title = (props as { 'data-title'?: string })['data-title'];
      return (
        <CodeBlock title={title}>
          <pre {...props}>{children}</pre>
        </CodeBlock>
      );
    },
    img: (props) => {
      const alt = props.alt || '';
      const isWide = alt.includes('|wide');
      const cleanAlt = alt.replace('|wide', '').trim();
      const caption = props.title;
      
      // If there's a caption, use figure/figcaption
      if (caption) {
        return (
          <figure className={`my-8 ${isWide ? 'wide-image' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-lg w-full"
              {...props}
              alt={cleanAlt}
              title={undefined}
            />
            <figcaption className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 text-[10px]">▶</span>
              <span>{caption}</span>
            </figcaption>
          </figure>
        );
      }
      
      // No caption - just return the img
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          className={`rounded-lg my-8 ${isWide ? 'wide-image' : 'w-full'}`}
          {...props}
          alt={cleanAlt}
        />
      );
    },
    // Table components
    table: ({ children }) => (
      <div className="my-6 rounded-lg border border-border-color overflow-hidden">
        <Table>{children}</Table>
      </div>
    ),
    thead: ({ children }) => <TableHeader>{children}</TableHeader>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => (
      <TableHead className="bg-hover-bg text-heading">
        {children}
      </TableHead>
    ),
    td: ({ children }) => <TableCell>{children}</TableCell>,
    // Custom components
    ImageCarousel,
    PRTable,
    ...components,
  };
}



