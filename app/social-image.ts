import type { Metadata } from "next";

export const socialImage = {
  url: "/opengraph-image.gif",
  width: 1200,
  height: 630,
  alt: "jonny.design — Jonny, founding designer and head of design at Supabase",
  type: "image/gif",
};

export const socialMetadata = {
  openGraph: {
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialImage],
  },
} satisfies Metadata;
