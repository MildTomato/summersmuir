import type { Metadata } from "next";
import { HoldingPage } from '@/app/components/holding-page';
import { socialImage } from "./social-image";

export const metadata: Metadata = {
  openGraph: {
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialImage],
  },
};

export default function Home() {
  return <HoldingPage />;
}
