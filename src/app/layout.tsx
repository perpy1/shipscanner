import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SideQuest — 10 buildable app ideas, every morning",
  description:
    "We scan Hacker News, Stack Exchange, GitHub and the App Store overnight and distill 10 actionable app ideas every morning. No noise. Just signal.",
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
    <html lang="en" className={`${hankenGrotesk.variable} ${instrumentSerif.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
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
