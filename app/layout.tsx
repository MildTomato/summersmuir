import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { HoldingPage } from "./components/holding-page";
import { ThemeProvider } from "./components/theme-provider";
import { isProductionDeployment } from "@/lib/deployment";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = isProductionDeployment
  ? {
      title: "jonny.design — back soon",
      description: "A new version of jonny.design is taking shape.",
      robots: {
        index: false,
        follow: false,
      },
    }
  : {
      title: "jonny.design",
      description: "Personal website and blog",
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
          {isProductionDeployment ? (
            <HoldingPage />
          ) : (
            <>
              <Header />
              <div className="pt-16">
                {children}
              </div>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
