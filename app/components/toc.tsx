'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const listRef = useRef<HTMLUListElement>(null);

  const updateIndicator = useCallback(() => {
    if (!activeId || !listRef.current) return;
    
    const activeElement = itemRefs.current.get(activeId);
    if (activeElement) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = activeElement.getBoundingClientRect();
      setIndicatorStyle({
        top: itemRect.top - listRect.top,
        height: itemRect.height,
      });
    }
  }, [activeId]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const frame = requestAnimationFrame(() => {
      const article = document.querySelector('article');
      if (!article) return;

      const headings = article.querySelectorAll('h2[id], h3[id]');
      const tocItems: TocItem[] = Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      }));
      setItems(tocItems);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-100px 0px -66% 0px' }
      );

      headings.forEach((heading) => observer?.observe(heading));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  // Update indicator position when activeId changes
  useEffect(() => {
    updateIndicator();
  }, [activeId, updateIndicator]);

  // Also update on items change (after refs are set)
  useEffect(() => {
    if (items.length > 0 && activeId) {
      // Small delay to ensure refs are set
      requestAnimationFrame(updateIndicator);
    }
  }, [items, activeId, updateIndicator]);

  if (items.length === 0) return null;

  return (
    <nav className="space-y-1">
      <p className="text-sm font-medium text-heading mb-3">
        On this page
      </p>
      <ul ref={listRef} className="relative space-y-2 text-sm">
        {/* Background line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border-color" />
        
        {/* Animated active indicator */}
        {activeId && (
          <motion.div
            className="absolute left-0 w-px bg-heading"
            initial={false}
            animate={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
        
        {items.map((item) => (
          <li
            key={item.id}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.id, el);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            style={{ paddingLeft: `${(item.level - 2) * 12 + 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={`block transition-colors ${
                activeId === item.id
                  ? 'text-heading font-medium'
                  : 'text-faded hover:text-subtitle'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
