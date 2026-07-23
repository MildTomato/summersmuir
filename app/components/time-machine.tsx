'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SharedBlogImage } from './blog-motion';

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
  const initialActiveIndex = Math.min(4, Math.floor(posts.length / 3));
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [dragProgress, setDragProgress] = useState(0); // -1 to 1, tension before snap
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const dragProgressRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const wheelDirectionRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const pointerGestureRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastCoordinate: number;
    lastTime: number;
    axis: 'x' | 'y' | null;
    velocity: number;
    dragged: boolean;
  } | null>(null);

  const snapThreshold = 0.24;
  const gestureDistance = 150;
  const wheelThreshold = 60;
  const wheelIdleDelay = 140;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const updateDragProgress = useCallback((progress: number) => {
    const clampedProgress = Math.max(-1, Math.min(1, progress));
    dragProgressRef.current = clampedProgress;
    setDragProgress(clampedProgress);
  }, []);

  const moveByDirection = useCallback((direction: number) => {
    const currentIndex = activeIndexRef.current;
    const nextIndex = Math.max(0, Math.min(posts.length - 1, currentIndex + direction));

    updateDragProgress(0);

    if (nextIndex === currentIndex) return;

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, [posts.length, updateDragProgress]);

  const finishGesture = useCallback((velocity = 0) => {
    const progress = dragProgressRef.current;
    const hasDistance = Math.abs(progress) >= snapThreshold;
    const hasFlickVelocity = Math.abs(velocity) >= 0.35 && Math.abs(progress) >= 0.06;

    if (hasDistance || hasFlickVelocity) {
      const directionSource = Math.abs(progress) >= 0.01 ? progress : velocity;
      moveByDirection(directionSource > 0 ? 1 : -1);
      return;
    }

    updateDragProgress(0);
  }, [moveByDirection, updateDragProgress]);

  // Advance as soon as a wheel gesture crosses the threshold, then absorb its
  // momentum tail so one deliberate gesture always moves exactly one card.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const endWheelGesture = () => {
      wheelAccumulatorRef.current = 0;
      wheelDirectionRef.current = 0;
      wheelLockedRef.current = false;
      updateDragProgress(0);
      wheelEndTimerRef.current = null;
    };

    const handleWheel = (e: WheelEvent) => {
      // Trackpad pinch-to-zoom is exposed as a ctrl+wheel gesture.
      if (e.ctrlKey) return;

      const dominantDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (dominantDelta === 0) return;

      const modeScale = e.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? container.clientHeight
          : 1;
      const normalizedDelta = dominantDelta * modeScale;
      const direction = normalizedDelta > 0 ? 1 : -1;
      const atStart = activeIndexRef.current === 0 && direction < 0;
      const atEnd = activeIndexRef.current === posts.length - 1 && direction > 0;

      // Once momentum has ended, let a fresh outward gesture scroll the page.
      // Momentum from the gesture that reached the boundary stays contained.
      if ((atStart || atEnd) && !wheelLockedRef.current) {
        endWheelGesture();
        return;
      }

      e.preventDefault();

      if (wheelEndTimerRef.current) {
        clearTimeout(wheelEndTimerRef.current);
      }
      wheelEndTimerRef.current = setTimeout(endWheelGesture, wheelIdleDelay);

      if (wheelLockedRef.current) return;

      if (wheelDirectionRef.current !== 0 && wheelDirectionRef.current !== direction) {
        wheelAccumulatorRef.current = 0;
      }

      wheelDirectionRef.current = direction;
      wheelAccumulatorRef.current += normalizedDelta;

      const progress = wheelAccumulatorRef.current / wheelThreshold;
      updateDragProgress(Math.max(-0.95, Math.min(0.95, progress)));

      if (Math.abs(wheelAccumulatorRef.current) < wheelThreshold) return;

      wheelLockedRef.current = true;
      wheelAccumulatorRef.current = 0;
      moveByDirection(direction);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelEndTimerRef.current) {
        clearTimeout(wheelEndTimerRef.current);
      }
    };
  }, [moveByDirection, posts.length, updateDragProgress]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if ((event.target as HTMLElement).closest('[data-timeline-scrubber]')) return;

    pointerGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastCoordinate: event.clientY,
      lastTime: event.timeStamp,
      axis: null,
      velocity: 0,
      dragged: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.axis) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      gesture.axis = Math.abs(deltaY) >= Math.abs(deltaX) ? 'y' : 'x';
      gesture.lastCoordinate = gesture.axis === 'y' ? event.clientY : event.clientX;
      gesture.lastTime = event.timeStamp;
    }

    const coordinate = gesture.axis === 'y' ? event.clientY : event.clientX;
    const startCoordinate = gesture.axis === 'y' ? gesture.startY : gesture.startX;
    const elapsed = Math.max(1, event.timeStamp - gesture.lastTime);

    gesture.velocity = (gesture.lastCoordinate - coordinate) / elapsed;
    gesture.lastCoordinate = coordinate;
    gesture.lastTime = event.timeStamp;
    gesture.dragged = true;
    suppressClickRef.current = true;

    event.preventDefault();
    updateDragProgress((startCoordinate - coordinate) / gestureDistance);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (gesture.dragged) {
      finishGesture(gesture.velocity);
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    } else {
      updateDragProgress(0);
    }

    pointerGestureRef.current = null;
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveByDirection(-1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveByDirection(1);
    }
  };

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
      style={{ touchAction: 'none' }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Blog post Rolodex"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
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
            const opacity = Math.max(0.4, 1 - absOffset * 0.08);
            const scale = Math.max(0.7, 1 - absOffset * 0.035);
            
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
                  ...(isActive && Math.abs(dragProgress) > 0.01
                    ? { type: 'tween' as const, duration: 0.08, ease: 'easeOut' as const }
                    : { type: 'spring' as const, stiffness: 350, damping: 30 }),
                }}
                aria-hidden={!isActive}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block h-full"
                  tabIndex={isActive ? 0 : -1}
                >
                <article 
                  className={`
                    h-full overflow-hidden
                    bg-warm-cream dark:bg-neutral-900
                    shadow-2xl
                  `}
                >
                  {/* Image section */}
                  {post.image ? (
                    <SharedBlogImage
                      slug={post.slug}
                      src={post.image}
                      alt={post.title}
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="relative h-3/5 overflow-hidden bg-muted"
                        imageClassName="object-cover"
                        preload={index === initialActiveIndex}
                    />
                  ) : (
                    <div className="relative h-3/5 overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                      <span className="text-6xl opacity-20">📝</span>
                    </div>
                  )}
                  
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
        const oldestDateValue = sortedByDate[0]?.date;
        const newestDateValue = sortedByDate.at(-1)?.date;
        const oldestDate = oldestDateValue ? new Date(oldestDateValue) : new Date();
        const newestDate = newestDateValue ? new Date(newestDateValue) : new Date();
        const dateRange = Math.max(1, newestDate.getTime() - oldestDate.getTime());
        const totalDays = Math.ceil(dateRange / (1000 * 60 * 60 * 24));
        
        // Create tick marks - one per week, max 40
        const tickCount = Math.min(Math.max(Math.ceil(totalDays / 7), 10), 40);
        const ticks = [];
        
        for (let i = 0; i <= tickCount; i++) {
          const tickTime = oldestDate.getTime() + (i / tickCount) * dateRange;
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
        const currentPosition = (currentTime - oldestDate.getTime()) / dateRange;

        const updateFromPointer = (clientY: number, element: HTMLDivElement) => {
          const rect = element.getBoundingClientRect();
          const y = clientY - rect.top;
          const percentage = Math.max(0, Math.min(1, y / rect.height));
          const targetTime = oldestDate.getTime() + percentage * dateRange;
          let nearestIndex = 0;
          let nearestDiff = Infinity;

          posts.forEach((post, index) => {
            if (!post.date) return;

            const diff = Math.abs(new Date(post.date).getTime() - targetTime);
            if (diff < nearestDiff) {
              nearestDiff = diff;
              nearestIndex = index;
            }
          });

          activeIndexRef.current = nearestIndex;
          setActiveIndex(nearestIndex);
        };
        
        return (
          <div 
            data-timeline-scrubber
            className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] flex flex-col items-end select-none"
            style={{ touchAction: 'none' }}
            onPointerDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = 'true';
              updateFromPointer(event.clientY, event.currentTarget);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.dataset.dragging !== 'true') return;
              updateFromPointer(event.clientY, event.currentTarget);
            }}
            onPointerUp={(event) => {
              delete event.currentTarget.dataset.dragging;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerCancel={(event) => {
              delete event.currentTarget.dataset.dragging;
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
                const postPosition = (postTime - oldestDate.getTime()) / dateRange;
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
        Scroll, swipe, or drag timeline
      </div>
    </div>
  );
}
