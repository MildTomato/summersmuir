"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export function ImageCarousel({ images = [] }: Partial<ImageCarouselProps>) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (images.length === 0) return null;

  return (
    <div className="my-8">
      <Carousel setApi={setApi} className="mx-auto max-w-4xl">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-app-bg/80 backdrop-blur-sm" />
        <CarouselNext className="right-2 bg-app-bg/80 backdrop-blur-sm" />
      </Carousel>
      
      {/* Thumbnails */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "overflow-hidden rounded-md transition-all",
              "w-16 h-12 sm:w-20 sm:h-14",
              "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black",
              current === index
                ? "ring-heading"
                : "ring-transparent opacity-60 hover:opacity-100"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
