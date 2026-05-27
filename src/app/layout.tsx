import type { Metadata, Viewport } from "next";
import { Assistant, IBM_Plex_Sans_Thai } from "next/font/google";
import { Toaster } from 'sonner';
import MainLayout from "@/components/MainLayout";
import SmoothScroll from "@/components/SmoothScroll";
import AuraCursor from "@/components/AuraCursor";
import "./globals.css";

const assistant = Assistant({
  subsets: ["latin"],
  variable: "--font-assistant",
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
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
    url: "https://RennyTXT.github.io/Duit-webside",
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
    <html lang="en" className={`${assistant.variable} ${ibmPlexSansThai.variable} antialiased`}>
      <body className="bg-white text-black min-h-screen flex flex-col font-sans selection:bg-black selection:text-white overflow-x-hidden">
        <div className="grain-overlay" />
        <SmoothScroll>
          <Toaster position="top-center" richColors />
          <MainLayout>
            {children}
          </MainLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}
