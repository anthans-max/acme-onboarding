import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Acme Onboarding",
  description: "Welcome to Acme Corp — let's get you set up.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-700">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
