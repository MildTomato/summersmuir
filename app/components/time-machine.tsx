'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  image?: string;
}

interface TimeMachineProps {
  posts: Post[];
}

export function TimeMachine({ posts }: TimeMachineProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(4, Math.floor(posts.length / 3)));
  const [dragProgress, setDragProgress] = useState(0); // -1 to 1, tension before snap
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const snapThreshold = 0.25; // Must scroll 25% to snap to next card

  // Snap logic - if past threshold, go to next/prev card
  const handleRelease = () => {
    if (Math.abs(dragProgress) > snapThreshold) {
      const direction = dragProgress > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(posts.length - 1, activeIndex + direction));
      setActiveIndex(newIndex);
    }
    setDragProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((current) => Math.max(0, current - 1));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((current) => Math.min(posts.length - 1, current + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts.length]);

  // Scroll with tension/snap
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      scrollAccumulator.current += e.deltaY * 0.012;
      
      setDragProgress((current) => {
        const newProgress = current + scrollAccumulator.current;
        scrollAccumulator.current = 0;
        
        // If we've crossed threshold, snap immediately
        if (Math.abs(newProgress) > 1) {
          const direction = newProgress > 0 ? 1 : -1;
          const newIndex = Math.max(0, Math.min(posts.length - 1, activeIndex + direction));
          setTimeout(() => {
            setActiveIndex(newIndex);
            setDragProgress(0);
          }, 0);
          return 0;
        }
        
        return Math.max(-1, Math.min(1, newProgress));
      });
    };

    const handleWheelEnd = () => {
      handleRelease();
    };

    let wheelTimeout: NodeJS.Timeout;
    const handleWheelWithDebounce = (e: WheelEvent) => {
      handleWheel(e);
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(handleWheelEnd, 40);
    };

    container.addEventListener('wheel', handleWheelWithDebounce, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelWithDebounce);
      clearTimeout(wheelTimeout);
    };
  }, [posts.length, activeIndex]);

  // For timeline calculations
  const scrollPosition = activeIndex;

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-subtitle">No posts yet.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-[80vh] w-full cursor-ns-resize overflow-hidden"
    >
      {/* Perspective container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Cards stack */}
        <div className="relative w-full max-w-3xl h-[500px]" style={{ transformStyle: 'preserve-3d' }}>
          {posts.map((post, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Base positions - cards drift into distance both directions
            let translateY = offset * 45;
            let translateZ = -absOffset * 60;
            let rotateX = 0;
            let opacity = Math.max(0.4, 1 - absOffset * 0.08);
            let scale = Math.max(0.7, 1 - absOffset * 0.035);
            
            // Active card - lifts up and tilts as you drag
            if (isActive && Math.abs(dragProgress) > 0.05) {
              translateY = translateY - dragProgress * 100; // Lift up as you scroll
              translateZ = translateZ + Math.abs(dragProgress) * 40; // Come forward
              rotateX = -dragProgress * 12; // Tilt back
            }

            return (
              <motion.div
                key={post.slug}
                className="absolute inset-0 block"
                style={{
                  zIndex: 100 - Math.round(absOffset * 10),
                  pointerEvents: isActive ? 'auto' : 'none',
                  transformOrigin: 'center center',
                }}
                animate={{
                  y: translateY,
                  z: translateZ,
                  rotateX,
                  scale,
                  opacity,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 350, 
                  damping: 30,
                }}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                <article 
                  className={`
                    h-full overflow-hidden
                    bg-warm-cream dark:bg-neutral-900
                    shadow-2xl
                  `}
                >
                  {/* Image section */}
                  <div className="relative h-3/5 bg-muted overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📝</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6 h-2/5 flex flex-col justify-center">
                    <h2 className="text-2xl font-light text-heading line-clamp-2">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="mt-2 text-subtitle line-clamp-1">
                        {post.subtitle}
                      </p>
                    )}
                    {post.date && (
                      <time className="mt-3 text-sm text-faded">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline scrubber on right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="contents"
      >
      {(() => {
        // Generate timeline with weeks between oldest and newest post
        const sortedByDate = [...posts].filter(p => p.date).sort((a, b) => 
          new Date(a.date!).getTime() - new Date(b.date!).getTime()
        );
        const oldestDate = sortedByDate[0]?.date ? new Date(sortedByDate[0].date) : new Date();
        const newestDate = sortedByDate[sortedByDate.length - 1]?.date ? new Date(sortedByDate[sortedByDate.length - 1].date) : new Date();
        const totalDays = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Create tick marks - one per week, max 40
        const tickCount = Math.min(Math.max(Math.ceil(totalDays / 7), 10), 40);
        const ticks = [];
        
        for (let i = 0; i <= tickCount; i++) {
          const tickTime = oldestDate.getTime() + (i / tickCount) * (newestDate.getTime() - oldestDate.getTime());
          const tickDate = new Date(tickTime);
          // Check if a post exists within 4 days of this tick
          const postIndex = posts.findIndex(p => 
            p.date && Math.abs(new Date(p.date).getTime() - tickTime) < 1000 * 60 * 60 * 24 * 4
          );
          ticks.push({ 
            date: tickDate, 
            hasPost: postIndex !== -1, 
            postIndex,
            position: i / tickCount
          });
        }
        
        // Current post position on timeline
        const currentPost = posts[activeIndex];
        const currentTime = currentPost?.date ? new Date(currentPost.date).getTime() : newestDate.getTime();
        const currentPosition = (currentTime - oldestDate.getTime()) / (newestDate.getTime() - oldestDate.getTime());
        
        return (
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] flex flex-col items-end select-none"
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const handleDrag = (moveEvent: MouseEvent) => {
                const y = moveEvent.clientY - rect.top;
                const percentage = Math.max(0, Math.min(1, y / rect.height));
                const targetTime = oldestDate.getTime() + percentage * (newestDate.getTime() - oldestDate.getTime());
                // Find nearest post
                let nearestIndex = 0;
                let nearestDiff = Infinity;
                posts.forEach((post, i) => {
                  if (post.date) {
                    const diff = Math.abs(new Date(post.date).getTime() - targetTime);
                    if (diff < nearestDiff) {
                      nearestDiff = diff;
                      nearestIndex = i;
                    }
                  }
                });
                setActiveIndex(nearestIndex);
              };
              const handleUp = () => {
                window.removeEventListener('mousemove', handleDrag);
                window.removeEventListener('mouseup', handleUp);
              };
              handleDrag(e.nativeEvent);
              window.addEventListener('mousemove', handleDrag);
              window.addEventListener('mouseup', handleUp);
            }}
          >
            {/* Timeline track */}
            <div className="relative h-full w-24 cursor-pointer">
              {/* Background week tick marks */}
              {ticks.map((tick, i) => (
                <div 
                  key={`week-${i}`}
                  className="absolute right-0"
                  style={{ top: `${tick.position * 100}%`, transform: 'translateY(-50%)' }}
                >
                  <div className="w-2 h-px bg-faded/20" />
                </div>
              ))}
              
              {/* Post tick marks at their actual positions */}
              {posts.map((post, index) => {
                if (!post.date) return null;
                const postTime = new Date(post.date).getTime();
                const postPosition = (postTime - oldestDate.getTime()) / (newestDate.getTime() - oldestDate.getTime());
                const isActive = index === activeIndex;
                
                return (
                  <div 
                    key={post.slug}
                    className="absolute right-0 flex items-center justify-end"
                    style={{ top: `${postPosition * 100}%`, transform: 'translateY(-50%)' }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <motion.div 
                      animate={{
                        width: isActive ? 32 : 20,
                        height: isActive ? 2 : 1,
                        backgroundColor: isActive 
                          ? 'rgb(249, 115, 22)' 
                          : 'rgba(120, 118, 112, 0.4)',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                );
              })}
              
              {/* Floating active date label */}
              <motion.div
                className="absolute right-10 pointer-events-none"
                animate={{ top: `${currentPosition * 100}%` }}
                transition={{ type: 'spring', stiffness: 800, damping: 35 }}
                style={{ transform: 'translateY(-50%)' }}
              >
                <span className="text-xs text-orange-500 whitespace-nowrap font-medium">
                  {currentPost?.date && new Date(currentPost.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </motion.div>
            </div>
            
            {/* Labels */}
            <div className="absolute -top-5 right-0 text-[10px] text-faded">
              {oldestDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </div>
            <div className="absolute -bottom-5 right-0 text-[10px] text-orange-500 font-medium">
              Now
            </div>
          </div>
        );
      })()}
      </motion.div>

      {/* Keyboard hint */}
      <div className="absolute bottom-8 left-8 text-xs text-faded hidden md:block">
        Scroll or drag timeline
      </div>
    </div>
  );
}

