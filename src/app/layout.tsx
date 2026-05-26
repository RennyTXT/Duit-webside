import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import { Toaster } from 'sonner';
import MainLayout from "@/components/MainLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DUIT TH | Designed for Better Living",
  description: "Experience the latest evolution of the Duit design language. Precision-crafted pet products and lifestyle furniture from South Korea.",
  keywords: ["pet furniture", "smart pet products", "korean design", "duit th", "luxury pet care"],
  authors: [{ name: "Duit TH" }],
  openGraph: {
    title: "DUIT TH",
    description: "Designed for Better Living",
    url: "https://duit.in.th",
    siteName: "Duit TH Thailand",
    locale: "th_TH",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSansThai.variable} antialiased`}>
      <body className="bg-white text-black min-h-screen flex flex-col font-sans selection:bg-black selection:text-white overflow-x-hidden">
        <div className="grain-overlay" />
        <Toaster position="top-center" richColors />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
