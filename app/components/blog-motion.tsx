'use client';

import Image from 'next/image';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';

interface BlogMotionProviderProps {
  children: React.ReactNode;
}

interface SharedBlogImageProps {
  slug: string;
  src: string;
  alt: string;
  sizes: string;
  className: string;
  imageClassName?: string;
  preload?: boolean;
  borderRadius?: string;
}

export function BlogMotionProvider({ children }: BlogMotionProviderProps) {
  return <LayoutGroup id="blog-image-transition">{children}</LayoutGroup>;
}

export function SharedBlogImage({
  slug,
  src,
  alt,
  sizes,
  className,
  imageClassName = 'object-cover',
  preload = false,
  borderRadius = '0px',
}: SharedBlogImageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={shouldReduceMotion ? undefined : `blog-image-${slug}`}
      className={className}
      style={{ borderRadius }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              layout: {
                type: 'spring',
                stiffness: 260,
                damping: 30,
                mass: 0.9,
              },
            }
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={imageClassName}
        preload={preload}
      />
    </motion.div>
  );
}
