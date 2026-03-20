import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SideQuest — Your next app idea, every morning",
  description:
    "We scan Reddit, HN, and Product Hunt for real pain points and package them into app ideas you can vibe-code this weekend.",
  openGraph: {
    title: "SideQuest — Your next app idea, every morning",
    description:
      "10 curated app ideas in your inbox daily. Sourced from real pain points people are posting about right now.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SideQuest — Your next app idea, every morning",
    description:
      "10 curated app ideas in your inbox daily. Sourced from real pain points people are posting about right now.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
