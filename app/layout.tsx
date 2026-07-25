import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HoldingPage } from "./components/holding-page";
import { ThemeProvider } from "./components/theme-provider";
import { socialMetadata } from "./social-image";
import { isProductionDeployment } from "@/lib/deployment";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jonny.design"),
  ...socialMetadata,
  ...(isProductionDeployment
    ? {
        title: "jonny.design — back soon",
        description: "A new version of jonny.design is taking shape.",
      }
    : {
        title: "jonny.design",
        description: "Personal website and blog",
      }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {isProductionDeployment ? <HoldingPage /> : children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
