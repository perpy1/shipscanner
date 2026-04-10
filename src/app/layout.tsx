import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SideQuest — 10 buildable app ideas, every morning",
  description:
    "We scan Reddit, HN, and Product Hunt overnight and distill 10 actionable app ideas every morning. No noise. Just signal.",
  openGraph: {
    title: "SideQuest — 10 buildable app ideas, every morning",
    description:
      "The internet's pain points, distilled into 10 buildable ideas every morning. Pick one and ship it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SideQuest — 10 buildable app ideas, every morning",
    description:
      "The internet's pain points, distilled into 10 buildable ideas every morning. Pick one and ship it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable} dark h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Ambient background glow */}
        <div className="ambient" />
        <div className="relative z-[1] flex flex-col min-h-full">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
